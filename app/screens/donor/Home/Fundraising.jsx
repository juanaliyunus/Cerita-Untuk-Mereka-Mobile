import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "react-native-paper";
import axiosInstance from "../../../service/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Fundraising = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [token, setToken] = useState(null);
  const [name, setname] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [description, setDescription] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [dataOrphanage, setDataOrphanage] = useState([]);
  const [needs, setNeeds] = useState([]); 

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.log("Error fetching token:", error);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchOrphanage = async () => {
      if (!token) return;
      try {
        const response = await axiosInstance.get(`/orphanages?page=0&size=3`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          const newOrphanage = response.data.data.data;
          setDataOrphanage(newOrphanage); 
          setname(newOrphanage.map(item => item.name));
          setAvatar(newOrphanage.map(item => item.avatar));
          setDescription(newOrphanage.map(item => item.description));

          console.log("6", newOrphanage.length);
          if (newOrphanage.length < 15) {
            setHasMore(false);
          }
        } else {
          console.error(
            "Unexpected response structure or data is not an array:",
            response.data.data.data
          );
        }
      } catch (error) {
        console.log("Error fetching orphanage:", error);
      }
    };
    fetchOrphanage();
  }, [token]); 

  useEffect(() => {
    console.log("9");
    const fetchNeeds = async () => {
      if (!token) return;
      try {
        const response = await axiosInstance.get(`/orphanages/needs?page=0`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          const newNeeds = response.data.data.data;
          setNeeds(newNeeds);
        } else {
          console.error(
            "Unexpected response structure or data is not an array:",
            response.data.data
          );
        }
      } catch (error) {
        console.log("Error fetching needs:", error);
      }
    };
    fetchNeeds();
  }, [token]);

  const qty = orphanageId => {
    const need = needs.find(item => item.orphanges_id === orphanageId);
    if (need) {
      return need.quantity;
    }
    return 0;
  };

  const target_qty = orphanageId => {
    const need = needs.find(item => item.orphanges_id === orphanageId);
    if (need) {
      return need.target_quantity;
    }
    return 0;
  };

  const calculateProgress = orphanageId => {
    console.log("Checking needs for orphanageId:", orphanageId);
    console.log("Current needs data:", needs);

    const need = needs.find(item => item.orphanges_id === orphanageId);
    if (need) {
      console.log("16", need.quantity, need.target_quantity);
      return ((need.target_quantity / need.quantity) * 100).toFixed(2);
    }

    console.log("17", need);
    return 0;
  };

  const openModal = orphanage => {
    setSelectedCampaign(orphanage);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCampaign(null);
  };

  const sortedOrphanages = dataOrphanage
    .map(item => ({
      ...item,
      progress: calculateProgress(item.id),
    }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  return (
      <View className="flex-1 bg-[#E0F7FA]">
        <Text className="text-black text-2xl font-bold px-2 py-3">
          Donate Now
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-2 space-x-6"
        >
          {sortedOrphanages.map((item, index) => (
            <Card
              key={index}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
              style={{ width: width * 0.75 }}
            >
              <Image
                source={{
                  uri: `http://10.10.102.142:8080/api/v1/avatars/public/${item.avatar}`,
                }}
                className="w-full h-52 rounded-t-3xl"
                resizeMode="cover"
              />
              <View className="p-5">
                <Text className="text-lg font-semibold mb-1 text-gray-800">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {item.description}
                </Text>
                <Text className="text-xs text-gray-500 mb-4 text-center">
                  Books needed: {qty(item.id)} books, collected: {target_qty(item.id)} books, still needed: {item.progress}%
                </Text>
                <View className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                  <LinearGradient
                    colors={["#34C759", "#2ecc71"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      width: `${item.progress}%`,
                      height: "100%",
                    }}
                  />
                </View>
                <TouchableOpacity
                  className="bg-blue-500 py-3 rounded-full shadow-md"
                  onPress={() => openModal(item)}
                >
                  <Text className="text-black text-center font-semibold">
                    See Active Campaigns
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white rounded-3xl p-8 w-11/12 max-h-5/6 shadow-lg">
              {selectedCampaign && (
                <>
                  <Text className="text-2xl font-bold mb-4 text-gray-800">
                    {selectedCampaign.name}
                  </Text>
                  <Image
                    source={{
                      uri: `http://10.10.102.142:8080/api/v1/avatars/public/${selectedCampaign.avatar}`,
                    }}
                    className="w-full h-52 rounded-xl mb-5"
                    resizeMode="cover"
                  />
                  <Text className="text-base text-gray-700 mb-5 leading-relaxed">
                    {selectedCampaign.description}
                  </Text>
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    Progress:
                  </Text>
                  <View className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                    <LinearGradient
                      colors={["#34C759", "#2ecc71"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        width: `${calculateProgress(selectedCampaign.id)}%`,
                        height: "100%",
                      }}
                    />
                  </View>
                  <Text className="text-base text-gray-700 mb-6">
                    {calculateProgress(selectedCampaign.id)}% of the goal reached
                  </Text>
                  <TouchableOpacity
                    className="bg-blue-500 py-3 rounded-full shadow-md"
                    onPress={closeModal}
                  >
                    <Text className="text-black text-center font-semibold">
                      Close
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>

  );
};

export default Fundraising;

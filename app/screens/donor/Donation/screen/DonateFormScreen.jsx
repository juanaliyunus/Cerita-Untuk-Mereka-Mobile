import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import axiosInstance from "../../../../service/axios";
import { Modal, SegmentedButtons, Provider, Portal } from "react-native-paper";

const DonateFormScreen = ({ route, navigation }) => {
  const { orphanageId } = route.params;
  const [bookName, setBookName] = useState("");
  const [quantityDonated, setQuantityDonated] = useState("");
  const [donationStatus, setDonationStatus] = useState("");
  const [animation] = useState(new Animated.Value(0));
  const [orphanageNeeds, setOrphanageNeeds] = useState([]);
  const [value, setValue] = useState("Need");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrphanageId, setSelectedOrphanageId] = useState(null);

  useEffect(() => {
    console.log("Orphanage ID:", orphanageId);
  }, [orphanageId]);

  useEffect(() => {
    const fetchOrphanageNeeds = async () => {
      const response = await axiosInstance.get(
        `/orphanages/needs/by/${orphanageId}`
      );
      setOrphanageNeeds(response.data.data);
      console.log("Orphanage Needs:", orphanageNeeds);
    };
    fetchOrphanageNeeds();
  }, [orphanageId]);

  const handleDonateNew = async () => {
    setDonationStatus("Pending");
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    try {
      const token = await AsyncStorage.getItem("user_token");
      const response = await axiosInstance.post(
        "/donations",
        {
          book_name: bookName,
          quantity_donated: quantityDonated,
          orphanages_id: orphanageId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setDonationStatus("Shipping");
        console.log("Donation success");
      } else {
        setDonationStatus("Failed");
        console.log("Donation failed");
      }
    } catch (error) {
      setDonationStatus("Failed");
      console.log(error);
    }
  };

  const handleDonate = async (donationData) => {
    setDonationStatus("Pending");
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    try {
      const token = await AsyncStorage.getItem("user_token");
      const response = await axiosInstance.post(
        "/donations",
        {
          book_name: donationData.book_name,
          quantity_donated: donationData.quantity_donated,
          orphanages_id: donationData.orphanages_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setDonationStatus("Shipping");
        console.log("Donation data:", donationData);
      } else {
        setDonationStatus("Failed");
        console.log("Donation failed");
      }
    } catch (error) {
      setDonationStatus("Failed");
      console.log(error);
    }
  };

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  };

  return (
    <Provider>
      <SafeAreaView className="flex-1 bg-[#E0F7FA]">
        <ScrollView>
          <View className="p-6">
      
            <View className="flex-row items-center mb-6">
              <Feather
                name="chevron-left"
                size={28}
                color="#007BFF"
                onPress={() => navigation.goBack()}
              />
              <Text className="text-xl font-bold ml-3 text-gray-800">
                Book Donation Form
              </Text>
            </View>

          
            <View className="bg-white rounded-lg mb-6 shadow-sm p-3">
              <SegmentedButtons
                value={value}
                onValueChange={setValue}
                buttons={[
                  { value: "Need", label: "Books Needed" },
                  { value: "Donated", label: "Books to Donate" },
                ]}
              />
            </View>

       
            {value === "Donated" ? (
              <View className="bg-white rounded-lg p-6 mb-6 shadow-lg">
              {/* Input Book Name */}
              <View className="border-b border-gray-300 mb-5">
                <Text className="text-gray-600 text-xs font-medium mb-2">
                  Book Name
                </Text>
                <TextInput
                  value={bookName}
                  onChangeText={setBookName}
                  className="text-lg py-3 px-4 border border-gray-300 rounded-lg"
                  placeholder="Enter book name"
                  style={{ backgroundColor: "#f9f9f9" }}
                />
              </View>

              <View className="border-b border-gray-300 mb-6">
                <Text className="text-gray-600 text-xs font-medium mb-2">
                  Donation Quantity
                </Text>
                <TextInput
                  value={quantityDonated}
                  onChangeText={setQuantityDonated}
                  keyboardType="numeric"
                  className="text-lg py-3 px-4 border border-gray-300 rounded-lg"
                  placeholder="Enter donation quantity"
                  style={{ backgroundColor: "#f9f9f9" }}
                />
              </View>

       
              <TouchableOpacity
                onPress={() => {
                  handleDonateNew();
                  setBookName("");
                  setQuantityDonated("");
                }}
                className="bg-teal-500 rounded-lg p-4 shadow-lg"
                style={{ elevation: 5 }}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Continue Donation
                </Text>
              </TouchableOpacity>
            </View>

            ) : (
          
          <View className="bg-white rounded-lg p-6 mb-6 shadow-md">
            {orphanageNeeds.map((need) => (
              <View key={need.id} className="flex-row items-center justify-between border-b border-gray-200 mb-5 pb-4">
                

                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {need.book_name}
                  </Text>
                  <Text className="text-md text-gray-600">
                    Quantity: {need.quantity}
                  </Text>
                </View>


                <TouchableOpacity
                  onPress={() => {
                    setSelectedOrphanageId(need.id);
                    setModalVisible(true);
                  }}
                  className="bg-blue-600 rounded-lg py-2 px-4 shadow-md"
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Text className="text-white font-semibold text-sm">
                    Donate
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}


            {donationStatus ? (
              <Animated.View
                style={[
                  { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20 },
                  animatedStyle,
                ]}
                className="shadow-sm"
              >
                <Text className="text-lg font-bold mb-3 text-gray-800">
                  Donation Status
                </Text>
                <Text
                  className={`text-center p-2 ${
                    donationStatus === "Pending"
                      ? "text-yellow-500"
                      : donationStatus === "Shipping"
                      ? "text-blue-500"
                      : "text-green-500"
                  }`}
                >
                  {donationStatus}
                </Text>
              </Animated.View>
            ) : null}
          </View>
        </ScrollView>


        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={{
              backgroundColor: "white",
              padding: 20,
              margin: 20,
              borderRadius: 10,
            }}
          >
            <Text className="text-lg font-bold mb-4 text-gray-800">
              {orphanageNeeds.find((need) => need.id === selectedOrphanageId)
                ?.book_name}
            </Text>
            <View className="border-b border-gray-300 mb-6">
              <Text className="text-gray-500 text-sm mb-1">
                Donation Quantity
              </Text>
              <TextInput
                value={quantityDonated}
                onChangeText={setQuantityDonated}
                placeholder="Enter donation quantity"
                keyboardType="numeric"
                className="text-lg py-2 px-3 border-2 border-gray-300 rounded-md"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                const selectedNeed = orphanageNeeds.find(
                  (need) => need.id === selectedOrphanageId
                );
                if (selectedNeed) {
                  setModalVisible(false);
                  handleDonate({
                    book_name: selectedNeed.book_name,
                    quantity_donated: quantityDonated,
                    orphanages_id: orphanageId,
                  });
                  setQuantityDonated(""); 
                } else {
                  console.error("Book name is still null");
                }
              }}
              className="bg-blue-500 rounded-md p-4 mt-4 shadow-md"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Donate
              </Text>
            </TouchableOpacity>
          </Modal>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
}

export default DonateFormScreen;

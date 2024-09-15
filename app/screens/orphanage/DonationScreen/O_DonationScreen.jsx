import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import axiosInstance from "../../../service/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import { Button, Modal, TextInput, Portal, Provider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import O_BottomTab from "../component/O_BottomTab";

const O_DonationsScreen = () => {
  const [donations, setDonations] = useState([]);
  const [userOrphanageId, setUserOrphanageId] = useState(null);
  const [orphanageId, setOrphanageId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [donorId, setDonorId] = useState(null);
  const [idDonation, setIdDonation] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [clickUserId, setClickUserId] = useState(null);
  const [disabledDonations, setDisabledDonations] = useState([]);

  useEffect(() => {
    const fetchTokenAndOrphanageId = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserOrphanageId(decodedToken.sub);
      }
    };
    fetchTokenAndOrphanageId();
  }, []);

  useEffect(() => {
    if (userOrphanageId) {
      const fetchDonations = async () => {
        const response = await axiosInstance.get(
          `/orphanages/by-user/${userOrphanageId}`
        );

        setOrphanageId(response.data.data.id);
      };
      fetchDonations();
    }
  }, [userOrphanageId]);

  useEffect(() => {
    if (orphanageId) {
      const fetchDonations = async () => {
        const token = await AsyncStorage.getItem("token");

        try {
          const responseDonation = await axiosInstance.get(
            `/donations/orphanage/${orphanageId}?page=0`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setDonations(responseDonation.data.data.data);

          const idDonations = responseDonation.data.data.data.map(
            donation => donation.id
          );
          setIdDonation(idDonations);

          const userIds = responseDonation.data.data.data.map(
            donation => donation.user_id
          );
          setUserId(userIds);
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchDonations();
    }
  }, [orphanageId]);

  const handleSubmitFeedback = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("token", token);
    const feedbackData = {
      donor_id: donorId,
      orphanages_id: orphanageId,
      feedback_text: feedback,
    };

    try {
      const response = await axiosInstance.post("/feedback", feedbackData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Feedback submitted successfully:", response.data);
      Alert.alert("Feedback Submitted", `Your feedback: ${feedback}`);
      setDisabledDonations([...disabledDonations, idDonation]);
    } catch (error) {
      console.error("Error submitting feedback:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    }
  };

  useEffect(() => {
    if (clickUserId) {
      console.log("Click User ID:", clickUserId);
      const fetchDonorId = async () => {
        const response = await axiosInstance.get(`/donors/user/${clickUserId}`);
        setDonorId(response.data.data.id);
        console.log("Donor ID:", response.data.data.id);
      };
      fetchDonorId();
    }
  }, [clickUserId]);

  useEffect(() => {
    if (userId && userId.length > 0) {
      const fetchUsers = async () => {
        const userNames = await Promise.all(
          userId.map(async id => {
            const responseUser = await axiosInstance.get(`/donors/user/${id}`);
            setDonorId(responseUser.data.data.id);
            return responseUser.data.data.fullname;
          })
        );
        setUserName(userNames);
      };
      fetchUsers();
    }
  }, [userId]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F3F4F6" }}>
      <Provider>
        <View className="flex-1 bg-white p-4 shadow-lg rounded-xl">
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">
              Quick Actions
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-blue-600 rounded-md p-4 w-1/2 mr-2 shadow-md"
                onPress={() => navigation.navigate("O_AddNewBook")}
              >
                <Text className="text-white text-center font-medium">
                  Add New Need
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-600 rounded-md p-4 w-1/2 shadow-md"
                onPress={() => navigation.navigate("O_Feedback")}
              >
                <Text className="text-white text-center font-medium">
                  Feedback History
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="bg-gray-50 rounded-lg shadow-sm mb-16">
            <Text className="text-xl font-semibold p-4 border-b border-gray-300 text-gray-700">
              Donations List
            </Text>
            {Array.isArray(donations) &&
              donations.map((donation, index) => (
                <View
                  key={donation.id}
                  className="flex-row justify-between p-4 border-b border-gray-200"
                >
                  <View>
                    <Text className="text-gray-800 font-medium">
                      Donor Name: {userName && userName[index]}
                    </Text>
                    <Text className="text-gray-600">
                      Book Title: {donation && donation.book_name}
                    </Text>
                    <Text className="text-gray-600">
                      Quantity: {donation && donation.quantity_donated}
                    </Text>
                  </View>
                  <View className="flex-col items-center">
                    <Text
                      className={`py-1 px-3 rounded-full text-white font-medium mb-2 ${
                        donation.status === "pending" || donation.status === "Pending"
                          ? "bg-yellow-400"
                          : donation.status === "delivered" || donation.status === "Delivered"
                          ? "bg-green-500"
                          : donation.status === "rejected" || donation.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {donation.status}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setIdDonation(donation.id);
                        setClickUserId(donation.user_id);
                        setModalVisible(true);
                      }}
                      disabled={
                        disabledDonations.includes(donation.id) ||
                        ["pending", "rejected", "Pending", "Rejected"].includes(
                          donation.status
                        )
                      }
                    >
                      <Text
                        className={`px-3 py-2 rounded-md font-medium ${
                          disabledDonations.includes(donation.id) ||
                          ["pending", "rejected", "Pending", "Rejected"].includes(
                            donation.status
                          )
                            ? "text-gray-500 bg-gray-200"
                            : "text-blue-600 bg-blue-100"
                        }`}
                      >
                        Feedback
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
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
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Feedback
              </Text>
              <TextInput
                mode="outlined"
                placeholder="Enter your feedback"
                value={feedback}
                onChangeText={setFeedback}
                style={{ marginBottom: 10 }}
              />
              <Button
                mode="contained"
                onPress={async () => {
                  setModalVisible(false);
                  await handleSubmitFeedback();
                }}
                disabled={!feedback}
              >
                Submit
              </Button>
            </Modal>
          </Portal>
        </View>
      </Provider>
      <O_BottomTab />
    </SafeAreaView>
  );
};

export default O_DonationsScreen;
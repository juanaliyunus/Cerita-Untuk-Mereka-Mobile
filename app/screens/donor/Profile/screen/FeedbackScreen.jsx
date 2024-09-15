import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import axiosInstance from "../../../../service/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const FeedbackScreen = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [donorId, setDonorId] = useState(null); // Ubah inisialisasi menjadi null
  const [orphanagesId, setOrphanagesId] = useState([]);
  const [orphanagesName, setOrphanagesName] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;
        try {
          const response = await axiosInstance.get(
            `/donors/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setDonorId(response.data.data.id);
        } catch (error) {
          console.error("Error fetching donor ID:", error);
        }
      } else {
        console.log("Token not found");
      }
    };

    fetchFeedback();
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!donorId) return;

      const url = `/feedback/by-donor/${donorId}?page=0`;
      console.log("Fetching feedback from URL:", url);
      try {
        const response = await axiosInstance.get(url);
        setFeedbackList(response.data.data.data);
        setOrphanagesId(response.data.data.data.map(feedback => feedback.orphanages_id));
      } catch (error) {
        console.error("Error fetching FB:", error);
      }
    };

    if (donorId) {
      fetchFeedback();
    }
  }, [donorId]);

  useEffect(() => {
    const fetchOrphanages = async () => {
      try {
        const orphanageNames = await Promise.all(
          orphanagesId.map(async orphanagesId => {
            const url = `/orphanages/${orphanagesId}`;
            console.log("Fetching orphanage from URL:", url); 
            const response = await axiosInstance.get(url);
            return response.data.data.name;
          })
        );
        setOrphanagesName(orphanageNames);
        console.log("orphanagesName", orphanageNames);
      } catch (error) {
        console.error("Error fetching orphanages:", error); 
      }
    };

    if (orphanagesId.length > 0) {
      fetchOrphanages();
    }
  }, [orphanagesId]);


  const renderFeedbackItem = ({ item, index }) => (
    <View className="bg-white p-4 rounded-lg mb-3 shadow">
      <Text className="text-lg font-bold">
        {orphanagesName.length > 0 && orphanagesName[index]}
      </Text>
      <Text className="text-base mt-2 mb-3">{item.feedback_text}</Text>
      <Text className="text-sm text-gray-500 text-right">
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 p-5 bg-[#E0F7FA]">
      <Text className="text-2xl font-bold mb-5 text-center">
        Donation Feedback
      </Text>
      <FlatList
        data={feedbackList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))} // Urutkan dari terbaru ke terlama
        renderItem={renderFeedbackItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default FeedbackScreen;

import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import axiosInstance from "../../../service/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

const O_FeedbackScreen = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [donorId, setDonorId] = useState([]);
  const [orphanagesId, setOrphanagesId] = useState([]); 
  const [donorName, setDonorName] = useState([]);
  const [isFeedbackFetched, setIsFeedbackFetched] = useState(false);

  useEffect(() => {
    const fetchOrphanages = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;
        try {
          const response = await axiosInstance.get(
            `/orphanages/by-user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const uniqueOrphanagesId = new Set(orphanagesId);
          uniqueOrphanagesId.add(response.data.data.id);
          setOrphanagesId([...uniqueOrphanagesId]);
          console.log("Orphanages ID:", response.data.data.id);
          setIsFeedbackFetched(true);
        } catch (error) {
          console.error("Error fetching orphanages ID:", error); 
        }
      } else {
        console.log("Token not found");
      }
    };

    fetchOrphanages();
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (orphanagesId.length === 0) {
        console.log("Orphanages ID tidak ditemukan");
        return;
      }
      console.log("Orphanages IDs:", orphanagesId);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("Token tidak ditemukan");
          return;
        }
        console.log("Token:", token); 
        const response = await axiosInstance.get(
          `/feedback/by-orphanages/${orphanagesId}?page=0`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response Feedback:", response.data.data.data); 
        const sortedFeedback = response.data.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setFeedbackList(sortedFeedback);
        if (Array.isArray(sortedFeedback)) {
          const donorIds = sortedFeedback.map(feedback => feedback.donor_id);
          setDonorId([...new Set(donorIds)]);
          setIsFeedbackFetched(true);
          console.log("Donor ID1:", [...new Set(donorIds)]); 
          fetchDonorNames(); 
        } else {
          console.error("Response data bukan array:", response.data.data);
        }
      } catch (error) {
        console.error("Error mengambil feedback:", error); 
      }
    };

    if (orphanagesId.length > 0 && !isFeedbackFetched) {
      fetchFeedback();
    }
  }, [orphanagesId, isFeedbackFetched]);

  useEffect(() => {
    console.log("Feedback List updated:", feedbackList);
  }, [feedbackList]);

  const fetchDonorNames = async () => {
    try {
      console.log("Donor ID Fix:", donorId);
      let donorNames = [];
      for (const id of donorId) {
        console.log("Donor ID3:", id);
        const response = await axiosInstance.get(`/donors/${id}`);
        console.log("Response Donor:", response.data.data);
        if (response.status === 200) {
          donorNames.push({ id, fullname: response.data.data.fullname });
        } else {
          console.error(`Error fetching donor name for ID ${id}: ${response.status}`);
          donorNames.push({ id, fullname: "Nama Donor Tidak Ditemukan" });
        }
      }
      const donorNameMap = donorNames.reduce((acc, donor) => {
        acc[donor.id] = donor.fullname;
        return acc;
      }, {});
      setDonorName(donorNameMap);
      console.log("Donor Names:", donorNameMap);
    } catch (error) {
      console.error("Error fetching donor names:", error);
    }
  };

  useEffect(() => {
    if (donorId.length > 0) {
      fetchDonorNames();
    }
  }, [donorId]);

  
  const renderFeedbackItem = ({ item }) => (
    <View className="bg-white p-4 rounded-lg mb-3 shadow">
      <Text className="text-lg font-bold">
        {donorName[item.donor_id] || "Nama Donor Tidak Ditemukan"}
      </Text>
      <Text className="text-base mt-2 mb-3">{item.feedback_text}</Text>
      <Text className="text-sm text-gray-500 text-right">
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <Text className="text-2xl font-bold mb-5 text-center">
        Donation Feedback
      </Text>
      <FlatList
        data={feedbackList}
        renderItem={renderFeedbackItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default O_FeedbackScreen;
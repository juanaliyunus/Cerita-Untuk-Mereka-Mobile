import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../../service/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const O_HistoryScreen = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [orphanageId, setOrphanageId] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [orphanageNames, setOrphanageNames] = useState({});

  useEffect(() => {
    const fetchTokenAndUserId = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setOrphanageId(decodedToken.sub);
        console.log("userId", decodedToken.sub);
      }
    };
    fetchTokenAndUserId();
  }, []);

  useEffect(() => {
    if (orphanageId) {
      const fetchDonationHistory = async () => {
        const response = await axiosInstance.get(
          `/donations/orphanage/${orphanageId}?page=${page}&size=15`
        );
        const newDonations = response.data.data.data;
        console.log("newDonations", newDonations);
        if (Array.isArray(newDonations)) {
          setDonationHistory(prevDonations => [
            ...prevDonations,
            ...newDonations,
          ]);
          setHasMore(newDonations.length === 15);
          fetchOrphanageNames(newDonations);
        } else {
          console.error("Data yang diterima bukan array:", newDonations);
        }
        console.log(newDonations);
      };
      fetchDonationHistory();
    }
  }, [orphanageId, page]);

  const fetchOrphanageNames = async (donations) => {
    const orphanageIds = donations.map(donation => donation.orphanages_id);
    console.log("orphanageIds", orphanageIds);
    const uniqueOrphanageIds = [...new Set(orphanageIds)];
    console.log("uniqueOrphanageIds", uniqueOrphanageIds);
    const orphanageNamesTemp = {};
    for (const id of uniqueOrphanageIds) {
      const response = await axiosInstance.get(`/orphanages/${id}`);
      console.log("response", response.data.data);
      orphanageNamesTemp[id] = response.data.data.name;
      console.log("orphanageNamesTemp", orphanageNamesTemp);
    }
    setOrphanageNames(prevNames => ({ ...prevNames, ...orphanageNamesTemp }));
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#E0F7FA" }}>
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold text-center mb-4">
          Donation History
        </Text>
        {donationHistory.length === 0 ? (
          <Text className="text-center text-gray-600">
            No donation history found.
          </Text>
        ) : (
          donationHistory.map(donation => (
            <View
              key={donation.id}
              className="bg-white rounded-xl p-4 mb-4 shadow-md"
            >
              <Text className="text-lg font-bold mb-1">
                {donation.book_name}
              </Text>
              <Text className="text-gray-600 mb-1">
                Quantity: {donation.quantity_donated}
              </Text>
              <Text className="text-gray-600 mb-1">
                Orphanage: {orphanageNames[donation.orphanages_id] || "Loading..."}
              </Text>
              <Text className="text-gray-600 mb-1">
                Date: {new Date(donation.created_at).toLocaleDateString()}
              </Text>
              <Text
                className={`font-semibold mt-2 ${
                  donation.status === "Delivered"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}
              >
                Status: {donation.status.replace(/[^a-zA-Z]/g, '')}
              </Text>
            </View>
          ))
        )}
        {hasMore && <Button title="See More" onPress={loadMore} />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default O_HistoryScreen;

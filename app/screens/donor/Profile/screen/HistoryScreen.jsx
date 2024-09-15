import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../../../service/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const HistoryScreen = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [orphanageNames, setOrphanageNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenAndUserId = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.sub);
      }
    };
    fetchTokenAndUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchDonationHistory = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/donations/user/${userId}?page=${page}&size=15`
          );
          const newDonations = response.data.data.data;
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
        } catch (error) {
          console.error("Error fetching donation history:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDonationHistory();
    }
  }, [userId, page]);

  const fetchOrphanageNames = async (donations) => {
    const orphanageIds = donations.map(donation => donation.orphanages_id);
    const uniqueOrphanageIds = [...new Set(orphanageIds)];
    const orphanageNamesTemp = {};
    for (const id of uniqueOrphanageIds) {
      try {
        const response = await axiosInstance.get(`/orphanages/${id}`);
        orphanageNamesTemp[id] = response.data.data.name;
      } catch (error) {
        console.error(`Error fetching orphanage name for ID ${id}:`, error);
      }
    }
    setOrphanageNames(prevNames => ({ ...prevNames, ...orphanageNamesTemp }));
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E0F7FA" }}>
      <Text className="text-2xl font-bold text-center mb-4">Donation History</Text>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : donationHistory.length === 0 ? (
          <Text className="text-center text-gray-600">No donation history found.</Text>
        ) : (
          donationHistory.map(donation => (
            <View
              key={donation.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                shadowColor: "#000000",
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <Text className="text-lg font-bold mb-2">{donation.book_name}</Text>
              <Text className="text-gray-600 mb-1">Quantity: {donation.quantity_donated}</Text>
              <Text className="text-gray-600 mb-1">
                Orphanage: {orphanageNames[donation.orphanages_id] || "Loading..."}
              </Text>
              <Text className="text-gray-600 mb-1">
                Date: {new Date(donation.created_at).toLocaleDateString()}
              </Text>
              <Text
                style={{
                  fontWeight: '600',
                  color: donation.status === "Delivered" ? "#4CAF50" : "#FFEB3B",
                }}
              >
                Status: {donation.status.replace(/[^a-zA-Z]/g, '')}
              </Text>
            </View>
          ))
        )}
        {donationHistory.length > 8 && hasMore && (
          <TouchableOpacity
            style={{
              backgroundColor: "#007BFF",
              paddingVertical: 12,
              borderRadius: 25,
              marginVertical: 16,
              alignItems: "center",
            }}
            onPress={loadMore}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
              See More
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;

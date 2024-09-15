import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ProgressBarAndroid,
  TouchableOpacity,
} from "react-native";
import { styled } from "nativewind";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../../../service/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const O_Feeds = () => {
  const [kebutuhanBuku, setKebutuhanBuku] = useState({
    total: 0,
    terpenuhi: 0,
  });
  const [donasiTerbaru, setDonasiTerbaru] = useState([]);
  const [umpanBalikTerbaru, setUmpanBalikTerbaru] = useState([]);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [needs, setNeeds] = useState([]);
  const [orphanageId, setOrphanageId] = useState(null);
  const [donationProgress, setDonationProgress] = useState([]);
  const [donationPercentage, setDonationPercentage] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalTargetQuantity, setTotalTargetQuantity] = useState(0);
  const [dateDonation, setDateDonation] = useState([]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          const decoded = jwtDecode(storedToken);
          setUserId(decoded.sub);
        }
      } catch (error) {
        console.log("Error fetching token:", error);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchDonationProgress = async () => {
      try {
        const response = await axiosInstance.get(
          `/orphanages/needs/by/${orphanageId}`
        );
        setDonationProgress(response.data.data);
        console.log("donationProgress: ", response.data.data);
      } catch (error) {
        console.error("Error fetching donation progress:", error);
      }
    };
    fetchDonationProgress();
  }, [orphanageId]);

  useEffect(() => {
    const fetchOrphanageId = async () => {
      try {
        const response = await axiosInstance.get(
          `/orphanages/by-user/${userId}`
        );
        setOrphanageId(response.data.data.id);
      } catch (error) {
        console.error("Error fetching orphanage ID:", error);
      }
    };
    if (userId) {
      fetchOrphanageId();
    }
  }, [userId]);

  useEffect(() => {
    if (orphanageId) {
      const fetchDonations = async () => {
        try {
          const response = await axiosInstance.get(
            `/donations/orphanage/${orphanageId}?page=0&size=15`
          );
          const newDonations = response.data.data.data;
          if (Array.isArray(newDonations)) {
            const donationsWithDonorInfo = await Promise.all(
              newDonations.map(async donation => {
                const donorResponse = await axiosInstance.get(
                  `/donors/user/${donation.user_id}`
                );
                return {
                  ...donation,
                  donor: donorResponse.data.data,
                };
              })
            );
            setDonasiTerbaru(donationsWithDonorInfo);
          } else {
            console.error("Data yang diterima bukan array:", newDonations);
          }
        } catch (error) {
          console.error("Error fetching donations:", error);
        }
      };
      fetchDonations();
    }
  }, [orphanageId]);

  useEffect(() => {
    const fetchNeeds = async () => {
      if (!userId) return;
      const token = await AsyncStorage.getItem("token");
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
      } catch (err) {
        console.log(err);
      }
    };
    fetchNeeds();
  }, [userId]);

  useEffect(() => {
    if (donationProgress && donationProgress.length > 0) {
      console.log("donationProgress1: ", donationProgress);
      const totalQty = donationProgress.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      console.log("totalQuantity: ", totalQty);
      setTotalQuantity(totalQty);

      const totalTargetQty = donationProgress.reduce(
        (sum, item) => sum + item.target_quantity,
        0
      );
      console.log("totalTargetQuantity: ", totalTargetQty);
      setTotalTargetQuantity(totalTargetQty);

      const dateDonation = donationProgress.map(item =>
        new Date(item.created_at).toLocaleDateString()
      );
      console.log("dateDonation: ", dateDonation);
      setDateDonation(dateDonation);

      const percentage = (totalTargetQty / totalQty) * 100;
      setDonationPercentage(
        isNaN(percentage) || !isFinite(percentage) ? 0 : percentage
      );
      console.log("donationPercentage: ", donationPercentage);
    }
  }, [donationProgress]);

  const donationPercentageperWeek = () => {
    const weeks = {};
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    donationProgress.forEach(item => {
      const date = new Date(item.created_at);
      const itemMonth = date.getMonth();
      const itemYear = date.getFullYear();

  
      if (itemMonth === currentMonth && itemYear === currentYear) {
        const weekNumber = Math.ceil(date.getDate() / 7);
        const key = `Week${weekNumber}`;

        if (!weeks[key]) {
          weeks[key] = { qty: 0, target_qty: 0 };
        }
        weeks[key].qty += item.quantity;
        weeks[key].target_qty += item.target_quantity;
      }
    });

    const percentagePerWeek = Object.keys(weeks).map(week => {
      const { qty, target_qty } = weeks[week];
      const percentage = (target_qty / qty) * 100;
      return isNaN(percentage) || !isFinite(percentage) ? 0 : percentage;
    });
    console.log("percentagePerWeek: ", percentagePerWeek);
    return percentagePerWeek;
  };

  const qty = () => {
    return totalQuantity;
  };

  const target_qty = () => {
    return totalTargetQuantity;
  };

  return (
<ScrollView className="flex-1 bg-[#E0F7FA] p-4 ">


  <View className="bg-white rounded-xl shadow-lg p-5 mb-6">
    <Text className="text-xl font-semibold mb-3 text-gray-900">
      Book Needs Status
    </Text>
    <Text className="text-gray-700">{`Total Book Needs: ${qty()} Donations from ${target_qty()} Books`}</Text>
    <View className="w-full bg-gray-300 rounded-full h-4 mt-3 overflow-hidden">
      <View
        className={`h-full rounded-full transition-all duration-300 ${
          donationPercentage < 20
            ? "bg-red-500"
            : donationPercentage < 70
            ? "bg-yellow-500"
            : "bg-green-500"
        }`}
        style={{ width: `${donationPercentage}%` }}
      />
    </View>
    <View className="flex-row items-center justify-center mt-2">
      <Text className="text-sm text-gray-600">Total Donations: </Text>
      <Text
        className={`text-sm font-medium ${
          donationPercentage < 20
            ? "text-red-500"
            : donationPercentage < 70
            ? "text-yellow-500"
            : "text-green-500"
        }`}
      >
        {`${donationPercentage.toFixed(2)}%`}
      </Text>
    </View>
  </View>


  <View className="bg-white rounded-xl shadow-lg p-5 mb-6">
    <Text className="text-xl font-semibold mb-3 text-gray-900">Latest Donations</Text>
    <View className="border border-gray-200 rounded-lg overflow-hidden">
      <View className="flex-row bg-gray-100 p-3">
        <Text className="w-4/12 font-semibold text-center text-gray-700">Donor Name</Text>
        <Text className="w-4/12 font-semibold text-center text-gray-700">Book Name</Text>
        <Text className="w-2/12 font-semibold text-center text-gray-700">Date</Text>
        <Text className="w-2/12 font-semibold text-right text-gray-700">Quantity</Text>
      </View>
      {donasiTerbaru
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(donasi => (
          <View key={donasi.id} className="flex-row p-3 border-t border-gray-200">
            <Text className="w-4/12 text-gray-700">{donasi.donor.fullname}</Text>
            <Text className="w-4/12 text-center text-gray-700">{donasi.book_name}</Text>
            <Text className="w-2/12 text-center text-gray-700">
              {new Date(donasi.created_at).toLocaleDateString()}
            </Text>
            <Text className="w-2/12 text-right text-gray-700">{donasi.quantity_donated}</Text>
          </View>
        ))}
    </View>
  </View>


  <View className="bg-white rounded-xl shadow-lg p-5 mb-6">
    <Text className="text-xl font-semibold mb-3 text-gray-900">
      Donation Graph for {new Date().toLocaleDateString("en-US", { month: "long" })}
    </Text>
    {donationPercentageperWeek().map((percentage, index) => (
      <View key={index} className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-700">{`Week ${index + 1}`}</Text>
        <View
          className="bg-blue-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${percentage || 0}%` }}
        />
      </View>
    ))}
  </View>


  <View className="bg-white rounded-xl shadow-lg p-5 mb-16 ">
    <Text className="text-xl font-semibold mb-3 text-gray-900">
      Book Needs and Donation Quantities
    </Text>
    {needs.map((need, index) => (
      <View key={index} className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-medium text-gray-800">{need.book_name}</Text>
          <Text className="text-sm text-gray-600">
            {`${((need.target_quantity / need.quantity) * 100).toFixed(2)}%`}
          </Text>
        </View>
        <View className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
          <View
            className={`h-full rounded-full transition-all duration-300 ${
              (need.target_quantity / need.quantity) * 100 < 20
                ? "bg-red-500"
                : (need.target_quantity / need.quantity) * 100 < 80
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${(need.target_quantity / need.quantity) * 100}%` }}
          />
        </View>
      </View>
    ))}
  </View>
</ScrollView>

  );
};

export default O_Feeds;

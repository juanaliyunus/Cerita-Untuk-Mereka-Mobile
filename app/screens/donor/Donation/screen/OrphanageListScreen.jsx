import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline"; // Import an icon for the search bar
import axiosInstance from "../../../../service/axios";

const OrphanageCard = ({ item }) => {
  const navigation = useNavigation();

  return (
    <View className="mb-8 bg-[#E0F7FA] rounded-3xl overflow-hidden shadow-2xl">
      <TouchableOpacity
        className="relative"
        onPress={() =>
          navigation.navigate("DonateForm", { orphanageId: item.id })
        }
      >
        <Image
          source={{
            uri: `http://10.10.102.142:8080/api/v1/avatars/public/${item.avatar}`,
          }}
          className="w-full h-64"
          resizeMode="cover"
          style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        />
        <View className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <View className="absolute bottom-0 left-0 p-6">
        <Text 
            className="text-black text-2xl font-extrabold mb-2"
            style={{
              textShadowColor: 'white',
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 1
            }}
          >
         {item.name}
      </Text>
          <Text className="text-black font-bold text-lg">{item.address}</Text>
        </View>
      </TouchableOpacity>

      <View className="mx-24 mt-4 mb-4">
        <TouchableOpacity
          className="bg-green-300 py-4 rounded-full"
          onPress={() => {
            navigation.navigate("DonateForm", { orphanageId: item.id }); // Pass orphanageId only
            console.log(item.id);
          }}
        >
          <Text className="text-black text-center font-bold text-lg">
            Donate Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const OrphanageListScreen = () => {
  const [orphanages, setOrphanages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrphanages, setFilteredOrphanages] = useState(orphanages);
  const [page, setPage] = useState(0);
  const [token, setToken] = useState(null);
  const [hasMore, setHasMore] = useState(true); 

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchOrphanages = async () => {
      if (!token) return; 

      try {
        const response = await axiosInstance.get(`/orphanages?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("Response data:", response.data.data.data); // Log the entire response
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          const newOrphanages = response.data.data.data;
          setOrphanages(prevOrphanages => [
            ...prevOrphanages,
            ...newOrphanages,
          ]);
          setFilteredOrphanages(prevOrphanages => [
            ...prevOrphanages,
            ...newOrphanages,
          ]);
          if (newOrphanages.length < 15) {
            setHasMore(false); 
          }
        } else {
          console.error(
            "Unexpected response structure or data is not an array:",
            response.data.data.data
          );
        }
      } catch (error) {
        console.error("Error fetching orphanages:", error);
      }
    };

    fetchOrphanages();
  }, [page, token]);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredOrphanages(orphanages);
      } else {
        const filteredData = orphanages.filter(orphanage =>
          orphanage.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredOrphanages(filteredData);
      }
    }, 300); 

    return () => clearTimeout(debounceSearch); 
  }, [searchQuery, orphanages]);

  return (
    <SafeAreaView className="flex-1 bg-[#E0F7FA]">
      <View className="bg-gradient-to-r from-indigo-700 to-purple-700 pt-8 pb-8 px-6 rounded-b-3xl shadow-xl">
        <Text className="text-4xl font-extrabold text-black text-center">
          Orphanages
        </Text>
        <Text className="text-lg text-black text-center mt-2">
          Support children in need
        </Text>
        <View className="flex-row items-center bg-white mt-6 px-4 py-3 rounded-full shadow-md">
          <MagnifyingGlassIcon color="#4B5563" size={20} />
          <TextInput
            placeholder="Search orphanages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-gray-700 text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
      <FlatList
        data={filteredOrphanages.slice(
          0,
          Math.min(filteredOrphanages.length, 15)
        )} // Limit to 15 items or less
        keyExtractor={item => `${item.id}`} // Ensure unique key
        renderItem={({ item }) => <OrphanageCard item={item} />}
        contentContainerClassName="px-6 py-8"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 text-lg mt-10">
            No orphanages found
          </Text>
        }
        ListFooterComponent={
          hasMore && (
            <TouchableOpacity
              className="bg-blue-500 py-4 rounded-full mt-4"
              onPress={() => setPage(prevPage => prevPage + 1)}
            >
              <Text className="text-white text-center font-bold text-lg">
                Load More
              </Text>
            </TouchableOpacity>
          )
        }
      />
    </SafeAreaView>
  );
};

export default OrphanageListScreen;

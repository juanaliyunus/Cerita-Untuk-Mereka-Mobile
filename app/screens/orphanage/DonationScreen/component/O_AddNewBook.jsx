import React, { useState } from "react";
import { Input } from "react-native-elements";
import { Button } from "react-native-paper";
import { View, Text, Alert, TouchableOpacity, Image } from "react-native";
import axiosInstance from "../../../../service/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // Perbaiki impor
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function O_AddNewBook({ userId }) {
  const [bookName, setBookName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const navigation = useNavigation();

  const handleAddBook = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token is null");
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;
      console.log("bookName", bookName);

      const response = await axiosInstance.post(
        "/orphanages/needs",
        {
          book_name: bookName,
          quantity: quantity,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Book added successfully:", response.data);
      Alert.alert("Book added successfully");
      setBookName("");
      setQuantity(0);
      navigation.navigate("O_HistoryRequest");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <View className="flex-1 bg-[#E0F7FA] p-4 mt-5">


    <TouchableOpacity onPress={() => navigation.navigate("O_HistoryRequest")} className="mb-4">
      <MaterialIcons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  

    <View className="flex-1 bg-[#E0F7FA] p-6 rounded-2xl shadow-md items-center">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Add New Need</Text>
  

      <Input
        type="text"
        placeholder="Book Name"
        value={bookName}
        className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 mb-4 text-gray-800"
        onChangeText={text => setBookName(text)}
      />
  

      <Input
        type="number"
        keyboardType="numeric"
        placeholder="Quantity"
        value={quantity}
        className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 mb-6 text-gray-800"
        onChangeText={number => setQuantity(number)}
      />
  
  
      <View className="flex-row justify-center w-full">
        <Button
          onPress={handleAddBook}
          className="bg-blue-600 rounded-full py-3 w-full items-center"
        >
          <Text className="text-white font-medium">Add Book</Text>
        </Button>
      </View>
    </View>
  </View>
  
  );
}

export default O_AddNewBook;

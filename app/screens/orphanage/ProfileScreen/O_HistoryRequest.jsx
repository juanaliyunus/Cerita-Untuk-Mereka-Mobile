import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axiosInstance from '../../../service/axios';
import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const OHistoryRequest = () => {
    const navigation = useNavigation();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = await AsyncStorage.getItem('token');
            const decoded = jwtDecode(token);
            const userId = decoded.sub; 
            const response1 = await axiosInstance.get(`/orphanages/by-user/${userId}`);
            const orphanageId = response1.data.data.id;
            console.log("Orphanage ID:", orphanageId);
            const response = await axiosInstance.get(`/orphanages/needs/by/${orphanageId}`);
            if (Array.isArray(response.data.data)) { 
                const newHistory = response.data.data;
                if (JSON.stringify(newHistory) !== JSON.stringify(history)) {
                    setHistory(newHistory);
                }
            } else {
                console.error('Data yang diterima bukan array:', response.data.data);
            }
            console.log("Response Data:", response.data.data);
        };

        const intervalId = setInterval(fetchHistory, 5000); 

        return () => clearInterval(intervalId); 
    }, [history]);

    return (
        <View className="flex-1 bg-[#E0F7FA]">
        <View className="flex-1 rounded-xl p-4 mb-4 shadow-md">
            <Text className="text-2xl font-bold text-center mb-4">
                History Request
            </Text>
            <View className="bg-white rounded-xl p-4 mb-4 shadow-md">
                <View className="flex-row justify-between border-b border-gray-200 pb-2 mb-2">
                    <Text className="w-1/2 font-bold">Book Name</Text>
                    <Text className="w-1/2 font-bold text-center">Quantity</Text>
                </View>
                {history.map((item) => (
                    <View key={item.id} className="flex-row justify-between border-b border-gray-200 py-2">
                        <Text className="w-1/2">{item.book_name}</Text>
                        <Text className="w-1/2 text-center">{item.quantity}</Text>
                    </View>
                ))}
            </View>
            <Button mode="contained" onPress={() => navigation.navigate('O_AddNewBook')} className="bg-blue-500">
                Add New Book
            </Button>
        </View>
        </View>
    );
}

export default OHistoryRequest;

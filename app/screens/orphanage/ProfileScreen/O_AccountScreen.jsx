import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../../service/axios';
import {jwtDecode} from 'jwt-decode';

const AccountScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Not logged in');
        navigation.navigate('Login');
        return;
      }
  
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;
      const userRole = decodedToken.role;
      setRole(userRole);

      let endpoint = `/orphanages/by-user/${userId}`; 

      const response = await axiosInstance.get(endpoint);
      setUserProfile(response.data.data);
      console.log("userProfile", userProfile);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Unauthorized', 'Your session has expired. Please log in again.');
        navigation.navigate('Login');
      } else {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Failed to fetch user profile');
      }
    }
  };

  const handleInputChange = (name, value) => {
    setUserProfile({ ...userProfile, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      console.log('Updating profile with data:', userProfile);
      const endpoint = `/orphanages/${userProfile.id}`;
      const response = await axiosInstance.put(endpoint, userProfile);
      if (response.status === 200) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(userProfile));
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (!userProfile) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Text className="text-3xl font-extrabold text-gray-800 mb-6">My Profile</Text>
        
        <View className="bg-white rounded-xl p-6 mb-6 shadow-lg">
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-lg"
            placeholder="Name"
            value={userProfile.name}
            onChangeText={(text) => handleInputChange('name', text)}
            editable={isEditing}
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-lg"
            placeholder="Email"
            value={userProfile.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            editable={isEditing}
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-lg"
            placeholder="Username"
            value={userProfile.address}
            onChangeText={(text) => handleInputChange('address', text)}
            editable={isEditing}
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-6 text-lg"
            placeholder="Phone Number"
            value={userProfile.phone_number}
            onChangeText={(text) => handleInputChange('phone_number', text)}
            keyboardType="phone-pad"
            editable={isEditing}
          />
          {isEditing ? (
            <TouchableOpacity 
              className="bg-blue-600 p-3 rounded-lg items-center shadow-md mb-4"
              onPress={handleSubmit}
            >
              <Text className="text-white text-lg font-bold">Save Changes</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              className="bg-blue-600 p-3 rounded-lg items-center shadow-md mb-4"
              onPress={() => setIsEditing(true)}
            >
              <Text className="text-white text-lg font-bold">Edit Profile</Text>
            </TouchableOpacity>
          )}
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AccountScreen;

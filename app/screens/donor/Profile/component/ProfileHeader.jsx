import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from '../../../../service/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import * as FileSystem from 'expo-file-system';

function ProfileHeader({ id }) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState(''); 
  const [refresh, setRefresh] = useState(false); 
  const [token, setToken] = useState(null); 
  const [avatarFileName, setAvatarFileName] = useState(''); 

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need your camera roll permissions to change avatar!');
      }
    })();

   
    const fetchDonorData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found.');
        return;
      }
      setToken(token);

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;
      const role = decodedToken.role; 
      const endpoint = role === 'ROLE_DONOR' ? `/donors/user/${userId}` : `/orphanages/by-user/${userId}`;

      try {
        const response = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.data;
        const nameToSet = role === 'ROLE_DONOR' ? userData.fullname : userData.name;
        setName(nameToSet);
        setImage(`http://10.10.102.142:8080/api/v1/avatars/public/${userData.avatar}`);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchDonorData();
  }, [id, refresh]); 

  const handleAvatarChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;
      const fileName = fileUri.split('/').pop().replace(/\s+/g, "_");
      const formData = new FormData();
      formData.append("avatar", {
        uri: fileUri,
        name: fileName,
        type: 'image/jpeg' 
      });
      setAvatarFileName(fileName);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axiosInstance.post("/avatars", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setImage(`http://10.10.102.142:8080/api/v1/avatars/public/${response.data.data.avatar}`);
        setRefresh(!refresh); 
      } catch (error) {
        console.error("Failed to upload avatar:", error.response?.data || "Network error or server is down");
      }
    }
  };

  return (
    <SafeAreaView>
      <View className="bg-gradient-to-r p-6">
        <View className="items-center">
          <Pressable
            className="rounded-full border-4 border-white shadow-lg"
            onPress={handleAvatarChange}
          >
            <View className="w-28 h-28 rounded-full overflow-hidden">
              <Image source={{ uri: image }} className="w-full h-full" />
            </View>
          </Pressable>
          <Text className="text-black text-2xl font-bold mt-4 shadow-sm">{name}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ProfileHeader;

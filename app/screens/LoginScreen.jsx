import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../service/axios';
import CustomButton from '../components/CustomButton';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });

      const { username: userName, role, token } = response.data.data;

      if (!token) {
        throw new Error('No token returned from server');
      }

      const userInfo = { username: userName, role };
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      await AsyncStorage.setItem('token', token);

      dispatch(setUser(userInfo));

      Alert.alert('Success', 'Login successful');

      if (role === 'ROLE_ORPHANAGES') {
        navigation.navigate('O_Home');
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Username atau Password Salah. Periksa Kembali Username dan Password Anda');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-100">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
          Welcome Back!
        </Text>
        <Text className="text-lg text-gray-500 text-center mb-8">
          Please login to continue
        </Text>
        <TextInput
          placeholder="Username"
          className="bg-white px-4 py-3 rounded-lg mb-4 shadow-md text-base"
          placeholderTextColor="gray"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          className="bg-white px-4 py-3 rounded-lg mb-6 shadow-md text-base"
          placeholderTextColor="gray"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <CustomButton
          title="Login"
          onPress={handleLogin}
          className="bg-blue-600 py-3 rounded-lg shadow-md"
          textStyle="text-white font-bold text-lg text-center"
        />
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="text-center text-gray-600 mt-5">
            Don't have an account?{' '}
            <Text className="text-blue-600 font-bold">Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

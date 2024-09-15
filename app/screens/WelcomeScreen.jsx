import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-blue-100">
      <View className="flex-1 justify-center items-center p-6">
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 80, height: 75 }}
        />
        <Text className="text-2xl font-bold text-gray-700 mt-4">Cerita Untuk Mereka</Text>
        <Text className="text-gray-700 text-center mt-2">
          Help orphanages by donating books for a brighter future.
        </Text>

        <Image
          source={require('../../assets/anak.png')}
          style={{ width: '80%', height: undefined, aspectRatio: 1, marginTop: 20 }}
          resizeMode="contain"
        />

<View className="mt-8 w-full px-10">
    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text className="text-gray-600 text-center">
            Have books to donate? <Text className="text-blue-600">Login</Text>
        </Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => navigation.navigate('Register')} className="mt-4">
        <Text className="text-gray-600 text-center">
            New here? <Text className="text-blue-600">Register</Text>
        </Text>
    </TouchableOpacity>
</View>

      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
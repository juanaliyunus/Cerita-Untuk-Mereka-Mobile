import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import BottomTab from './donor/Home/BottomTab';

const DonationScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#E0F7FA' }}>
      
      <LinearGradient
  colors={['#E0F7FA', '#B0D4F1', '#66A9D6']}
  className="p-6 rounded-b-3xl"
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  <Text className="text-4xl font-extrabold mb-2 text-black text-center">
    Empower Young Minds
  </Text>
  <Text className="text-xl font-semibold mb-4 text-black text-center">
    Donate a Book Today
  </Text>
</LinearGradient>

        <View className="p-6">
          <View className="bg-white rounded-3xl shadow-lg p-4 mb-8">
            <Image
              source={{ uri: 'https://bulanproject.org/wp-content/uploads/2020/02/yannis-h-uaPaEM7MiQQ-unsplash-scaled.jpg' }}
              className="w-full h-40 rounded-xl mb-4"
            />
            <Text className="text-lg text-gray-700 mb-4 leading-relaxed">
              By donating books, you're giving children at orphanages the gift of knowledge and imagination. Your generosity helps change lives, one book at a time.
            </Text>
            <View className="flex-row justify-between mb-4">
              <View className="items-center">
                <FontAwesome5 name="book-open" size={28} color="#4c669f" />
                <Text className="text-sm text-gray-600 mt-2">1000+ Books</Text>
              </View>
              <View className="items-center">
                <FontAwesome5 name="child" size={28} color="#4c669f" />
                <Text className="text-sm text-gray-600 mt-2">500+ Children</Text>
              </View>
              <View className="items-center">
                <FontAwesome5 name="home" size={28} color="#4c669f" />
                <Text className="text-sm text-gray-600 mt-2">50+ Orphanages</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="bg-green-400 p-3 w-8/12 rounded-xl shadow-lg flex-row items-center justify-center"
            style={{ alignSelf: 'center' }} 
            onPress={() => navigation.navigate('OrphanageList')}
          >
            <FontAwesome5 name="search" size={20} color="black" style={{ marginRight: 5 }} className="" />
            <Text className="text-black text-center text-lg font-semibold">
              Search Orphanages
            </Text>
          </TouchableOpacity>

          <View className="mt-8 bg-gray-100 p-4 rounded-xl">
            <Text className="text-sm text-gray-600 text-center font-medium">
              "The more that you read, the more things you will know. The more that you learn, the more places you'll go." - Dr. Seuss
            </Text>
          </View>
        </View>
      <BottomTab/>
    </SafeAreaView>
  );
};

export default DonationScreen;

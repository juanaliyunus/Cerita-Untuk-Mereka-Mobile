import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BottomTab = () => {
  const navigation = useNavigation();

  return (
    <View className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <View className="flex-row justify-between h-full max-w-lg mx-auto">
        <TouchableOpacity 
          className="flex-1 items-center justify-center border-r border-gray-200 dark:border-gray-600"
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} className="mb-2 text-softblue-500 dark:text-softblue-400 group-hover:text-softblue-600 dark:group-hover:text-softblue-500" />
          <Text className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 items-center justify-center border-r border-gray-200 dark:border-gray-600"
          onPress={() => navigation.navigate('Donation')}
        >
          <Ionicons name="book" size={24} className="mb-2 text-softblue-500 dark:text-softblue-400 group-hover:text-softblue-600 dark:group-hover:text-softblue-500" />
          <Text className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Donate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 items-center justify-center border-l border-gray-200 dark:border-gray-600"
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={24} className="mb-2 text-softblue-500 dark:text-softblue-400 group-hover:text-softblue-600 dark:group-hover:text-softblue-500" />
          <Text className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">You</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomTab;

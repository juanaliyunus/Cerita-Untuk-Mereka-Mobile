import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function AboutScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-[#E0F7FA]">


      <View className="flex-row items-center p-4 bg-blue-400">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Text className="text-white text-lg">{'←'}</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold ml-4">About Us</Text>
      </View>


      <View className="bg-green-100 h-48 justify-center items-center">
        <Image
          source={{ uri: 'https://readingpartners.org/wp-content/uploads/2020/01/Alaska-Book-Drive.jpg' }} // Replace with your image URI
          className="w-full h-48 rounded-lg mb-4 mt-6"
        />
      </View>


      <View className="p-4">
       
        <Text className="text-gray-800 text-base leading-7">
          At <Text className="font-bold">CeritaUntukMereka</Text>, we believe that every child deserves the opportunity to learn, grow, and dream. Our mission is to bridge the gap between those who have the resources and those who need them, by facilitating book donations to orphanages across the country.
        </Text>
        <Text className="text-gray-800 text-base leading-7 mt-4">
          Each book donated through <Text className="font-bold">CeritaUntukMereka</Text> not only provides educational value but also brings joy and hope to children who need it the most. We partner with orphanages to ensure that your contributions directly impact the lives of these children.
        </Text>
        <Text className="text-gray-800 text-base leading-7 mt-4">
          With over 200 million children lacking access to basic education globally, your donation can make a world of difference. We believe in a future where every child has the tools they need to succeed, and together, we can make that future a reality.
        </Text>
      </View>
    </ScrollView>
  );
}

export default AboutScreen;

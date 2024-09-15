import React from 'react';
import { View, Text, Image, ScrollView, SafeAreaView } from 'react-native';

const GetToKnowUsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#E0F7FA]">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Image
            source={{ uri: 'https://www.whatdowedoallday.com/wp-content/uploads/2013/11/charity-fb.jpg' }}
            className="w-full h-48 rounded-lg mb-4 mt-6"
          />
        <Text className="text-2xl text-center font-bold mb-2 text-blue-900">
            The Journey of Your Book Donations with CeritaUntukMereka
        </Text>

        <Text className="text-base mb-4">
            CeritaUntukMereka is dedicated to bringing the joy of reading to orphanages. With your support, we aim to provide children with the gift of books that can inspire and educate. Here's how it works:
        </Text>

        <View className="mb-4">
            <Text className="text-lg font-semibold mb-2 text-blue-900">1. Choose an orphanage</Text>
            <Text className="text-base">
                Select an orphanage or specific cause within our network where you want to donate books, including literacy programs, educational support, and recreational reading.
            </Text>
        </View>

        <View className="mb-4">
         <Text className="text-lg font-semibold mb-2 text-blue-900">2. We coordinate the donation</Text>
            <Text className="text-base">
                Your book donation is coordinated by our team and delivered to the chosen orphanage.
            </Text>
        </View>

        <View className="mb-4">
         <Text className="text-lg font-semibold mb-2 text-blue-900">3. The books reach the children</Text>
            <Text className="text-base">
                We ensure that the donated books are received by the children who will benefit from them, bringing them stories and knowledge.
            </Text>
        </View>

        <View className="mb-4">
        <Text className="text-lg font-semibold mb-2 text-blue-900">4. See the impact of your donation</Text>
        <Text className="text-base">
            Your book donations not only provide educational resources but also foster a love of reading and learning, making a lasting difference in the lives of these children.
        </Text>
        </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GetToKnowUsScreen;
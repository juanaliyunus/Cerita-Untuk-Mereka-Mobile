import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const GetToKnowUs = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-1 bg-[#E0F7FA] p-4">
        <Text className="text-black text-2xl font-bold my-4">
            Get to know us
        </Text>
          <View className="bg-white rounded-lg overflow-hidden">
             <View className="relative">
                <Image
                source={require('../../../../assets/getToKnowUs.jpg')}
                resizeMode="cover"
                className="w-full h-80"
                />
                 <View className="absolute inset-0 justify-center items-center p-4">
                 <Text 
                    className="text-white text-xl font-semibold text-center my-1 mx-7"
                    style={{
                      textShadowColor: 'black',
                      textShadowOffset: { width: -1, height: 1 },
                      textShadowRadius: 1
                    }}
                   >
                    Follow how CeritaUntukKamu delivers your donation
                  </Text>

                    <TouchableOpacity 
                      className="bg-yellow-500 py-2 px-4 rounded-md"
                      onPress={() => navigation.navigate('GetToKnowUs')}>
                        <Text className="text-white font-medium text-center ">Read more</Text>

                    </TouchableOpacity>
                 </View>
            </View>
         </View>
     </View>
  );
};

export default GetToKnowUs;
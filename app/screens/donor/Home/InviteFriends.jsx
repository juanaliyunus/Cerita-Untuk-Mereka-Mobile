import React from 'react';
import { View, Text, Image, TouchableOpacity, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const InviteFriends = () => {
  const handleInvite = () => {
    const shareOptions = {
      message: 'Join me in supporting this cause! \n\nhttps://www.oxfam.org.uk/donate/donate-to-our-shops/donating-books/',
    };
    Share.share(shareOptions)
      .then((res) => console.log(res))
      .catch((err) => {
        err && console.log(err);
      });
  };

  return (
    <LinearGradient
      colors={['#E0F7FA', '#B2EBF2']}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center p-4 mb-4">
        <View className="bg-white rounded-3xl shadow-lg p-4 -mt-4">
          <Image
            source={require('../../../../assets/share.png')}
            style={{ width: '100%', height: undefined, aspectRatio: 1.3 }}
          />
          <Text className="text-3xl font-bold text-center text-[#00796B]">Share with Friends</Text>
          <Text className="text-lg text-gray-600 mb-3 text-center">Help provide books to those in need</Text>
          <TouchableOpacity
            className="bg-[#00BCD4] py-4 rounded-full shadow-md"
            onPress={handleInvite}
          >
            <Text className="text-white text-lg font-bold text-center">Invite Friends</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default InviteFriends;
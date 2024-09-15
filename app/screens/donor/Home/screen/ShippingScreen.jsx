import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {LinearGradient} from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const ShippingScreen = () => {
  const [shippingStatus, setShippingStatus] = useState('Pending');
  const [animation] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(1));
  const navigation = useNavigation();

  const handleStatusChange = (newStatus) => {
    setShippingStatus(newStatus);
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const animatedStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.15],
        }),
      },
    ],
  };

  const glowStyle = {
    transform: [{ scale: glowAnim }],
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} className="flex-1">
        <ScrollView className="p-4">
          <View className="flex-row items-center mb-6 ">
            <Feather name="chevron-left" size={28} color="#FFF" onPress={() => navigation.goBack()} />
            <Text className="text-2xl font-bold ml-4 text-white">Shipping Status</Text>
          </View>

          <Animated.View
            style={[
              {
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              },
              animatedStyle,
            ]}
          >
            <Text className="text-xl font-bold mb-3 text-center text-gray-800">
              Current Status
            </Text>
            <Animated.Text
              style={[
                {
                  fontSize: 24,
                  fontWeight: 'bold',
                  color:
                    shippingStatus === 'Pending'
                      ? '#FFD700'
                      : shippingStatus === 'Shipping'
                      ? '#1E90FF'
                      : '#32CD32',
                  textAlign: 'center',
                },
                glowStyle,
              ]}
            >
              {shippingStatus}
            </Animated.Text>
          </Animated.View>

          <View className="mt-8 ">
            <TouchableOpacity
              onPress={() => handleStatusChange('Pending')}
              className="rounded-full p-4 mb-6"
              style={{
                backgroundColor: 'rgba(255, 215, 0, 0.8)',
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.8,
                shadowRadius: 20,
              }}
            >
              <Text className="text-center text-lg font-semibold text-white">
                Set as Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleStatusChange('Shipping')}
              className="rounded-full p-4 mb-6"
              style={{
                backgroundColor: 'rgba(30, 144, 255, 0.8)',
                shadowColor: '#1E90FF',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.8,
                shadowRadius: 20,
              }}
            >
              <Text className="text-center text-lg font-semibold text-white">
                Set as Shipping
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleStatusChange('Delivered')}
              className="rounded-full p-4 mb-6"
              style={{
                backgroundColor: 'rgba(50, 205, 50, 0.8)',
                shadowColor: '#32CD32',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.8,
                shadowRadius: 20,
              }}
            >
              <Text className="text-center text-lg font-semibold text-white">
                Set as Delivered
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ShippingScreen;
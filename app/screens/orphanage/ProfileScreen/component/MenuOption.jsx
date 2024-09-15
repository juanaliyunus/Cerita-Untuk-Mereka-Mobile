import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function OrphanageMenuOptions() {
  const navigation = useNavigation();

  const menuItems = [
    { title: 'Profile', icon: '👤', screen: 'O_Account' },
    { title: 'Donations', icon: '💰', screen: 'O_Donation' },
    { title: 'History Request', icon: '📅', screen: 'O_HistoryRequest' },
    { title: 'About us', icon: '❓', screen: 'O_About' },
  ];

  const handlePress = async (item) => {
    if (item.action === 'contact') {
      const emailUrl =
        'mailto:support@sharethemeal.org?subject=ShareTheMeal%20Android%20App%20Support&body=Meta%20data%20needed%20by%20our%20support%20team%20(do%20not%20remove%20or%20modify)%0A%0AOS%20version:%2033%0ABrand:%20samsung,%20Model:%20SM-A325F%0AUser%20id:%2061b600af-a14a-4b5a-82e9-8d941c6a9248%0ABuild%20number%20is%20:%2061505158';

      try {
        const supported = await Linking.canOpenURL(emailUrl);

        if (supported) {
          await Linking.openURL(emailUrl);
        } else {
          Alert.alert("Error", "Email client is not available.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while trying to open the email client.");
        console.error("Failed to open email client:", error);
      }
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <View>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          className="bg-white py-4 px-4 flex-row items-center justify-between border-b border-gray-200"
          onPress={() => handlePress(item)}
        >
          <Text className="text-lg">{item.icon}</Text>
          <Text className="text-lg flex-1 ml-3">{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default OrphanageMenuOptions;

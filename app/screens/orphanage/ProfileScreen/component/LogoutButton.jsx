import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function LogoutButton() {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      className="bg-white py-4 px-4 flex-row items-center justify-between mt-4"
      onPress={handleLogout}
    >
      <Text className="text-lg">🚪</Text>
      <Text className="text-lg flex-1 ml-3">Log out</Text>
    </TouchableOpacity>
  );
}

export default LogoutButton;
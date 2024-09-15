import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSelector } from "react-redux";


const Header = () => {
  const user = useSelector(state => state.user.user);

  return (
    <View className="bg-white flex-row items-center justify-between p-3 px-">
      <TouchableOpacity>
        <Text className="font-bold text-xl" >
          Hello, {user ? user.fullName || user.username : "Guest"}! 
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

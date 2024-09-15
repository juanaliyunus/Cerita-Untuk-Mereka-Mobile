import { View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './donor/Home/Header';
import Feeds from './donor/Home/Feeds';
import BottomTab from './donor/Home/BottomTab';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const user = useSelector(state => state.user.user);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="flex-1">
          <Header user={user} />
          <Feeds />
        </View>
      </ScrollView>
      <BottomTab />
    </SafeAreaView>
  );
}

export default HomeScreen;

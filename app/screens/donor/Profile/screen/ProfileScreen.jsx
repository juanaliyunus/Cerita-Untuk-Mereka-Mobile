import React from 'react';
import ProfileHeader from '../component/ProfileHeader';
import MenuOptions from '../component/MenuOptions';
import LogoutButton from '../component/LogoutButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTab from '../../Home/BottomTab';


export default function ProfileScreen() {
  return (

    <SafeAreaView className="flex-1 bg-[#E0F7FA]">
      <ProfileHeader />
      <MenuOptions />
      <LogoutButton />
      <BottomTab/>
    </SafeAreaView>
  );
}

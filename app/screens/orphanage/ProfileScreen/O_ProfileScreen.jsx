import React from 'react';
import ProfileHeader from './component/ProfileHeader';
import MenuOptions from './component/MenuOption';
import LogoutButton from './component/LogoutButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import O_BottomTab from '../component/O_BottomTab';

export default function O_ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#E0F7FA]">
      <ProfileHeader />
      <MenuOptions />
      <LogoutButton />
      <O_BottomTab/>
    </SafeAreaView>
  );
}

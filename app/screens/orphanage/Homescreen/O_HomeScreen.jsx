import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../donor/Home/Header'
import O_BottomTab from '../component/O_BottomTab'
import O_Feeds from './components/O_Feeds'


const O_HomeScreen = () => {
  const user = useSelector(state => state.user.user)
  return (
    <SafeAreaView className="flex-1 bg-[#E0F7FA]">
        <ScrollView>
          <View className="flex-1">
            <Header user={user} />
            <O_Feeds/>
          </View>
        </ScrollView>
      <O_BottomTab/>
    </SafeAreaView>
  )
}

export default O_HomeScreen;
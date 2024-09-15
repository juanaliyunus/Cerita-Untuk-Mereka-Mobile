import { View, ScrollView } from 'react-native'
import React from 'react'
import GetToKnowUs from './GetToKnowUs'
import Article from './Article'
import InviteFriends from './InviteFriends'
import Fundraising from './Fundraising'

const Feeds = () => {
  return (
    <View style={{flex:1}} className="bg-[#E0F7FA] flex-1">
      <ScrollView style={{marginBottom:40}}>
        <View className="px-4">
          <Fundraising/>
          <GetToKnowUs/>
          <Article/>
          <InviteFriends/>
        </View>
      </ScrollView>
    </View>
  )
}

export default Feeds
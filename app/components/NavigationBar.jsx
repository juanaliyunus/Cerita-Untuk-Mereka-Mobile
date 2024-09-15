import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DonationScreen from '../screens/DonationScreen';
import OrphanageListScreen from '../screens/donor/Donation/screen/OrphanageListScreen';
import DonateFormScreen from '../screens/donor/Donation/screen/DonateFormScreen';
import ProfileScreen from '../screens/donor/Profile/screen/ProfileScreen';
import ShippingScreen from '../screens/donor/Home/screen/ShippingScreen';
import AccountScreen from '../screens/donor/Profile/screen/AccountScreen';
import HistoryScreen from '../screens/donor/Profile/screen/HistoryScreen';
import AboutScreen from '../screens/donor/Profile/screen/AboutScreen';
import FeedbackScreen from '../screens/donor/Profile/screen/FeedbackScreen';
import GetToKnowUsScreen from '../screens/donor/Home/screen/GetToKnowUsScreen';
import O_HomeScreen from '../screens/orphanage/Homescreen/O_HomeScreen';
import O_DonationScreen from '../screens/orphanage/DonationScreen/O_DonationScreen';
import O_ProfileScreen from '../screens/orphanage/ProfileScreen/O_ProfileScreen';
import O_AccountScreen from '../screens/orphanage/ProfileScreen/O_AccountScreen';
import O_AboutScreen from '../screens/orphanage/ProfileScreen/O_AboutScreen';
import O_FeedbackScreen from '../screens/orphanage/ProfileScreen/O_FeedbackScreen';
import O_HistoryScreen from '../screens/orphanage/ProfileScreen/O_HistoryScreen';
import O_AddNewBook from '../screens/orphanage/DonationScreen/component/O_AddNewBook';
import O_HistoryRequest from '../screens/orphanage/ProfileScreen/O_HistoryRequest';

const Stack = createStackNavigator();

const NavigationBar = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Donation" component={DonationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GetToKnowUs" component={GetToKnowUsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrphanageList" component={OrphanageListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Shipping" component={ShippingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DonateForm" component={DonateFormScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="About us" component={AboutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Send feedback" component={FeedbackScreen} options={{ headerShown: false }} />
        <Stack.Screen name="O_Home" component={O_HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="O_Donation" component={O_DonationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="O_Profile" component={O_ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="O_Account" component={O_AccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="O_History" component={O_HistoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="O_Feedback" component={O_FeedbackScreen} options={{ headerShown: false }} />
        <Stack.Screen name="O_About" component={O_AboutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="O_AddNewBook" component={O_AddNewBook} options={{ headerShown: false }} />
        <Stack.Screen name="O_HistoryRequest" component={O_HistoryRequest} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationBar;

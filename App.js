import * as React from 'react';
import {useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MapScreen from "./src/screens/MapScreen";
import ProfileInfoScreen from "./src/screens/ProfileInfoScreen";
import RequestScreen from "./src/screens/RequestScreen";
import { Provider } from 'react-redux';
import store from './src/store';
import AcceptScreen from './src/screens/AcceptScreen';
import { async } from '@firebase/util';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import SignUpDriver from './src/screens/SignUpDriver';
import NotificationScreen from './src/screens/NotificationScreen';
import DriverScreen from './src/screens/DriverScreen';


const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Profile" component={ProfileInfoScreen} />
      <Stack.Screen name="Request" component={RequestScreen} />
      <Stack.Screen name="Accept" component={AcceptScreen} />
      <Stack.Screen name="SignUpDriver" component={SignUpDriver} />
    </Stack.Navigator>
  )
}

export default function App() {
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [showDriver, setShowDriver] = useState(false);
  const [driver, setDriver] = useState(null);

  const handleNotification = () => {
    setShowNotification(val => !val);
  }

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(()=>{

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
    });

    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      if (remoteMessage.data.pToken) {
        setMessage(remoteMessage);
        setShowNotification(true);
      } else {
        setDriver(remoteMessage);
        setShowDriver(true);
      }
    });

    return unsubscribe;

    
  },[])

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
        { showNotification && <NotificationScreen handleNotification={handleNotification} remoteMessage = {message}/> }
        { showDriver && <DriverScreen remoteMessage = {driver}/> }
      </NavigationContainer>
    </Provider>
  )
}
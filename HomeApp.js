import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  AsyncStorage,
  Alert,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import * as Location from 'expo-location';
import * as Linking from 'expo-linking';


import useCachedResources from './hooks/useCachedResources';
// import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';

import { TourTourColors } from './constants/Colors';
import HomeSearchScreen from './screens/HomeSearchScreen';
import CategorySearchScreen from './screens/CategorySearchScreen';
import PlaceDetailScreen from './screens/PlaceDetailScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import MapScreen from './screens/MapScreen';
import MapScreen2 from './screens/MapScreen2';
import GooglePlacesACInput from './components/GooglePlacesACInput';
import CreateReviewScreen from './screens/CreateReviewScreen';
import UpdateReviewScreen from './screens/UpdateReviewScreen';
import AuthScreen from './screens/AuthScreen';
import StartupScreen from './screens/StartupScreen';

const Stack = createStackNavigator();

export default function HomeApp(props) {
  /**
   * HOOKS
   */

  const isLoadingComplete = useCachedResources();
  const client = useApolloClient()

  useEffect(() => {
    handleTakeLocation()
  }, [])

  /**
  * HELPERS
  */
  const handleTakeLocation = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      let revGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      client.writeData({
        data: {
          myLat: location.coords.latitude,
          myLng: location.coords.longitude,
          searchLocCity: `${revGeocode[0].city}, ${revGeocode[0].region}`,
          searchLocLat: location.coords.latitude,
          searchLocLng: location.coords.longitude,
        }
      })
    } catch {
      Alert.alert(
        'Attention!',
        "L'application ne fonctionnera pas si vous ne l'autorisez pas à prendre votre location. Changez vos réglages ou quittez l'application",
        [{ text: 'Changer mes réglages', onPress: () => { Linking.openURL('app-settings:') } }]
      );
    }
  }

  client.writeData({
    data: {
      //This file is on my laptop only, find how to bundle with app
      imageUrl: "file:///Users/bpm19/Documents/Career/TourTour/RNapp/tourtour-rn/assets/images/1200px-Plus_symbol.svg.png",
      imageBase64: null,

    }
  })



  /**
  * RETURN
  */

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle='dark-content' />}
        <NavigationContainer linking={LinkingConfiguration}>
          <Stack.Navigator
            initialRouteName='Startup'
            screenOptions={{
              headerTintColor: 'white',
              headerStyle: { backgroundColor: 'tomato' },
            }}
          >
            <Stack.Screen
              name='Startup'
              component={StartupScreen}
              options={{
                title: 'Startup',
              }}
            />
            <Stack.Screen
              name='Auth'
              component={AuthScreen}
              options={{
                title: 'Auth',
                headerShown: false,
                gestureEnabled: false,
                animationTypeForReplace: 'push',
              }}
            />

            <Stack.Screen
              name='HomeSearch'
              component={HomeSearchScreen}
              options={{
                title: 'Catégories',
                headerShown: false
              }
              }
            />
            <Stack.Screen
              name='CategorySearch'
              component={CategorySearchScreen}
              options={({ route }) => ({
                title: route.params.categoryTitle,
                headerStyle: { backgroundColor: TourTourColors.accent }
              })}
            />
            <Stack.Screen
              name='PlaceDetail'
              component={PlaceDetailScreen}
              options={({ route }) => ({
                title: route.params.name,
                headerStyle: { backgroundColor: TourTourColors.accent },
                headerShown: false,

              })}
            />

            <Stack.Screen
              name='UserProfile'
              component={UserProfileScreen}
              options={({ route }) => ({
                // title: route.params.userName,
                title: route.params.userName,
                headerStyle: { backgroundColor: TourTourColors.accent },
              })}
            />
            <Stack.Screen
              name='AddPlace'
              component={AddPlaceScreen}
              options={{
                title: "Ajouter un endroit",
                headerStyle: { backgroundColor: TourTourColors.accent },
                // headerShown: false,
              }}
            />
            <Stack.Screen
              name='Map'
              component={MapScreen}
              options={{
                title: "Choisir location",
                headerStyle: { backgroundColor: TourTourColors.accent },
                // headerShown: false,
              }}
            />
            <Stack.Screen
              name='Map2'
              component={MapScreen2}
              options={{
                title: "Choisir location",
                headerStyle: { backgroundColor: TourTourColors.accent },
                // headerShown: false,
              }}
            />
            <Stack.Screen
              name='GoogleAC'
              component={GooglePlacesACInput}
              options={{
                title: "Choisir location",
                headerStyle: { backgroundColor: TourTourColors.accent },
                // headerShown: false,
              }}
            />
            <Stack.Screen
              name='CreateReview'
              component={CreateReviewScreen}
              options={{
                title: "Votre Review",
                headerStyle: { backgroundColor: TourTourColors.accent },
                // headerShown: false,
              }}
            />
            <Stack.Screen
              name='UpdateReview'
              component={UpdateReviewScreen}
              options={{
                title: "Votre Review",
                headerStyle: { backgroundColor: TourTourColors.accent },
                // headerShown: false,
              }}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

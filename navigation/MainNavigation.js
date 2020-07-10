import React, { useEffect, useState } from 'react';
import {
  Platform,
  AsyncStorage,
  Alert,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import jwt from 'jwt-decode'
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import useCachedResources from '../hooks/useCachedResources';
import LinkingConfiguration from '../navigation/LinkingConfiguration';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18n from 'i18n-js';

import { TourTourColors } from '../constants/Colors';
import HomeSearchScreen from '../screens/HomeSearchScreen';
import CategorySearchScreen from '../screens/CategorySearchScreen';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AddPlaceScreen from '../screens/AddPlaceScreen';
import MapScreen from '../screens/MapScreen';
import MapScreen2 from '../screens/MapForSearchLocScreen';
import MapForPlaceUpdateScreen from '../screens/MapForPlaceUpdateScreen';
import GooglePlacesACInput from '../components/GooglePlacesACInput';
import UpdateReviewScreen from '../screens/UpdateReviewScreen';
import UpdateMyReviewScreen from '../screens/UpdateMyReviewScreen';
import UpdateMyPlaceScreen from '../screens/UpdateMyPlaceScreen';
import AuthScreen from '../screens/AuthScreen';
import UserEditScreen from '../screens/UserEditScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MyReviewsListScreen from '../screens/MyReviewsListScreen';
import MyPhotosListScreen from '../screens/MyPhotosListScreen';
import UserPlacesListScreen from '../screens/UserPlacesListScreen';
import MyPlacesScreen from '../screens/MyPlacesScreen';
import UserPhotosListScreen from '../screens/UserPhotosListScreen';
import UserReviewsListScreen from '../screens/UserReviewsListScreen';
import { GET_TOKEN } from '../graphql/queries'
import ReviewsListScreen from '../screens/ReviewsListScreen';

const HomeStack = createStackNavigator();
const UserStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const Tab = createBottomTabNavigator()

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: TourTourColors.accent },
        title: i18n.t('Settings')
      }}
    >
      <SettingsStack.Screen
        name='Settings'
        component={SettingsScreen}
      />
    </SettingsStack.Navigator>
  )
}

function UserStackScreen() {
  return (
    <UserStack.Navigator
      initialRouteName="UserEdit"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: TourTourColors.accent }
      }}
    >
      <UserStack.Screen
        name='UserEdit'
        component={UserEditScreen}
        options={{ title: i18n.t('MyProfile') }}

      />
      <UserStack.Screen
        name='MyReviews'
        component={MyReviewsListScreen}
        options={{ title: i18n.t('MyReviews') }}
      />
      <UserStack.Screen
        name='UpdateMyReview'
        component={UpdateMyReviewScreen}
        options={{ title: i18n.t('UpdateReview') }}
      />
      <UserStack.Screen
        name='MyPhotos'
        component={MyPhotosListScreen}
        options={{ title: i18n.t('MyPhotos') }}
      />
      <UserStack.Screen
        name='MyPlaces'
        component={MyPlacesScreen}
        options={{ title: i18n.t('MyPlaces') }}
      />
      <UserStack.Screen
        name='UpdateMyPlace'
        component={UpdateMyPlaceScreen}
        options={{
          title: i18n.t('UpdatePlace'),
        }}
      />
      <UserStack.Screen
        name='MapForPlaceUpdate'
        component={MapForPlaceUpdateScreen}
        options={{
          title: i18n.t('ChooseLocation'),
          gestureEnabled: false
        }}
      />
      <UserStack.Screen
        name='PlaceDetail'
        component={PlaceDetailScreen}
      />
      <UserStack.Screen
        name='ReviewsList'
        component={ReviewsListScreen}
        options={{
          title: "Reviews",
        }}
      />
    </UserStack.Navigator>
  )
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName='HomeSearch'
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: TourTourColors.accent },
      }}
    >
      <HomeStack.Screen
        name='HomeSearch'
        component={HomeSearchScreen}
        options={{
          title: i18n.t('Categories'),
          headerShown: false
        }
        }
      />
      <HomeStack.Screen
        name='CategorySearch'
        component={CategorySearchScreen}

      />
      <HomeStack.Screen
        name='PlaceDetail'
        component={PlaceDetailScreen}
      />

      <HomeStack.Screen
        name='UserProfile'
        component={UserProfileScreen}
        options={({ route }) => ({
          title: route.params.userName,
          headerBackTitle: i18n.t('Back')
        })}
      />
      <HomeStack.Screen
        name='UserPhotos'
        component={UserPhotosListScreen}
        options={({ route }) => ({
          title: route.params.userName,
        })}
      />
      <HomeStack.Screen
        name='UserPlaces'
        component={UserPlacesListScreen}
        options={({ route }) => ({
          title: i18n.t('UserPlaces'),
        })}
      />
      <HomeStack.Screen
        name='AddPlace'
        component={AddPlaceScreen}
        options={{
          title: i18n.t('AddPlace'),
        }}
      />
      <HomeStack.Screen
        name='Map'
        component={MapScreen}
        options={{
          title: i18n.t('ChooseLocation'),
          gestureEnabled: false
        }}
      />
      <HomeStack.Screen
        name='MapForSearchLoc'
        component={MapScreen2}
        options={{
          title: i18n.t('ChooseLocation'),
          gestureEnabled: false
        }}
      />
      <HomeStack.Screen
        name='GoogleAC'
        component={GooglePlacesACInput}
        options={{
          title: i18n.t('ChooseLocation'),
        }}
      />
      <HomeStack.Screen
        name='UpdateReview'
        component={UpdateReviewScreen}
        options={{
          title: "Review",
        }}
      />
      <HomeStack.Screen
        name='UserReviews'
        component={UserReviewsListScreen}
        options={{
          title: "Reviews",
        }}
      />
      <HomeStack.Screen
        name='ReviewsList'
        component={ReviewsListScreen}
        options={{
          title: "Reviews",
        }}
      />
      <UserStack.Screen
        name='UpdateMyPlace'
        component={UpdateMyPlaceScreen}
        options={{
          title: i18n.t('UpdatePlace'),
        }}
      />
      <UserStack.Screen
        name='MapForPlaceUpdate'
        component={MapForPlaceUpdateScreen}
        options={{
          title: i18n.t('ChooseLocation'),
          gestureEnabled: false
        }}
      />
    </HomeStack.Navigator>
  );
}

export default function HomeApp(props) {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const isLoadingComplete = useCachedResources();
  const client = useApolloClient()
  client.onResetStore(() => {
    setIsLoggedIn(false)
    takeMyLocation()
  })
  const { loading, error, data } = useQuery(GET_TOKEN)

  // check if token in device storage
  // need cleanup function ?
  useEffect(() => {
    const tryLogin = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const decodedJwt = jwt(userToken, { complete: true });
        // is this quotes removal really necessary ?
        const sanitizedToken = userToken.replace(/\"/g, "")
        if (userToken !== null) {
          // We have data!!
          client.writeData({
            data: {
              token: sanitizedToken,
              userId: decodedJwt.userId
            }
          })
          setIsLoggedIn(true)
        } else {

          setIsLoggedIn(false)
        }
      } catch (error) {
        // Error retrieving data
        console.log(error)
      }

    }

    tryLogin();
  }, [])

  // check if token in cache
  useEffect(() => {
    if (data?.token) {
      setIsLoggedIn(true)
    }
  }, [data]);

  // is this kosher or should I use async and a cleanup function?
  useEffect(() => {
    takeMyLocation()
  }, [])

  /**
  * HELPERS
  */
  const takeMyLocation = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      // console.log(`Location: ${JSON.stringify(location, undefined, 2)}`)
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
        i18n.t('Warning'),
        i18n.t('LocationWarning'),
        [{ text: i18n.t('ChangeSettings'), onPress: () => { Linking.openURL('app-settings:') } }]
      );
    }
  }

  client.writeData({
    data: {
      //This file is on my laptop only, find how to bundle with app
      imageUrl: "https://res.cloudinary.com/db4mzdmnm/image/upload/v1592273897/no-image-icon-6_zoucqc.png",
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
          {!isLoggedIn ? (
            <HomeStack.Navigator
              // initialRouteName='Startup'
              screenOptions={{
                headerTintColor: 'white',
                headerStyle: { backgroundColor: TourTourColors.accent },
              }}
            >
              <HomeStack.Screen
                name='Auth'
                component={AuthScreen}
                options={{
                  title: 'Auth',
                  headerShown: false,
                  gestureEnabled: false,
                  animationTypeForReplace: 'pop',
                }}
              />
            </HomeStack.Navigator>
          ) : (
              <Tab.Navigator
                initialRouteName="Home"
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                      iconName = focused
                        ? 'ios-search'
                        : 'ios-search';
                    } else if (route.name === 'User') {
                      iconName = focused ? 'ios-contact' : 'ios-contact';
                    }
                    else if (route.name === 'Settings') {
                      iconName = focused ? 'ios-settings' : 'ios-settings';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                  }
                })}
                tabBarOptions={{
                  // activeTintColor: '#f4e87c',
                  activeTintColor: TourTourColors.accent,
                  inactiveTintColor: 'gray',
                  style: {
                    backgroundColor: 'white'
                  },
                  // safeAreaInset: { bottom: 'always', top: 'never' }
                }
                }
              >
                <Tab.Screen options={{ title: i18n.t('Find') }} name="Home" component={HomeStackScreen} />
                <Tab.Screen options={{ title: i18n.t('MyProfile') }} name="User" component={UserStackScreen} />
                <Tab.Screen options={{ title: i18n.t('Settings') }} name="Settings" component={SettingsStackScreen} />
              </Tab.Navigator>
            )
          }
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

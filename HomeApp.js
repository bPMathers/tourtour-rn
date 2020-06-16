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
import useCachedResources from './hooks/useCachedResources';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TourTourColors } from './constants/Colors';
import HomeSearchScreen from './screens/HomeSearchScreen';
import CategorySearchScreen from './screens/CategorySearchScreen';
import PlaceDetailScreen from './screens/PlaceDetailScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import MapScreen from './screens/MapScreen';
import MapScreen2 from './screens/MapScreen2';
import MapForPlaceUpdateScreen from './screens/MapForPlaceUpdateScreen';
import GooglePlacesACInput from './components/GooglePlacesACInput';
import CreateReviewScreen from './screens/CreateReviewScreen';
import UpdateReviewScreen from './screens/UpdateReviewScreen';
import UpdateMyReviewScreen from './screens/UpdateMyReviewScreen';
import UpdateMyPlaceScreen from './screens/UpdateMyPlaceScreen';
import AuthScreen from './screens/AuthScreen';
import UserEditScreen from './screens/UserEditScreen';
import SettingsScreen from './screens/SettingsScreen';
import MyReviewsListScreen from './screens/MyReviewsListScreen';
import MyPhotosListScreen from './screens/MyPhotosListScreen';
import UserPlacesListScreen from './screens/UserPlacesListScreen';
import MyPlacesScreen from './screens/MyPlacesScreen';
import UserPhotosListScreen from './screens/UserPhotosListScreen';
import UserReviewsListScreen from './screens/UserReviewsListScreen';
import { GET_TOKEN } from './graphql/queries'

const HomeStack = createStackNavigator();
const UserStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const Tab = createBottomTabNavigator()

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerTintColor: 'white',
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
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: TourTourColors.accent }
      }}
    >
      <UserStack.Screen
        name='UserEdit'
        component={UserEditScreen}
        options={{ title: 'Mon Profil' }}

      />
      <UserStack.Screen
        name='MyReviews'
        component={MyReviewsListScreen}
        options={{ title: 'Mes Reviews' }}
      />
      <UserStack.Screen
        name='UpdateMyReview'
        component={UpdateMyReviewScreen}
        options={{ title: 'Modifier Review' }}
      />
      <UserStack.Screen
        name='MyPhotos'
        component={MyPhotosListScreen}
        options={{ title: 'Mes Photos' }}
      />
      <UserStack.Screen
        name='MyPlaces'
        component={MyPlacesScreen}
        options={{ title: 'Mes Places' }}
      />
      <UserStack.Screen
        name='UpdateMyPlace'
        component={UpdateMyPlaceScreen}
        options={{
          title: 'Update MyPlace',
        }}
      />
      <UserStack.Screen
        name='MapForPlaceUpdate'
        component={MapForPlaceUpdateScreen}
        options={{
          title: "Choisir location",
          // headerShown: false,
        }}
      />
    </UserStack.Navigator>
  )
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      // initialRouteName='Startup'
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: TourTourColors.accent },
      }}
    >
      <HomeStack.Screen
        name='HomeSearch'
        component={HomeSearchScreen}
        options={{
          title: 'Catégories',
          headerShown: false
        }
        }
      />
      <HomeStack.Screen
        name='CategorySearch'
        component={CategorySearchScreen}
        options={({ route }) => ({
          title: route.params.categoryTitle,
          headerStyle: { backgroundColor: TourTourColors.accent }
        })}
      />
      <HomeStack.Screen
        name='PlaceDetail'
        component={PlaceDetailScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerStyle: { backgroundColor: TourTourColors.accent },
          headerShown: false,

        })}
      />

      <HomeStack.Screen
        name='UserProfile'
        component={UserProfileScreen}
        options={({ route }) => ({
          // title: route.params.userName,
          title: route.params.userName,
          headerStyle: { backgroundColor: TourTourColors.accent },
        })}
      />
      <HomeStack.Screen
        name='UserPhotos'
        component={UserPhotosListScreen}
        options={({ route }) => ({
          // title: route.params.userName,
          title: route.params.userName,
          headerStyle: { backgroundColor: TourTourColors.accent },
        })}
      />
      <HomeStack.Screen
        name='UserPlaces'
        component={UserPlacesListScreen}
        options={({ route }) => ({
          // title: route.params.userName,
          title: "ChangeMe",
          headerStyle: { backgroundColor: TourTourColors.accent },
        })}
      />
      <HomeStack.Screen
        name='AddPlace'
        component={AddPlaceScreen}
        options={{
          title: "Ajouter un endroit",
          headerStyle: { backgroundColor: TourTourColors.accent },
          // headerShown: false,
        }}
      />
      <HomeStack.Screen
        name='Map'
        component={MapScreen}
        options={{
          title: "Choisir location",
          headerStyle: { backgroundColor: TourTourColors.accent },
          // headerShown: false,
        }}
      />
      <HomeStack.Screen
        name='Map2'
        component={MapScreen2}
        options={{
          title: "Choisir location",
          headerStyle: { backgroundColor: TourTourColors.accent },
          // headerShown: false,
        }}
      />
      <HomeStack.Screen
        name='GoogleAC'
        component={GooglePlacesACInput}
        options={{
          title: "Choisir location",
          headerStyle: { backgroundColor: TourTourColors.accent },
          // headerShown: false,
        }}
      />
      <HomeStack.Screen
        name='CreateReview'
        component={CreateReviewScreen}
        options={{
          title: "Votre Review",
          headerStyle: { backgroundColor: TourTourColors.accent },
          // headerShown: false,
        }}
      />
      <HomeStack.Screen
        name='UpdateReview'
        component={UpdateReviewScreen}
        options={{
          title: "Votre Review",
          headerStyle: { backgroundColor: TourTourColors.accent },
          // headerShown: false,
        }}
      />
      <HomeStack.Screen
        name='UserReviews'
        component={UserReviewsListScreen}
        options={{
          title: "Change This",
          headerStyle: { backgroundColor: TourTourColors.accent },
          // headerShown: false,
        }}
      />
      <UserStack.Screen
        name='UpdateMyPlace'
        component={UpdateMyPlaceScreen}
        options={{
          title: 'Update MyPlace',
        }}
      />
      <UserStack.Screen
        name='MapForPlaceUpdate'
        component={MapForPlaceUpdateScreen}
        options={{
          title: "Choisir location",
          // headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

export default function HomeApp(props) {
  /**
   * HOOKS
   */

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const isLoadingComplete = useCachedResources();
  const client = useApolloClient()
  client.onResetStore(() => {
    setIsLoggedIn(false)
    takeLocation()
  })
  const { loading, error, data } = useQuery(GET_TOKEN)
  console.log(data)
  console.log(isLoggedIn)

  // check if token in device storage
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

  // useEffect(() => {
  //   takeLocation()
  // }, [])

  /**
  * HELPERS
  */
  const takeLocation = async () => {
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

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                  }
                })}
                tabBarOptions={{
                  activeTintColor: TourTourColors.accent,
                  inactiveTintColor: 'gray',
                }}>
                <Tab.Screen options={{ title: "Trouver" }} name="Home" component={HomeStackScreen} />
                <Tab.Screen options={{ title: "Mon profil" }} name="User" component={UserStackScreen} />
                <Tab.Screen options={{ title: "Réglages" }} name="Settings" component={SettingsStackScreen} />
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

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import {
  Platform,
  Text,
  TextInput,
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import { TourTourColors } from './constants/Colors';

import HomeSearchScreen from './screens/HomeSearchScreen';
import CategorySearchScreen from './screens/CategorySearchScreen';
import PlaceDetailScreen from './screens/PlaceDetailScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import AddPlaceModalScreen from './screens/AddPlaceModalScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import MapScreen from './screens/MapScreen';

const Stack = createStackNavigator();

export default function HomeApp(props) {
  const isLoadingComplete = useCachedResources();


  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error :(</p>;

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle='dark-content' />}
        <NavigationContainer linking={LinkingConfiguration}>
          <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
              headerTintColor: 'white',
              headerStyle: { backgroundColor: 'tomato' },
            }}
          >
            {/* <Stack.Screen name="Root" component={BottomTabNavigator} /> */}
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
                headerStyle: { backgroundColor: TourTourColors.accent },
                // headerShown: false,
              }}
            />
            <Stack.Screen
              name='AddPlaceModal'
              component={AddPlaceModalScreen}
              options={{
                headerStyle: { backgroundColor: TourTourColors.accent },
                headerShown: false,
              }}
            />
            <Stack.Screen
              name='Map'
              component={MapScreen}
              options={{
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

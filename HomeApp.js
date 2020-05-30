import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, Text, TextInput, Button, StatusBar, StyleSheet, View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';

import HomeSearchScreen from './screens/HomeSearchScreen';

const Stack = createStackNavigator();


export default function HomeApp(props) {


    const isLoadingComplete = useCachedResources();

    // console.log(data)

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error :(</p>;

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
                <NavigationContainer linking={LinkingConfiguration}>
                    <Stack.Navigator initialRouteName="Home2" screenOptions={{
                        headerTintColor: 'white',
                        headerStyle: { backgroundColor: 'tomato' },
                    }}>
                        {/* <Stack.Screen name="Root" component={BottomTabNavigator} /> */}
                        <Stack.Screen
                            name="HomeSearch"
                            component={HomeSearchScreen}
                            options={{ headerShown: false }} />
                        {/* <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{}} /> */}
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
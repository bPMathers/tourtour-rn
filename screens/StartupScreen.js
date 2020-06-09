import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import { useApolloClient } from '@apollo/react-hooks';


const StartupScreen = props => {
  const client = useApolloClient()

  useEffect(() => {
    const tryLogin = async () => {

      try {
        const value = await AsyncStorage.getItem('userToken');
        // console.log(`value: ${value}`)
        if (value !== null) {
          // We have data!!
          // console.log('path taken')
          client.writeData({
            data: {
              token: value
            }
          })
          props.navigation.navigate('HomeSearch')
        } else {

          props.navigation.navigate('Auth')
        }
      } catch (error) {
        // Error retrieving data
        console.log(error)
      }
    }

    tryLogin();
  }, []);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color='blue' />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default StartupScreen;

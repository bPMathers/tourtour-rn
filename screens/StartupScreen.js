import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import { useApolloClient } from '@apollo/react-hooks';
import jwt from 'jwt-decode'


const StartupScreen = props => {
  const client = useApolloClient()

  useEffect(() => {
    const tryLogin = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken !== null) {
          // We have data!!
          const decodedJwt = jwt(userToken, { complete: true });
          client.writeData({
            data: {
              token: userToken,
              userId: decodedJwt.userId
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

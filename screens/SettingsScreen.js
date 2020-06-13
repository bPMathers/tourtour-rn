import React from 'react';
import { View, Text, StyleSheet, Button, AsyncStorage } from 'react-native';
import { useApolloClient } from '@apollo/react-hooks'


const SettingsScreen = () => {
  const client = useApolloClient()

  return (
    <View style={styles.container}>
      <Button title="Temp Logout" color="red" onPress={() => {
        AsyncStorage.removeItem('userToken')
        // props.navigation.navigate('Auth')
        client.resetStore()
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default SettingsScreen
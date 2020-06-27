import React from 'react';
import { View, Text, StyleSheet, Button, AsyncStorage } from 'react-native';
import { useApolloClient } from '@apollo/react-hooks'
import i18n from 'i18n-js'

const SettingsScreen = (props) => {
  const client = useApolloClient()

  return (
    <View style={styles.container}>
      <Button title={i18n.t('Logout')} color="red" onPress={() => {
        AsyncStorage.removeItem('userToken')
        props.navigation.navigate('Home')
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
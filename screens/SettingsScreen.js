import React from 'react';
import { View, Text, StyleSheet, Button, AsyncStorage } from 'react-native';
import { useApolloClient } from '@apollo/react-hooks'
import i18n from 'i18n-js'

import CustomButton from '../components/CustomButton'
import { TourTourColors } from '../constants/Colors'

const SettingsScreen = (props) => {
  const client = useApolloClient()

  return (
    <View style={styles.container}>
      <CustomButton width='50%' title={i18n.t('Logout')} color={TourTourColors.cancel} onPress={() => {
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
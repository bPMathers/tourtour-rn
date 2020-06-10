import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserEditScreen = () => {
  return (
    <View style={styles.container}><Text>UserEdit Screen</Text></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default UserEditScreen;
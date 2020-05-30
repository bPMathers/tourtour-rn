import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, Text, TextInput, Button, StatusBar, StyleSheet, View } from 'react-native';
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';


import useCachedResources from './hooks/useCachedResources';

import HomeApp from './HomeApp'

const client = new ApolloClient({
  //local IP adress  may change. find a way to fetch it dynamically?
  uri: 'http://192.168.100.131:4000/',
});

export default function App(props) {

  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <HomeApp {...props} />
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

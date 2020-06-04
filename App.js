import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, Text, TextInput, Button, StatusBar, StyleSheet, View } from 'react-native';
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';


import useCachedResources from './hooks/useCachedResources';

import HomeApp from './HomeApp'

const cache = new InMemoryCache

const client = new ApolloClient({
  //local IP adress  may change. find a way to fetch it dynamically?
  uri: 'http://192.168.100.131:4000/',
  cache,
  resolvers: {}
});

client.writeData({
  data: {
    lat: 45.517382,
    lng: -73.5599500,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plus_symbol.svg/1200px-Plus_symbol.svg.png"

  }
})

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

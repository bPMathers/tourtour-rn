import React from 'react';
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
    myLat: 0,
    myLng: 0,
    searchLocCity: "",
    searchLocLat: 0,
    searchLocLng: 0,
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


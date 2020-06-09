import React, { useEffect } from 'react';
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';


import useCachedResources from './hooks/useCachedResources';

import HomeApp from './HomeApp'
import { AsyncStorage } from 'react-native';

const cache = new InMemoryCache

// const GET_TOKEN = gql`
// {
//   token @client 
// }
// `;

// const { data: tokenData, client: unusedClient } = useQuery(GET_TOKEN);



let moment = require('moment'); //load moment module to set local language
require('moment/locale/fr'); //for import moment local language file during the application build
moment.locale('fr');//set moment local language to zh-cn

export default function App(props) {

  const client = new ApolloClient({
    //local IP adress  may change. find a way to fetch it dynamically?
    uri: 'http://192.168.100.142:4000/',
    cache,
    resolvers: {},
    // How could we acces token to set this auth header to the context so we don't have to add it on every mutation / query?
    // request: (operation) => {
    //   const token = cachedData.token
    //   operation.setContext({
    //     headers: {
    //       authorization: token ? `Bearer ${token}` : ''
    //     }
    //   })
    // }
  });

  client.writeData({
    data: {
      myLat: 0,
      myLng: 0,
      searchLocCity: "",
      searchLocLat: 0,
      searchLocLng: 0,
      token: "NoClientTokenValueYet"
    }
  })

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


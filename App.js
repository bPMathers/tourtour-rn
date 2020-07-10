import React, { useEffect } from 'react';
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import useCachedResources from './hooks/useCachedResources';

import MainNavigation from './navigation/MainNavigation'
import Translations from './constants/Translations'

i18n.translations = Translations
i18n.locale = Localization.locale;
i18n.fallbacks = true;

// ---- momentjs setup ----
let moment = require('moment');
require('moment/locale/fr');
moment.locale(Localization.locale);

const cache = new InMemoryCache

export default function App(props) {

  const client = new ApolloClient({
    //local IP adress may change. find a way to fetch it dynamically?
    uri: 'http://192.168.100.142:4000/',

    // Production NodeJS app on Heroku
    // uri: 'https://frozen-caverns-07163.herokuapp.com/',
    cache,
    resolvers: {},
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

  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <MainNavigation {...props} />
      </ApolloProvider>
    );
  }
}


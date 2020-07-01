import React, { useEffect } from 'react';
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import useCachedResources from './hooks/useCachedResources';

import MainNavigation from './navigation/MainNavigation'
import Translations from './constants/Translations'

// ---- i18n setup ----
// Set the key-value pairs for the different languages you want to support.
i18n.translations = Translations
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

// ---- momentjs setup ----
let moment = require('moment'); // Load moment module to set local language
require('moment/locale/fr'); // Import moment local language file (other than english) during the application build
moment.locale(Localization.locale); // Set moment local language

const cache = new InMemoryCache

export default function App(props) {

  // Could we use Apollo Link Context to set JWT token on the context of each request ?
  const client = new ApolloClient({
    //local IP adress  may change. find a way to fetch it dynamically?
    // uri: 'https://frozen-caverns-07163.herokuapp.com/',
    uri: 'http://192.168.100.131:4000/',
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


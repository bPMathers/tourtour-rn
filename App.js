import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, Text, TextInput, Button, StatusBar, StyleSheet, View } from 'react-native';
import ApolloClient, { gql } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';


import useCachedResources from './hooks/useCachedResources';

import HomeApp from './HomeApp'


const client = new ApolloClient({
  // change to local node server
  uri: 'http://localhost:4000/',
});
// const client = new ApolloClient({
//   uri: 'http://localhost:4000/',
// });


// const getUsers = gql`
//   query {
//     users{
//       id 
//       name
//     }
//   }
// `

// const testQuery = async () => {
//   const response = await client.query({
//     query: getUsers
//   })
//   console.log(response)
// }

// testQuery();





// function HomeScreen2({ navigation, route }) {
//   React.useEffect(() => {
//     if (route.params?.post) {
//       // Post updated, do something with `route.params.post`
//       // For example, send the post to the server
//     }
//   }, [route.params?.post]);

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Button
//         title="Create post"
//         onPress={() => navigation.navigate('CreatePost')}
//       />
//       <Text style={{ margin: 10 }}>Post: {route.params?.post}</Text>
//     </View>
//   );
// }


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

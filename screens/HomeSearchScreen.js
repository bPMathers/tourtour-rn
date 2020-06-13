import React, { useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  StatusBar,
  AsyncStorage
} from 'react-native';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import CategoryGridTile from '../components/CategoryGridTile';
import Animation from '../components/Animation';

import { GET_CATEGORIES } from '../graphql/queries'


export const HomeSearchScreen = (props) => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [searchInput, setSearchInput] = React.useState();

  const renderGridItem = (itemData) => {
    return (
      <CategoryGridTile
        title={itemData.item.title}
        imgUrl={itemData.item.imageUrl}
        onSelect={() => {
          props.navigation.navigate('CategorySearch', {
            categoryId: itemData.item.id,
            categoryTitle: itemData.item.title
          });
        }}
      />
    );
  };

  if (loading)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.container}>
        <Text>Error...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.animationContainer}>
        <Animation />
      </View>
      <View style={styles.searchSection}>
        <Ionicons
          style={styles.searchIcon}
          name='ios-search'
          size={25}
          color='black'
        />
        <TextInput
          style={styles.searchInput}
          onChangeText={(text) => setSearchInput(text)}
          value={searchInput}
          placeholder='Rechercher'
        />
      </View>

      <FlatList
        data={data.categories}
        renderItem={renderGridItem}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    marginVertical: 10,
    alignItems: 'center',
  },

  titleContainer: {
    marginTop: 60,
    paddingLeft: 10,
  },
  title: {
    color: '#EA027C',
    fontWeight: 'bold',
  },
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: '#a3d6ff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: '#2699FB',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    height: 200,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginTop: 50,
  },
  searchInput: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // marginTop: 50
  },
  searchIcon: {
    padding: 10,
  },
  userList: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeSearchScreen;

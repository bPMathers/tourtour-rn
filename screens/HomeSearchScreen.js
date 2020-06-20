import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import CategoryGridTile from '../components/CategoryGridTile';
import Animation from '../components/Animation';

import { GET_CATEGORIES } from '../graphql/queries'
import { TourTourColors } from '../constants/Colors';
import FadeInView from '../components/fadeInView'



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
    <FadeInView style={styles.container} fadeInDuration={500}>
      <StatusBar barStyle="light-content" />
      <View style={styles.animationContainer}>
        <Animation />
      </View>
      {/*<View style={styles.searchSection}>
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
      </View>*/}
      <FadeInView style={{ marginHorizontal: 2, marginBottom: 180 }} fadeInDuration={1000} yTranslate={100}>
        <FlatList
          data={data.categories}
          renderItem={renderGridItem}
          numColumns={2}
        />
      </FadeInView>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // backgroundColor: '#f5e4d4',
  },
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 45,
    paddingBottom: 20,
    marginBottom: 3,
    backgroundColor: TourTourColors.accent,
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
  // searchSection: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  // },
  // searchIcon: {
  //   padding: 10,
  // },

});

export default HomeSearchScreen;

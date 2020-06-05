import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
} from 'react-native';
// import LottieView from "lottie-react-native";
import { gql } from 'apollo-boost';
import { useApolloClient } from "@apollo/react-hooks";

import { useQuery } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import CategoryGridTile from '../components/CategoryGridTile';
import Animation from '../components/Animation';

const getCategories = gql`
  query {
    categories {
      id
      title
      imageUrl
      addedBy{
        id
        name
      }
    }
  }
`;

export const HomeSearchScreen = (props) => {
  const { loading, error, data } = useQuery(getCategories);
  const [searchInput, setSearchInput] = React.useState();
  const client = useApolloClient()

  const handleTakeLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    let revGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    client.writeData({
      data: {
        searchLocLat: location.coords.latitude,
        searchLocLng: location.coords.longitude,
        searchLocCity: `${revGeocode[0].city}, ${revGeocode[0].region}`,
      }
    })
  }

  const renderGridItem = (itemData) => {
    return (
      <CategoryGridTile
        title={itemData.item.title}
        imgUrl={itemData.item.imageUrl}
        onSelect={() => {
          handleTakeLocation()
          // console.log(itemData.item.id)
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
    // backgroundColor: '#3490dc',
    // marginTop: 30
    // width: 20
    // flex: 1,
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

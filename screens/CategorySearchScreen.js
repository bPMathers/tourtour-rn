import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'

import { TourTourColors } from '../constants/Colors';

import PlacePreviewListItem from '../components/PlacePreviewListItem';

const getPlaces = gql`
  query($catId: String) {
    places(query: $catId) {
      id
      name
      mainPhoto
      category {
        id
      }
    }
  }
`;

const CategorySearchScreen = (props) => {
  const { loading, error, data } = useQuery(getPlaces, {
    variables: {
      catId: props.route.params.categoryId,
    },
  });

  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity style={{ marginRight: 15 }} onPress={() => props.navigation.navigate('UserProfile')}>
        <AntDesign name='plus' size={24} color='white' />
      </TouchableOpacity>
    ),
  });

  const renderGridItem = (itemData) => {
    return (
      <PlacePreviewListItem
        name={itemData.item.name}
        imageUrl={itemData.item.mainPhoto}
        onSelectUserProfile={() => {
          props.navigation.navigate('UserProfile', {
            // userId: itemData.item.addedBy
          });
        }}
        onSelectPlace={() => {
          props.navigation.navigate('PlaceDetail', {
            place: itemData.item,
            title: itemData.item.name
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
      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
        <Text style={{ fontWeight: 'bold' }}>{props.route.params.categoryTitle} </Text>
        <Text>
          près de{' '}
          <Text style={{ fontWeight: 'bold' }}>Montreal, QC</Text>
        </Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.locationButton} color={TourTourColors.accent}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.locationButtonText}>Changer de Location</Text>
            <FontAwesome5 name='map-marker-alt' size={18} color='white' />
          </View>
        </TouchableOpacity>
      </View>
      <FlatList data={data.places} renderItem={renderGridItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  listItem: {
    flex: 1,
    margin: 2,
    height: 150,
    borderRadius: 5,
    elevation: 5,
    overflow: Platform.OS === 'android' ? 'hidden' : 'hidden',
  },
  locationButton: {
    marginVertical: 10,
    paddingVertical: 5,
    backgroundColor: TourTourColors.accent,
    borderRadius: 10,
    width: Dimensions.get("screen").width / 2
  },
  locationButtonText: {
    color: '#fff',
    // textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,

  }
});

export default CategorySearchScreen;

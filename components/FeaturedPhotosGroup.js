import React from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { TourTourColors } from '../constants/Colors'
import FeaturedPhoto from './FeaturedPhoto';

const FeaturedPhotosGroup = (props) => {
  const GET_PHOTOS = gql`
    query($placeId: String) {
      photos(query: $placeId) {
        id
        url
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_PHOTOS, {
    variables: {
      placeId: props.place.id,
    },
  });

  const renderGridItem = (itemData) => {
    return (
      <FeaturedPhoto
        imgUrl={itemData.item.url}
        onSelect={() => {
          // console.log(itemData.item.id)
          // props.navigation.navigate('CategorySearch', {
          //   categoryId: itemData.item.id,
          //   categoryTitle: itemData.item.title
          // });
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
      <FlatList data={data.photos.reverse()} renderItem={renderGridItem} horizontal={true} ItemSeparatorComponent={() => <View style={{ margin: 1 }} />} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})

export default FeaturedPhotosGroup;
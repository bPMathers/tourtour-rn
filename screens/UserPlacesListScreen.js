import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks'

import PlacePreviewListItem from '../components/PlacePreviewListItem'
import { GET_MY_PLACES, GET_TOKEN } from '../graphql/queries'

const MyPlacesScreen = (props) => {
  const { data: tokenData, client: unusedClient } = useQuery(GET_TOKEN);
  const jwtBearer = "".concat("Bearer ", tokenData.token).replace(/\"/g, "")
  const { data: myPlacesData, loading, error } = useQuery(GET_MY_PLACES, {
    context: {
      headers: {
        // Set the token dynamically from cache. 
        Authorization: jwtBearer
      }
    },
  })

  const renderListItem = ({ item }) => {
    return (
      <PlacePreviewListItem place={item} />
    )
  }

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
      <FlatList data={myPlacesData.myPlaces} renderItem={renderListItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  }
})

export default MyPlacesScreen;
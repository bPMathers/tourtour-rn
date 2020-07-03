import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/react-hooks'

import { TourTourColors } from '../constants/Colors'
import PlacePreviewListItem from '../components/PlacePreviewListItem'
import { GET_USER_PLACES, GET_TOKEN } from '../graphql/queries'

const UserPlacesScreen = (props) => {
  const { data: tokenData } = useQuery(GET_TOKEN);
  const jwtBearer = "".concat("Bearer ", tokenData?.token).replace(/\"/g, "")
  const { data: userPlacesData, loading, error } = useQuery(GET_USER_PLACES, {
    context: {
      headers: {
        // Set the token dynamically from cache. 
        Authorization: jwtBearer
      }
    },
    variables: {
      userId: props.route.params.userId
    }
  })

  const renderListItem = ({ item }) => {
    return (
      <PlacePreviewListItem place={item} />
    )
  }

  if (loading)
    return (
      <View style={styles.metaStateContainer}>
        <ActivityIndicator size="large" color={TourTourColors.accent} />
      </View>
    );
  if (error)
    return (
      <View style={styles.metaStateContainer}>
        <Text>Error...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList data={userPlacesData.places} renderItem={renderListItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },
  metaStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

export default UserPlacesScreen;
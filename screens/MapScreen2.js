import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import { useApolloClient, useQuery } from "@apollo/react-hooks";
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons'

import { GET_SEARCH_LOCATION } from '../graphql/queries'

const MapScreen2 = (props) => {
  const client = useApolloClient();
  const [selectedLocation, setSelectedLocation] = useState()
  const [city, setCity] = useState()
  const [mapRgn, setMapRgn] = useState()
  const { loading: searchLocLoading, error: searchLocError, data: searchLocData, refetch } = useQuery(GET_SEARCH_LOCATION)

  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={savePickedLocationHandler}>
        <Ionicons name='ios-save' size={28} color='white' />
      </TouchableOpacity>
    ),
  });


  const savePickedLocationHandler = async () => {
    if (!selectedLocation) {
      Alert.alert(
        'Doyoyoy!',
        'Svp choisir un endroit avant de sauvegarder',
        [{ text: 'Okay' }]
      );
      return
    }

    let revGeocode = await Location.reverseGeocodeAsync({
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    });
    client.writeData({
      data: {
        searchLocLat: selectedLocation.lat,
        searchLocLng: selectedLocation.lng,
        searchLocCity: `${revGeocode[0].city}, ${revGeocode[0].region}`,
      }
    })
    // refetch()

    props.navigation.navigate({
      name: 'CategorySearch',
      params: { dummyParam: Math.random() }
    })
  }

  // const mapRegion = mapRgn

  const selectLocationHandler = event => {
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    })
    // setMapRgn({
    //   latitude: event.nativeEvent.coordinate.latitude,
    //   longitude: event.nativeEvent.coordinate.longitude,
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421
    // })
  }

  const handleOnRegionChangeComplete = (region) => {
    setMapRgn(region)
  }

  let markerCoordinates

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    }
  }

  return (
    <MapView
      provider="google"
      style={styles.map}
      initialRegion={{
        latitude: searchLocData.searchLocLat,
        longitude: searchLocData.searchLocLng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
      onPress={selectLocationHandler}
      onRegionChangeComplete={handleOnRegionChangeComplete}>
      {markerCoordinates && <Marker title="Endroit Choisi" coordinate={markerCoordinates}></Marker>}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
})

export default MapScreen2;
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import { useApolloClient } from "@apollo/react-hooks";
import i18n from 'i18n-js'

import { Ionicons } from '@expo/vector-icons'

const MapScreen = (props) => {
  const client = useApolloClient();
  const [selectedLocation, setSelectedLocation] = useState()

  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={savePickedLocationHandler}>
        <Ionicons name='ios-save' size={28} color='white' />
      </TouchableOpacity>
    ),

  });


  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        'Doyoyoy!',
        i18n.t('PleaseChooseLocation'),
        [{ text: 'Okay' }]
      );
      return
    }

    client.writeData({
      data: {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      }
    })

    props.navigation.navigate({
      name: 'AddPlace',
      params: { pickedLocation: selectedLocation }
    })
  }, [selectedLocation])

  const selectLocationHandler = event => {
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    })
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
        latitude: 45.523960,
        longitude: -73.582526,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
      onPress={selectLocationHandler}
    // onRegionChangeComplete={handleOnRegionChangeComplete}
    >
      {markerCoordinates && <Marker title="Endroit Choisi" coordinate={markerCoordinates}></Marker>}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
})

export default MapScreen;
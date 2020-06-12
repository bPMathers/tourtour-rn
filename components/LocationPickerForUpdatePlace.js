// this component is a WIP!!

import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import { useApolloClient } from "@apollo/react-hooks";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@apollo/react-hooks';

import { gql } from 'apollo-boost'

import { TourTourColors } from '../constants/Colors';
import MapPreview from './MapPreview';

const LocationPickerForUpdatePlace = (props) => {
  const client = useApolloClient();
  const navigation = useNavigation()
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(props.locationForMapPreview);

  const GET_CACHED_LOCATION = gql`
  {
    lat @client 
    lng @client
  }
  `;

  const { data: cachedLocation } = useQuery(GET_CACHED_LOCATION);

  // useEffect(() => {
  //   props.onTakeMyLocation(pickedLocation)
  // }, [pickedLocation])

  useEffect(() => {
    if (props.locationForMapPreview) {
      setPickedLocation(props.locationForMapPreview)
    }
  }, [props.locationForMapPreview])

  // useEffect(() => {
  //   console.log(`map useEffect called. cached location: ${cachedLocation?.lng}`)
  //   // need to force refetch GET_CACHED_LOCATION after picking of map to trigger this ?
  //   props.onTakeMyLocation(cachedLocation)

  // }, [cachedLocation])

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant location permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000
      });
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });

      props.onTakeNewLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      })
      // client.writeData({
      //   data: {
      //     lat: location.coords.latitude,
      //     lng: location.coords.longitude
      //   }
      // })
    } catch (err) {
      console.log(err)
      Alert.alert(
        'Could not fetch location!',
        'Please try again later or pick a location on the map.',
        [{ text: 'Okay' }]
      );
    }

    setIsFetching(false);
  };


  const pickOnMapHandler = async () => {
    navigation.navigate('MapForPlaceUpdate')
  }



  return (
    <View style={styles.locationPicker}>
      <MapPreview style={styles.mapPreview} location={pickedLocation} onPressMap={pickOnMapHandler}>
        {isFetching ? (
          <ActivityIndicator size="large" color={TourTourColors.primary} />
        ) : (
            <Text>Aucune location choisie.</Text>
          )}
      </MapPreview>
      <View style={styles.actions}>
        <Button
          title="Prendre ma location"
          color={TourTourColors.primary}
          onPress={getLocationHandler}
        />
        <Button
          title="Choisir sur Carte"
          color={TourTourColors.primary}
          onPress={pickOnMapHandler}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15
  },
  mapPreview: {
    marginBottom: 0,
    width: '100%',
    height: 300,
    borderColor: '#ccc',
    borderWidth: 1
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  }
});

export default LocationPickerForUpdatePlace;

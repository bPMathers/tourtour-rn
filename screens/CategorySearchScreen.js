import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, StatusBar, TouchableOpacity, Dimensions, Modal, Alert, ActivityIndicator, Platform } from 'react-native';
import i18n from 'i18n-js';
import { useQuery } from '@apollo/react-hooks';
import { useApolloClient } from "@apollo/react-hooks";

import { FontAwesome5, AntDesign } from '@expo/vector-icons'
import * as Location from 'expo-location';


import { orderByDistance } from '../utils/orderByDistance'
import { TourTourColors } from '../constants/Colors';
import CustomButton from '../components/CustomButton'
import { GET_SEARCH_LOCATION, GET_CAT_PLACES, GET_TOKEN_AND_USER_ID, GET_MY_LOCATION } from '../graphql/queries'

import PlacePreviewListItem from '../components/PlacePreviewListItem';

const CategorySearchScreen = (props) => {
  /**
   * HOOKS
   */

  const { data: tokenAndIdData } = useQuery(GET_TOKEN_AND_USER_ID);
  const loggedInUserId = tokenAndIdData?.userId
  const { loading: searchLocLoading, error: searchLocError, data: searchLocData, refetch } = useQuery(GET_SEARCH_LOCATION)
  // const { loading: myLocLoading, error: myLocError, data: myLocData } = useQuery(GET_MY_LOCATION)
  const { loading, error, data } = useQuery(GET_CAT_PLACES, {
    variables: {
      catId: props.route.params.categoryId,
    },
  });
  const client = useApolloClient();
  const [city, setCity] = useState(searchLocData.searchLocCity);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [placesForDisplay, setPlacesForDisplay] = useState(undefined);
  const [refLocation, setRefLocation] = useState({
    lat: searchLocData.searchLocLat,
    lng: searchLocData.searchLocLng
  });

  // Update city display name when seacrhLocCity is updated in cache
  useEffect(() => {
    setCity(searchLocData.searchLocCity)
  }, [searchLocData.searchLocCity])

  // console.log(`city: ${city}`)
  // console.log(`myLocData: ${JSON.stringify(myLocData, undefined, 2)}`)
  // console.log(`refLocation: ${JSON.stringify(refLocation, undefined, 2)}`)

  /**
   * HELPERS
   */

  // update refLocation when searchLocData is update in cache
  useEffect(() => {
    setRefLocation({
      lat: searchLocData.searchLocLat,
      lng: searchLocData.searchLocLng
    })
    // refetch()
  }, [searchLocData.searchLocLat])

  // update placesForDisplay when refLocation is updated
  useEffect(() => {
    if (data?.places) {
      const distanceOrderedPlaces = orderByDistance(data.places, refLocation)
      setPlacesForDisplay(placeForDisplay => placeForDisplay = distanceOrderedPlaces)
    }
  }, [data?.places, refLocation])

  useEffect(() => {
    refetch()
  }, [props.route?.params?.dummyParam])

  // console.log(city)

  const handleUseMyLocation = async () => {
    try {
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
      setRefLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      })
      refetch()
    } catch {
      console.log('Unable to take location')
    }
  }

  const handleSetLocation = () => {
    props.navigation.navigate('MapForSearchLoc')
  }

  /**
   * NAV
   */

  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity style={{ marginRight: 15 }} onPress={() => {
        props.navigation.navigate('AddPlace', {
          catId: props.route.params.categoryId,
          catTitle: props.route.params.categoryTitle,
        })
      }}>
        <AntDesign name='plus' size={24} color='white' />
      </TouchableOpacity>
    ),
    title: i18n.t(`${props.route.params.categoryTitle}`),
    headerStyle: { backgroundColor: TourTourColors.accent }

  });

  /**
   * RETURN
   */

  const renderGridItem = (itemData) => {
    return (
      <PlacePreviewListItem
        loggedInUserId={loggedInUserId}
        place={itemData.item}
        onSelectUserProfile={() => {
          props.navigation.navigate('UserProfile', {
            userId: itemData.item.addedBy.id,
            userName: itemData.item.addedBy.name
          });
        }}
      />
    );
  };

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
      <View style={styles.modalContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <View style={{ justifyContent: 'space-around', height: 150 }}>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: TourTourColors.primary, marginRight: 4 }}
                  onPress={() => {
                    handleUseMyLocation()
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>{i18n.t('UseMyLocation')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    handleSetLocation()
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>{i18n.t('ChooseOnMap')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: 'red' }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>{i18n.t('Cancel')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={{ marginBottom: 60 }}>
        <StatusBar barStyle="light-content" />
        <View style={{
          backgroundColor: TourTourColors.primary,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 7
        }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>{i18n.t(props.route.params.categoryTitle)} </Text>
              <Text>
                {`${i18n.t('near')} `}
              </Text>
            </View>
            <View>{city === "" ? <View><CustomButton title={i18n.t('ChooseLocation')} onPress={() => { setModalVisible(true) }} /></View> : <Text style={{ fontWeight: 'bold' }}>{city}</Text>}
            </View>
          </View>
          {city ? <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.locationButton} color={TourTourColors.accent} onPress={() => { setModalVisible(true) }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.locationButtonText}>{i18n.t('changeLocation')}</Text>
                <FontAwesome5 name='map-marker-alt' size={18} color='white' />
              </View>
            </TouchableOpacity>
          </View> : null}
        </View>

        <View style={{ marginHorizontal: 10, marginTop: 15, marginBottom: 100 }}>
          <FlatList data={placesForDisplay} renderItem={renderGridItem} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 10,
  },
  metaStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  modalContainer: {

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
    borderRadius: 20,
    width: Dimensions.get("screen").width / 2,
    shadowColor: '#000',
    shadowOffset: { height: 5, width: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  locationButtonText: {
    color: '#fff',
    // textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: 'bold'

  },
  centeredView: {
    // flex: 1,
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default CategorySearchScreen;

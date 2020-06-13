import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, StatusBar, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { useApolloClient } from "@apollo/react-hooks";

import { FontAwesome5, AntDesign } from '@expo/vector-icons'
import * as Location from 'expo-location';




import { TourTourColors } from '../constants/Colors';
import { GET_SEARCH_LOCATION, GET_CAT_PLACES, GET_TOKEN_AND_USER_ID } from '../graphql/queries'

import PlacePreviewListItem from '../components/PlacePreviewListItem';

const CategorySearchScreen = (props) => {
  /**
   * HOOKS
   */

  const { data: tokenAndIdData, client: unusedClient } = useQuery(GET_TOKEN_AND_USER_ID);
  const { loading: loading2, error: error2, data: searchLocData } = useQuery(GET_SEARCH_LOCATION)
  const { loading, error, data } = useQuery(GET_CAT_PLACES, {
    variables: {
      catId: props.route.params.categoryId,
    },
  });
  const client = useApolloClient();
  const [city, setCity] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setCity(searchLocData.searchLocCity)
  }, [searchLocData.searchLocCity])

  /**
   * HELPERS
   */

  const handleTakeLocation = async () => {
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
    } catch {
      console.log('Unable to take location')
    }
  }

  const handleSetLocation = () => {
    props.navigation.navigate('Map2')
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
  });

  /**
   * RETURN
   */

  const renderGridItem = (itemData) => {
    return (
      <PlacePreviewListItem
        loggedInUserId={tokenAndIdData.userId}
        place={itemData.item}
        onSelectUserProfile={() => {
          props.navigation.navigate('UserProfile', {
            userId: itemData.item.addedBy.id,
            userName: itemData.item.addedBy.name
          });
        }}
        onSelectPlace={() => {
          props.navigation.navigate('PlaceDetail', {
            place: itemData.item,
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
      <View style={styles.modalContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <View style={{ justifyContent: 'space-around', height: 100 }}>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: TourTourColors.primary, marginRight: 4 }}
                  onPress={() => {
                    handleTakeLocation()
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Prendre ma location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    handleSetLocation()
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Choisir sur la carte</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={{ marginBottom: 100 }}>
        <StatusBar barStyle="light-content" />
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>{props.route.params.categoryTitle} </Text>
            <Text>
              près de{' '}
            </Text>
          </View>
          <View>{city === "" ? <View><Button title="Choisir Location" onPress={() => { setModalVisible(true) }} /></View> : <Text style={{ fontWeight: 'bold' }}>{city}</Text>}
          </View>
        </View>
        {city ? <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.locationButton} color={TourTourColors.accent} onPress={() => { setModalVisible(true) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.locationButtonText}>Changer de Location</Text>
              <FontAwesome5 name='map-marker-alt' size={18} color='white' />
            </View>
          </TouchableOpacity>
        </View> : null}
        <FlatList data={data.places} renderItem={renderGridItem} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
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
    borderRadius: 10,
    width: Dimensions.get("screen").width / 2
  },
  locationButtonText: {
    color: '#fff',
    // textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,

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

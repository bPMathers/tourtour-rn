import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Modal, Dimensions, TouchableOpacity, TouchableNativeFeedback, ImageBackground, Image } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { onGestureEvent } from 'react-native-redash'

import { Ionicons, AntDesign } from '@expo/vector-icons'

import { TourTourColors } from '../constants/Colors'
import FeaturedPhoto from './FeaturedPhoto';

const FeaturedPhotosGroup = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedImgUrl, setSelectedImgUrl] = useState(null)

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
    let TouchableComponent = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableComponent = TouchableNativeFeedback;
    }
    return (
      <View style={styles.gridItem}>
        <TouchableComponent style={{ flex: 1 }} onPress={() => {
          setSelectedImgUrl(itemData.item.url)
          setModalVisible(true)

        }}>
          <ImageBackground source={{ uri: itemData.item.url }} style={styles.image}>

          </ImageBackground>
        </TouchableComponent>
      </View>
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
    <View>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>

              <View style={{ height: 400, width: Dimensions.get('screen').width - 30 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <AntDesign name="close" size={40} color="red" />
                  </TouchableOpacity>
                </View>
                <Image source={{ uri: selectedImgUrl }} style={styles.modalImage} />
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.container}>
        <FlatList data={data.photos.reverse()} renderItem={renderGridItem} horizontal={true} ItemSeparatorComponent={() => <View style={{ margin: 1 }} />} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  gridItem: {
    // flex: 1,
    // // borderWidth: 1,
    // // borderColor: 'white',
    // height: 120,
    // margin: 2,
    // borderRadius: 5,
    // // elevation: 5,
    // overflow: Platform.OS === "android" ? "hidden" : "hidden",

    backgroundColor: 'white',
    height: 150,
    width: Dimensions.get('screen').width / 2 - 15
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  modalImage: {
    flex: 1
  },
  modalContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center'
  },
  modalCloseButton: {
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
    // flex: 1,
    margin: 20,
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
})

export default FeaturedPhotosGroup;
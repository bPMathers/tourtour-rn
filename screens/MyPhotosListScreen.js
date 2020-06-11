import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, TouchableNativeFeedback, ImageBackground, Dimensions, Modal, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { FontAwesome, FontAwesome5, AntDesign, Ionicons } from '@expo/vector-icons'
import TimeAgo from 'react-native-timeago';

import { GET_MY_PHOTOS, GET_TOKEN, GET_TOKEN_AND_USER_ID, GET_USER } from '../graphql/queries'
import { TourTourColors } from '../constants/Colors'
import { useNavigation } from '@react-navigation/native';

const MyPhotoCard = ({ itemData }) => {
  const navigation = useNavigation()

  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
    <View style={styles.gridItem}>
      <ImageBackground source={{ uri: itemData.item.url }} style={styles.image}>

      </ImageBackground>
    </View>
  )
}



const MyPhotosListScreen = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState({ addedBy: '' })
  const { data: tokenAndIdData, client: unusedClient } = useQuery(GET_TOKEN_AND_USER_ID);
  const jwtBearer = "".concat("Bearer ", tokenAndIdData?.token).replace(/\"/g, "")
  const { loading: photosLoading, error: photosError, data: photosData } = useQuery(GET_MY_PHOTOS, {
    context: {
      headers: {
        // Set the token dynamically from cache. 
        Authorization: props.route.params.userToken
      }
    },
  });

  /**
   * GRAPHQL
   */

  const DELETE_PHOTO = gql`
    mutation($id: ID!) {
      deletePhoto(id: $id){
        id 
      }
    }
  `;
  const [deletePhoto, { data }] = useMutation(DELETE_PHOTO)

  const renderGridItem = (itemData) => {

    let TouchableComponent = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableComponent = TouchableNativeFeedback;
    }
    return (
      <TouchableComponent onPress={() => {
        setSelectedPhoto(itemData.item)
        setModalVisible(true)

      }}>
        <MyPhotoCard itemData={itemData} />
      </TouchableComponent>
    );
  }

  const handleOnDelete = () => {
    Alert.alert(
      'Attention!',
      "Êtes-vous certain(e) de vouloir supprimer cette photo ?",
      [
        { text: 'Annuler', style: 'destructive' },
        { text: 'Confirmer', onPress: () => { confirmDeletePhoto() } },
      ]
    )
  }

  const confirmDeletePhoto = () => {
    deletePhoto({
      variables: { id: selectedPhoto.id },
      context: {
        headers: {
          Authorization: jwtBearer
        }
      },
      refetchQueries: [
        {
          query: GET_MY_PHOTOS,
          context: {
            headers: {
              Authorization: jwtBearer
            }
          },
        },
        {
          query: GET_USER,
          variables: {
            userId: tokenAndIdData.userId
          },
          context: {
            headers: {
              Authorization: jwtBearer
            }
          },
        },

      ]
    })
    setModalVisible(false)
  }

  if (photosLoading)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  if (photosError)
    return (
      <View style={styles.container}>
        <Text>Error...</Text>
      </View>
    );

  return (
    <React.Fragment>
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
              <ImageBackground source={{ uri: selectedPhoto.url }} style={styles.modalImage}>

                <View style={styles.photoModalOverlay}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ color: 'white' }}>Endroit: {selectedPhoto?.place?.name}</Text>
                    </View>
                    <TouchableOpacity onPress={handleOnDelete}>
                      <Ionicons name='ios-trash' size={24} color='white' />
                    </TouchableOpacity>
                  </View>

                </View>
              </ImageBackground>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ padding: 10 }}>
        <FlatList numColumns={2} data={photosData.myPhotos} renderItem={renderGridItem} />
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  gridItem: {
    margin: 2,
    backgroundColor: 'white',
    height: Dimensions.get("screen").width * 0.375,
    width: Dimensions.get("screen").width / 2
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },

  // timeAgoText: {
  //   color: 'white',
  //   fontSize: 12
  // }
  modalContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center'
  },
  modalCloseButton: {
  },
  modalImage: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  centeredView: {
    // flex: 1,
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.7)'
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
  photoModalOverlay: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  addedByModalText: {
    color: 'white',
    fontSize: 18

  }
})

export default MyPhotosListScreen
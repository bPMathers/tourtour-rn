import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Modal, Dimensions, TouchableOpacity, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import i18n from 'i18n-js'

import { Ionicons, AntDesign } from '@expo/vector-icons'

import { TourTourColors } from '../constants/Colors'
import { GET_TOKEN_AND_USER_ID } from '../graphql/queries'


const FeaturedPhotosGroup = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState({ addedBy: '' })
  const { data: tokenAndIdData } = useQuery(GET_TOKEN_AND_USER_ID);
  const jwtBearer = "".concat("Bearer ", tokenAndIdData?.token).replace(/\"/g, "")

  // const GET_PHOTOS = gql`
  //   query($placeId: String, $orderBy: PhotoOrderByInput) {
  //     photos(query: $placeId, orderBy: $orderBy) {
  //       id
  //       url
  //       addedBy {
  //         id
  //         name
  //       }
  //     }
  //   }
  // `;

  // const { loading, error, data, refetch } = useQuery(GET_PHOTOS, {
  //   variables: {
  //     placeId: props.place.id,
  //     orderBy: "createdAt_DESC"
  //   },
  // });

  // const DELETE_PHOTO = gql`
  //   mutation($id: ID!) {
  //     deletePhoto(id: $id){
  //       id 
  //     }
  //   }
  // `;
  // const [deletePhoto] = useMutation(DELETE_PHOTO, {
  //   onCompleted: () => refetch()
  // })

  /**
   * HELPERS
   */

  const handleOnUserProfileSelect = () => {
    setModalVisible(false)
    props.navigation.navigate('UserProfile', {
      userId: selectedPhoto.addedBy.id,
      userName: selectedPhoto.addedBy.name
    })
  }
  const handleOnDelete = () => {
    Alert.alert(
      `${i18n.t('Warning')}!`,
      i18n.t('PhotoDeleteConfirmAlert'),
      [
        { text: i18n.t('Cancel'), style: 'destructive' },
        { text: i18n.t('Confirm'), onPress: () => { confirmDeletePhoto() } },
      ]
    )
  }

  const confirmDeletePhoto = () => {
    props.onConfirmDeletePhoto(selectedPhoto.id)
    setModalVisible(false)
  }

  const renderGridItem = (itemData) => {

    return (
      <View style={styles.gridItem}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => {
          setSelectedPhoto(itemData.item)
          setModalVisible(true)

        }}>
          <ImageBackground source={{ uri: itemData.item.url }} style={styles.image}>

          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * RETURN
   */

  return (
    <View>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
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
                </ImageBackground>
                <View style={styles.photoInfoAndActions}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.addedByModalText}>{i18n.t('addedBy')}: </Text>
                    <TouchableOpacity onPress={handleOnUserProfileSelect}>
                      <Text style={{ fontWeight: 'bold', color: 'white' }}>
                        {selectedPhoto.addedBy.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {props.loggedInUserId === selectedPhoto.addedBy.id &&
                    <TouchableOpacity onPress={handleOnDelete}>
                      <Ionicons name='ios-trash' size={20} color='white' />
                    </TouchableOpacity>
                  }
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.container}>
        <FlatList data={props.photos} renderItem={renderGridItem} horizontal={true} ItemSeparatorComponent={() => <View style={{ margin: 1 }} />} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  metaStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridItem: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.90)',
    justifyContent: 'center'
  },
  modalCloseButton: {
  },

  centeredView: {
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    marginHorizontal: 10,
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
  photoInfoAndActions: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  addedByModalText: {
    color: 'white',
    fontSize: 14

  },

})

export default FeaturedPhotosGroup;
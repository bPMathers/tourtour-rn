import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableNativeFeedback, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks';

import { GET_TOKEN_AND_USER_ID, GET_USER } from '../graphql/queries'

import { TourTourColors } from '../constants/Colors'
import { takeExistingImage, takeNewImage } from '../utils/chooseImage'
import { getCloudinaryUrl } from '../utils/getCloudinaryUrl'

const UserEditScreen = (props) => {

  const { data: tokenAndIdData } = useQuery(GET_TOKEN_AND_USER_ID);
  const jwtBearer = "".concat("Bearer ", tokenAndIdData?.token).replace(/\"/g, "")
  const loggedInUserId = tokenAndIdData?.userId
  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userId: loggedInUserId,
    },
  });
  const [userName, setUserName] = useState(data?.user?.name)
  // const [userCity, setUserCity] = useState(data?.user?.location)
  const [userStatus, setUserStatus] = useState(data?.user?.status)
  const [photoModalVisible, setPhotoModalVisible] = useState(false);


  useEffect(() => {
    if (data?.user) {
      setUserName(data.user.name)
      setUserStatus(data.user.status)
    }
  }, [data?.user])

  /**
   * GRAPHQL
   */

  const UPDATE_PICTURE = gql`
    mutation($imageUrl: String!) {
      updateUser(
        data: {
          imageUrl: $imageUrl
        }) {
        id
        imageUrl
        }
      }
  `;

  const [updatePicture] = useMutation(UPDATE_PICTURE)

  /**
   * HELPERS 
   */

  const handleChangeForExistingPicture = async () => {
    // const desiredRatio = [4,4] --> eventually pass in as an option
    const newImage = await takeExistingImage()
    const cloudinaryUrl = await getCloudinaryUrl(newImage.base64)
    updatePicture({
      variables: {
        imageUrl: cloudinaryUrl
      },
      context: {
        headers: {
          Authorization: jwtBearer
        }
      },
    })
    setPhotoModalVisible(false)
  }

  const handleChangeForNewPicture = async () => {
    // const desiredRatio = [4,4] --> eventually pass in as an option
    const newImage = await takeNewImage()
    const cloudinaryUrl = await getCloudinaryUrl(newImage.base64)
    updatePicture({
      variables: {
        imageUrl: cloudinaryUrl
      },
      context: {
        headers: {
          Authorization: jwtBearer
        }
      },
    })
    setPhotoModalVisible(false)
  }

  /**
   * RETURN 
   */

  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
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
    <React.Fragment>
      <View style={styles.modalContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={photoModalVisible}
          onBackdropPress={() => setPhotoModalVisible(false)}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}></Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "red", marginRight: 4 }}
                  onPress={() => setPhotoModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Annuler</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3", marginRight: 4 }}
                  onPress={handleChangeForNewPicture}
                >
                  <Text style={styles.textStyle}>Nouvelle Photo</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={handleChangeForExistingPicture}
                >
                  <Text style={styles.textStyle}>Photo déjà existante</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.container}>
        <View style={styles.userProfileHeader}>
          <Image style={styles.userImg} source={{ uri: data.user.imageUrl }} />
          <TouchableOpacity onPress={() => { setPhotoModalVisible(true) }} style={{
            position: 'absolute',
            width: 30,
            height: 30,
            top: 33,
            left: 105,
            borderRadius: 20,
            backgroundColor: TourTourColors.primary,
            borderColor: TourTourColors.accent,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <FontAwesome5 name='pencil-alt' size={15} color={TourTourColors.accent} />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfoContainer}>
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>
              {userName}
            </Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.userCity}>Montréal, QC</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.userStatus}>{userStatus}</Text>
          </View>
          <TouchableOpacity onPress={() => { }} style={{
            position: 'absolute',
            width: 30,
            height: 30,
            top: -13,
            right: -13,
            borderRadius: 20,
            backgroundColor: TourTourColors.primary,
            borderColor: TourTourColors.accent,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <FontAwesome5 name='pencil-alt' size={15} color={TourTourColors.accent} />
          </TouchableOpacity>
        </View>
        {/*<View style={styles.actionsRow}>

        <TouchableComponent>
          <View style={styles.actionGroup}>
            <View style={styles.actionButton}>
              <FontAwesome5 name='pencil-alt' size={20} color={TourTourColors.accent} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Modifier</Text>
            </View>
          </View>
        </TouchableComponent>
      </View>*/}
        <View style={styles.rowsContainer}>
          <TouchableComponent onPress={() => { props.navigation.navigate('MyPlaces', { userToken: jwtBearer }) }}>
            <View style={styles.row}>
              <View style={styles.rowLeftGroup}>
                <View style={styles.rowIconBox}>
                  <Ionicons name='ios-images' size={26} color='#333' />
                </View>
                <View>
                  <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Mes places</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 12, color: '#333', fontWeight: 'bold' }}> ({data.user.places.length})</Text>
                </View>
              </View>
              <View style={styles.forwardArrow}>
                <Ionicons name='ios-arrow-forward' size={20} color='#333' />
              </View>
            </View>
          </TouchableComponent>
          <TouchableComponent onPress={() => { props.navigation.navigate('MyReviews', { userToken: jwtBearer }) }}>
            <View style={styles.row}>
              <View style={styles.rowLeftGroup}>
                <View style={styles.rowIconBox}>
                  <MaterialCommunityIcons name='star-box' size={28} color='#333' />
                </View>
                <View>
                  <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Mes reviews</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 12, color: '#333', fontWeight: 'bold' }}> ({data.user.reviews.length})</Text>
                </View>
              </View>
              <View style={styles.forwardArrow}>
                <Ionicons name='ios-arrow-forward' size={20} color='#333' />
              </View>
            </View>
          </TouchableComponent>
          <TouchableComponent onPress={() => { props.navigation.navigate('MyPhotos', { userToken: jwtBearer }) }}>
            <View style={{ ...styles.row, ...styles.lastRow }}>
              <View style={styles.rowLeftGroup}>
                <View style={styles.rowIconBox}>
                  <Ionicons name='ios-camera' size={28} color='#333' />
                </View>
                <View>
                  <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Mes photos</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 12, color: '#333', fontWeight: 'bold' }}> ({data.user.photos.length})</Text>
                </View>
              </View>
              <View style={styles.forwardArrow}>
                <Ionicons name='ios-arrow-forward' size={20} color='#333' />
              </View>
            </View>
          </TouchableComponent>
        </View>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  userImg: {
    height: 144,
    width: 144,
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 72,
    borderColor: TourTourColors.accent,
    borderWidth: 2,
    backgroundColor: TourTourColors.primary
  },
  userInfoContainer: {
    marginBottom: 30,
    padding: 10,
    width: '90%',
    backgroundColor: 'pink',
    borderWidth: 1,
    borderColor: TourTourColors.accent,
    borderRadius: 10
  },
  userNameContainer: {
    marginBottom: 3
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  userCity: {
    textAlign: 'center'
  },
  userStatus: {
    textAlign: 'center'
  },
  // actionsRow: {
  //   width: '70%',
  //   marginVertical: 15,
  //   flexDirection: 'row',
  //   justifyContent: 'space-around'
  // },
  // actionGroup: {
  //   alignItems: 'center',
  // },
  // actionButton: {
  //   width: 40,
  //   height: 40,
  //   backgroundColor: TourTourColors.primary,
  //   borderRadius: 25,
  //   marginBottom: 5,
  //   justifyContent: 'center',
  //   alignItems: "center"
  // },
  // actionTitle: {
  //   color: TourTourColors.accent,
  //   fontWeight: 'bold',
  //   fontSize: 12
  // },
  rowsContainer: {
    width: '100%'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#999',
    maxHeight: 50,
    minHeight: 50
  },
  lastRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#999',
  },
  rowLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowIconBox: {
    alignItems: 'center',
    width: 30,
    marginRight: 10
  },
  forwardArrow: {
    marginRight: 5
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
    width: '95%',
    // marginHorizontal: 10,
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
})

export default UserEditScreen;
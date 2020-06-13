import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { useApolloClient } from "@apollo/react-hooks";
import { useQuery } from '@apollo/react-hooks';

import { GET_CACHED_IMG_URI } from '../graphql/queries'
import { TourTourColors } from '../constants/Colors';

const ImgPickerForUpdatePlace = props => {
  /**
   * HOOKS
   */
  const [modalVisible, setModalVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState(props.initialImgUrl)

  const { data: cachedImageUri } = useQuery(GET_CACHED_IMG_URI);
  const client = useApolloClient();

  /**
   * FUNCTIONS
   */

  const verifyCameraRollPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant camera permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const verifyCameraPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA);
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant camera permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  /**
   * HANDLERS
   */
  const handleUploadExistingPicture = async () => {
    const hasPermission = await verifyCameraRollPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });

    // const base64Img = `data:image/jpg;base64,${image.base64}`

    if (image.cancelled) {
      return
    }
    setImgUrl(image.uri)
    props.onImageTaken(image);
    setModalVisible(false)
  };
  const handleTakeNewPictureForUpload = async () => {
    const hasPermission = await verifyCameraPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });

    // const base64Img = `data:image/jpg;base64,${image.base64}`

    if (image.cancelled) {
      return
    }

    props.onImageTaken(image);
    setModalVisible(false)

  };

  return (
    <React.Fragment>
      <View style={styles.modalContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
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
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Annuler</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3", marginRight: 4 }}
                  onPress={handleTakeNewPictureForUpload}
                >
                  <Text style={styles.textStyle}>Nouvelle Photo</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={handleUploadExistingPicture}
                >
                  <Text style={styles.textStyle}>Photo déjà existante</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.imagePicker}>
        <TouchableOpacity style={styles.imagePreview} onPress={() => { setModalVisible(true) }}>
          <Image style={styles.image} source={{ uri: imgUrl }} />
        </TouchableOpacity>
        <View style={{ marginBottom: 15 }}>
          <Button
            title="Prendre Photo"
            color={TourTourColors.primary}
            onPress={() => { setModalVisible(true) }}
          />
        </View>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1
  },
  image: {
    width: '100%',
    height: '100%'
  },
  modalContainer: {
    // margin:
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
});

export default ImgPickerForUpdatePlace;
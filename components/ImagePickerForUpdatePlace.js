import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { useApolloClient } from "@apollo/react-hooks";
import { useQuery } from '@apollo/react-hooks';
import i18n from 'i18n-js'

import { GET_CACHED_IMG_URI } from '../graphql/queries'
import { TourTourColors } from '../constants/Colors';
import CustomButton from './CustomButton'

const ImgPickerForUpdatePlace = props => {

  const [modalVisible, setModalVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState(props.initialImgUrl)

  const { data: cachedImageUri } = useQuery(GET_CACHED_IMG_URI);
  const client = useApolloClient();

  /**
   * HELPERS
   */

  const verifyCameraRollPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (result.status !== 'granted') {
      Alert.alert(
        `${i18n.t('InsufficientPermissions')}!`,
        i18n.t('CameraPermissionsAlert'),
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
        `${i18n.t('InsufficientPermissions')}!`,
        i18n.t('CameraPermissionsAlert'),
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const handleUploadExistingPicture = async () => {
    const hasPermission = await verifyCameraRollPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
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
      aspect: [4, 4],
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
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flexDirection: 'column' }}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3", marginBottom: 15 }}
                  onPress={handleTakeNewPictureForUpload}
                >
                  <Text style={styles.textStyle}>{i18n.t('NewPhoto')}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3", marginBottom: 15 }}
                  onPress={handleUploadExistingPicture}
                >
                  <Text style={styles.textStyle}>{i18n.t('ExistingPhoto')}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "red" }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>{i18n.t('Cancel')}</Text>
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
          <CustomButton
            title={i18n.t('TakePicture')}
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
    borderColor: TourTourColors.accent,
    borderWidth: 3
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
    width: '75%',
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

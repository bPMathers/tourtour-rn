import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { useApolloClient } from "@apollo/react-hooks";
import { gql } from 'apollo-boost'

import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@apollo/react-hooks';



import { TourTourColors } from '../constants/Colors';

const ImgPicker = props => {
  const client = useApolloClient();

  const verifyPermissions = async () => {
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

  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5
    });

    client.writeData({
      data: {
        imageUrl: image.uri
      }
    })
    console.log("write data accessed")
    props.onImageTaken(image.uri);
  };

  const GET_CACHED_IMG_URI = gql`
  {
    imageUrl @client
  }
  `;

  const { data: cachedImageUri } = useQuery(GET_CACHED_IMG_URI);

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        <Image style={styles.image} source={{ uri: cachedImageUri.imageUrl }} />
      </View>
      <Button
        title="Prendre Photo"
        color={TourTourColors.primary}
        onPress={takeImageHandler}
      />
    </View>
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
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1
  },
  image: {
    width: '100%',
    height: '100%'
  }
});

export default ImgPicker;

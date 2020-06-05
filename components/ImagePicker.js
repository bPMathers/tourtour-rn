import React from 'react';
import { View, Button, Image, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { useApolloClient } from "@apollo/react-hooks";
import { useQuery } from '@apollo/react-hooks';

import { GET_CACHED_IMG_URI } from '../graphql/queries'
import { TourTourColors } from '../constants/Colors';

const ImgPicker = props => {
  /**
   * HOOKS
   */
  const { data: cachedImageUri } = useQuery(GET_CACHED_IMG_URI);
  const client = useApolloClient();

  /**
   * FUNCTIONS
   */

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

  /**
   * HANDLERS
   */
  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions();
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

    props.onImageTaken(image);
  };

  return (
    <View style={styles.imagePicker}>
      <TouchableOpacity style={styles.imagePreview} onPress={takeImageHandler}>
        <Image style={styles.image} source={{ uri: cachedImageUri.imageUrl }} />
      </TouchableOpacity>
      <View style={{ marginBottom: 15 }}>
        <Button
          title="Prendre Photo"
          color={TourTourColors.primary}
          onPress={takeImageHandler}
        />
      </View>
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
    marginBottom: 0,
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

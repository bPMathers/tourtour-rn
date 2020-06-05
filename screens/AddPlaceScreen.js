import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { googleApiKey } from '../env'
import LocationPicker from '../components/LocationPicker'
import { TourTourColors } from '../constants/Colors';
import ImagePicker from '../components/ImagePicker';
import { GET_CAT_PLACES, GET_ADD_PLACE_DATA } from '../graphql/queries'

const NewPlaceScreen = props => {
  /**
   * HOOKS
   */
  const [name, setName] = useState('');
  const { data: coords, client } = useQuery(GET_ADD_PLACE_DATA);

  /**
   * GRAPHQL - MOVE TO EXTERNAL FILE WHEN DONE
   */

  const ADD_PLACE = gql`
    mutation($name: String!, $categoryId: String!, $imageUrl: String, $lat: Float, $lng: Float, $phone: String, $url: String ) {
      createPlace(
        data: {
          name: $name
          categoryId: $categoryId
          imageUrl: $imageUrl
          lat: $lat
          lng: $lng
          phone: $phone
          url: $url
      }){
        id 
      }
    }
  `;

  const [addPlace, { data }] = useMutation(ADD_PLACE)


  /**
   * HANDLERS
   */

  // Image : 1) use modal to select photo library or camera like in add photo
  //         2) upload to cloudinary and then send return url with mutation

  // const cloudinarySecureUrl = async (localImgUri) => {
  //   const base64Img = `data:image/jpg;base64,${localImgUri.base64}`

  //   const apiUrl = 'https://api.cloudinary.com/v1_1/db4mzdmnm/image/upload';
  //   const data = {
  //     "file": base64Img,
  //     "upload_preset": "TourTour1",
  //   }
  //   fetch(apiUrl, {
  //     body: JSON.stringify(data),
  //     headers: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'POST',
  //   }).then(async result => {
  //     const data = await result.json()

  //     return data.secure_url
  //   }).catch(err => console.log(err))
  // }


  // const openCameraAsync = async () => {
  //   const permissionResult2 = await ImagePicker.requestCameraPermissionsAsync();

  //   if (permissionResult2.granted === false) {
  //     alert("Permission to access camera roll is required!");
  //     return;
  //   }

  //   const result = await ImagePicker.launchCameraAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 0.5,
  //     base64: true
  //   });
  //   if (!result.cancelled) {
  //     // setPhotoUrl(result.uri)

  //     const base64Img = `data:image/jpg;base64,${result.base64}`

  //     //Add your cloud name
  //     const apiUrl = 'https://api.cloudinary.com/v1_1/db4mzdmnm/image/upload';
  //     const data = {
  //       "file": base64Img,
  //       "upload_preset": "TourTour1",
  //     }
  //     fetch(apiUrl, {
  //       body: JSON.stringify(data),
  //       headers: {
  //         'content-type': 'application/json'
  //       },
  //       method: 'POST',
  //     }).then(async r => {
  //       const data = await r.json()
  //       addPhoto({
  //         variables: { url: data.secure_url, placeId: place.id },
  //         refetchQueries: [{ query: GET_PHOTOS, variables: { url: data.secure_url, placeId: place.id } }]
  //       })

  //       return data.secure_url
  //     }).catch(err => console.log(err))
  //   }
  // }

  // const handleUploadExistingPicture = async () => {
  //   await openImagePickerAsync();
  //   setModalVisible(false);
  // }

  // const handleTakeNewPictureForUpload = async () => {
  //   await openCameraAsync();
  //   setModalVisible(false);
  // }
  const imageTakenHandler = (imagePath) => {
    // const cloudinaryResponse = await cloudinarySecureUrl(imagePath)
    client.writeData({
      data: {
        imageUrl: imagePath
      }
    })
  };

  const nameChangeHandler = text => {
    // should sanitize input ?
    setName(text);
  };

  const savePlaceHandler = async () => {
    // imagePath will be coming back from cloudinary eventually
    // Initiate GraphQL Mutation & refetch
    // Location : convert to human readable first and then store somewhere on state
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${googleApiKey}`)

    if (!response.ok) {
      throw new Error("error while fetching reverse geocoding")
    }

    const resData = await response.json()
    const formattedAddress = resData.results[0].formatted_address
    const googlePlaceId = resData.results[0].place_id

    // Initiate GraphQL Mutation & refetch
    addPlace({
      variables: {
        name: titleValue,
        categoryId: "ckb13k2qw00a8077858tzciik",
        imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/07/a1/a8/85/jakes-dive-bar.jpg",
        lat: 45.517382,
        lng: -73.559500,
        phone: "1-514-522-9392",
      },
      refetchQueries: [{ query: GET_CAT_PLACES, variables: { catId: "ckb13k2qw00a8077858tzciik" } }]
    })

    props.navigation.goBack();
  };

  /**
   * COMPONENTS
   */

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Nom de la place</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={nameChangeHandler}
          value={name}
        />
        <ImagePicker onImageTaken={imageTakenHandler} />
        <LocationPicker
          navigation={props.navigation}
          route={props.route}

        />
        <Button
          title="Sauvegarder"
          color={TourTourColors.accent}
          onPress={savePlaceHandler}
        />
      </View>
    </ScrollView>
  );
}


NewPlaceScreen.navigationOptions = {
  headerTitle: 'Add Place'
};

/**
 * STYLES
 */

const styles = StyleSheet.create({
  form: {
    margin: 30
  },
  label: {
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2
  }
});

export default NewPlaceScreen;

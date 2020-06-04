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
import { GET_CAT_PLACES } from '../graphql/queries'

const NewPlaceScreen = props => {


  /**
   * HOOKS
   */

  const [titleValue, setTitleValue] = useState('');
  // const [selectedImage, setSelectedImage] = useState(coords);
  // const [selectedLocation, setSelectedLocation] = useState();

  /**
   * VARIABLES
   */
  // const passedLocation = props.route.params?.pickedLocation
  // console.log(passedLocation)

  /**
   * GRAPHQL
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

  const ADD_PLACE_DATA = gql`
{
  lat @client 
  lng @client
  imageUrl @client
}
`;

  const { data: coords, client } = useQuery(ADD_PLACE_DATA);
  // setSelectedLocation(coords)
  console.log(coords)

  /**
   * HANDLERS
   */

  // 

  // const openImagePickerAsync = async () => {
  //   const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

  //   if (permissionResult.granted === false) {
  //     alert("Permission to access camera roll is required!");
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
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
  //       // Send mutation to graphQL API & refetch
  //       addPhoto({
  //         variables: { url: data.secure_url, placeId: place.id },
  //         refetchQueries: [{ query: GET_PHOTOS, variables: { url: data.secure_url, placeId: place.id } }]
  //       })

  //       return data.secure_url
  //     }).catch(err => console.log(err))
  //   }
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

  const titleChangeHandler = text => {
    // should sanitize input ?
    setTitleValue(text);
  };

  const imageTakenHandler = imagePath => {
    // setSelectedImage(imagePath);
    // console.log(imagePath)
  };

  // const actualLocationPickedHandler = (pickedLocation) => {
  //   // setSelectedLocation(pickedLocation)
  // }

  const savePlaceHandler = async () => {
    // console.log(coords)
    // Initiate GraphQL Mutation & refetch
    // name is in titleValue (change to "nameValue" eventually -for better naming)
    // imagePath will be coming back from cloudinary eventually
    // Location : convert to human readable first and then store somewhere on state
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${googleApiKey}`)

    if (!response.ok) {
      throw new Error("error while fetching reverse geocoding")
    }

    const resData = await response.json()
    const formattedAddress = resData.results[0].formatted_address
    const googlePlaceId = resData.results[0].place_id
    // console.log(formattedAddress)
    // console.log(googlePlaceId)

    // call mutation
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
          onChangeText={titleChangeHandler}
          value={titleValue}
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
};

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

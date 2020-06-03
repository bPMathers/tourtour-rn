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

const NewPlaceScreen = props => {


  /**
   * HOOKS
   */

  const [titleValue, setTitleValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(latData);
  const [selectedLocation, setSelectedLocation] = useState();

  /**
   * VARIABLES
   */

  const passedLocation = props.route.params?.pickedLocation
  // console.log(passedLocation)

  /**
   * GRAPHQL
   */

  const ADD_PHOTO = gql`
    mutation($url: String!, $placeId: String!) {
      createPhoto(data:{
        url: $url,
        placeId:  $placeId
      }){
        id 
        url
        place {
          id
        }
      }
    }
  `;

  const GET_LAT = gql`
{
  pickedLat @client 
  pickedLng @client
}
`;

  const [addPhoto, { data }] = useMutation(ADD_PHOTO)
  const { data: latData, client } = useQuery(GET_LAT);
  // setSelectedLocation(latData)
  console.log(latData)

  /**
   * HANDLERS
   */

  // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY

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
  //   console.log(console.log(`pickedLocation: ${pickedLocation}`))
  // }

  const savePlaceHandler = () => {
    // Initiate GraphQL Mutation & refetch
    // name is in titleValue (change to "nameValue" eventually -for better naming)
    // imagePath is coming back from cloudinary
    // Location : convert to human readable first and then store somewhere on state
    // Location : client.readData for lat & lng?

    //
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

import React, { useState, useCallback, useEffect } from 'react';
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
  const [base64Image, setBase64Image] = useState();
  const { data: addPlaceData, client } = useQuery(GET_ADD_PLACE_DATA);
  // console.log(props.route.params?.autoCompletePickedPlace?.geometry.location.lng)

  useEffect(() => {
    setName(props.route.params?.autoCompletePickedPlace?.name)
    if (props.route.params?.autoCompletePickedPlace?.geometry) {

      client.writeData({
        data: {
          lat: props.route.params?.autoCompletePickedPlace?.geometry.location.lat,
          lng: props.route.params?.autoCompletePickedPlace?.geometry.location.lng,
        }
      })
    }

  }, [props.route.params?.autoCompletePickedPlace])


  /**
   * GRAPHQL - MOVE TO EXTERNAL FILE WHEN DONE
   */

  const ADD_PLACE = gql`
    mutation($name: String!, $categoryId: String!, $imageUrl: String, $lat: Float, $lng: Float, $placeId: String, $formatted_address: String, $phone: String, $url: String) {
    createPlace(
      data: {
        name: $name
        categoryId: $categoryId
        imageUrl: $imageUrl
        lat: $lat
        lng: $lng
        google_place_id: $placeId
        formatted_address: $formatted_address
        phone: $phone
        url: $url
      }) {
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
  //   const base64Img = `data: image / jpg; base64, ${ localImgUri.base64 } `

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

  //     const base64Img = `data: image / jpg; base64, ${ result.base64 } `

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
  const imageTakenHandler = (image) => {
    // console.log(`allo: ${ image.base64 } `)
    // setBase64Image(base64Img)
    // const cloudinaryResponse = await cloudinarySecureUrl(imagePath)
    client.writeData({
      data: {
        imageUrl: image.uri,
        imageBase64: image.base64
      }
    })
  };

  const nameChangeHandler = text => {
    // should sanitize input ?
    setName(text);
  };

  const savePlaceHandler = async () => {
    // send img to cloudinary and get url back
    const base64ImgToUpload = `data:image/jpg;base64,${addPlaceData.imageBase64}`

    const apiUrl = 'https://api.cloudinary.com/v1_1/db4mzdmnm/image/upload';
    const data = {
      "file": base64ImgToUpload,
      "upload_preset": "TourTour1",
    }
    const cloudinaryUrl = await fetch(apiUrl, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then(async r => {
      const data = await r.json()
      return data.secure_url
    }).catch(err => console.log(err))

    // Get location data
    const revGeoCodingResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${addPlaceData.lat},${addPlaceData.lng}&key=${googleApiKey}`)

    if (!revGeoCodingResponse.ok) {
      throw new Error("error while fetching reverse geocoding")
    }

    const resData = await revGeoCodingResponse.json()
    // console.log(`resData: ${resData}`)
    const formattedAddress = resData.results[0].formatted_address
    // console.log(`formattedAddress: ${formattedAddress}`)
    const googlePlaceId = resData.results[0].place_id
    // console.log(`googlePlaceId: ${googlePlaceId}`)
    // Initiate GraphQL Mutation & refetch
    addPlace({
      variables: {
        name: name,
        categoryId: props.route.params.catId,
        imageUrl: cloudinaryUrl ?? "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg",
        lat: addPlaceData.lat,
        lng: addPlaceData.lng,
        placeId: props.route.params?.autoCompletePickedPlace?.place_id ?? googlePlaceId,
        formatted_address: props.route.params?.autoCompletePickedPlace?.formatted_address ?? formattedAddress,
        phone: "1-514-522-9392",
      },
      refetchQueries: [{ query: GET_CAT_PLACES, variables: { catId: props.route.params.catId } }]
    })

    props.navigation.goBack();
  };

  /**
   * COMPONENTS
   */

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={nameChangeHandler}
          value={name}
          placeholder={`Nom du ou de la "${props.route.params.catTitle}" à ajouter`}
        />
        <View style={{ marginBottom: 20 }}>
          <Button color={TourTourColors.primary} title="utiliser Google AutoComplete" onPress={() => {
            props.navigation.navigate('GoogleAC')
          }}></Button>
        </View>
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
    color: TourTourColors.accent,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15
  },
  textInput: {

    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    marginBottom: 0,
    paddingVertical: 4,
    paddingHorizontal: 2
  }
});

export default NewPlaceScreen;

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
import { GET_CAT_PLACES, GET_ADD_PLACE_DATA, GET_TOKEN } from '../graphql/queries'

const NewPlaceScreen = props => {
  /**
   * HOOKS
   */
  const [name, setName] = useState('');
  const [base64Image, setBase64Image] = useState();
  const { data: addPlaceData, client } = useQuery(GET_ADD_PLACE_DATA);
  const { data: tokenData, client: unusedClient } = useQuery(GET_TOKEN);
  const jwtBearer = "".concat("Bearer ", tokenData.token).replace(/\"/g, "")

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
   * HELPERS
   */

  const imageTakenHandler = (image) => {
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
    const formattedAddress = resData.results[0].formatted_address
    const googlePlaceId = resData.results[0].place_id
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
        phone: "",
      },
      context: {
        headers: {
          // Set the token dynamically from cache. 
          Authorization: jwtBearer
        }
      },
      refetchQueries: [{ query: GET_CAT_PLACES, variables: { catId: props.route.params.catId } }]
    })

    props.navigation.goBack();
  };

  /**
   * RETURN
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

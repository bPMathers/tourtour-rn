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
import LocationPickerForUpdatePlace from '../components/LocationPickerForUpdatePlace'
import { TourTourColors } from '../constants/Colors';
import ImagePicker from '../components/ImagePicker';
import { GET_CAT_PLACES, GET_ADD_PLACE_DATA, GET_TOKEN, GET_PLACE, GET_MY_PLACES } from '../graphql/queries'

const UpdateMyPlaceScreen = props => {
  const place = props.route.params.place
  /**
   * HOOKS
   */
  // const [base64Image, setBase64Image] = useState();
  // const { data: placeData, loading: placeLoading, error: placeError } = useQuery(GET_PLACE, {
  //   // Must get this on props.route.params when navigating from ListItem
  //   variables: { placeId: props.route.params.placeId }
  // });
  // console.log(`placeData: ${JSON.stringify(placeData, undefined, 2)}`)
  const { data: addPlaceData, client } = useQuery(GET_ADD_PLACE_DATA);
  const { data: tokenData, client: unusedClient2 } = useQuery(GET_TOKEN);
  const jwtBearer = "".concat("Bearer ", tokenData.token).replace(/\"/g, "")

  // Previous Place Data
  const [name, setName] = useState(place.name);
  const [catId, setCatId] = useState(place.category.id);
  const [imageUrl, setImageUrl] = useState(place.imageUrl);
  const [lat, setLat] = useState(place.lat);
  const [lng, setLng] = useState(place.lng);
  const [placeId, setPlaceId] = useState(place.google_place_id);
  const [formatted_address, setFormatted_address] = useState(place.formatted_address);
  const [phone, setPhone] = useState(place.phone);
  console.log(`formatted_address: ${formatted_address}`)

  const [locationForMapPreview, setLocationForMapPreview] = useState({ lat: place.lat, lng: place.lng })

  const [imageHasChanged, setImageHasChanged] = useState(false)
  const [locHasChanged, setLocHasChanged] = useState(false)


  // useEffect(() => {
  //   setName(props.route.params?.autoCompletePickedPlace?.name)
  //   if (props.route.params?.autoCompletePickedPlace?.geometry) {

  //     client.writeData({
  //       data: {
  //         lat: props.route.params?.autoCompletePickedPlace?.geometry.location.lat,
  //         lng: props.route.params?.autoCompletePickedPlace?.geometry.location.lng,
  //       }
  //     })
  //   }

  // }, [props.route.params?.autoCompletePickedPlace])

  useEffect(() => {
    setLocationForMapPreview(props.route?.params?.pickedLocationOnMap)
    setLocHasChanged(true)
    setLat(props.route.params.pickedLocationOnMap?.lat)
    setLng(props.route.params.pickedLocationOnMap?.lng)

  }, [props.route.params.pickedLocationOnMap])


  /**
   * GRAPHQL - MOVE TO EXTERNAL FILE WHEN DONE
   */

  const UPDATE_PLACE = gql`
    mutation($id: ID!, $name: String!, $imageUrl: String, $lat: Float, $lng: Float, $placeId: String, $formatted_address: String, $phone: String, $url: String) {
    updatePlace(
      id: $id
      data: {
        name: $name
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

  const [updatePlace, { data }] = useMutation(UPDATE_PLACE)

  /**
   * HELPERS
   */

  const imageTakenHandler = (image) => {
    setImageHasChanged(true)
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

  const locationReTakenHandler = (newLoc) => {

    if (newLoc) {

      setLat(newLoc.lat)
      setLng(newLoc.lng)
      setLocHasChanged(true)
    }
  }

  const completeUpdatePlace = (newFormattedAddress) => {
    updatePlace({
      variables: {
        id: place.id,
        name: name,
        // categoryId: catId,
        imageUrl: imageUrl,
        lat: lat,
        lng: lng,
        placeId: placeId,
        formatted_address: newFormattedAddress ?? formatted_address,
        phone: phone,
      },
      context: {
        headers: {
          // Set the token dynamically from cache. 
          Authorization: jwtBearer
        }
      },
      refetchQueries: [{
        query: GET_MY_PLACES, context: {
          headers: {
            // Set the token dynamically from cache. 
            Authorization: jwtBearer
          }
        },
      }]
    })
    props.navigation.goBack();
  }

  const updatePlaceHandler = async () => {
    // send img to cloudinary and get url back only if user picked a new image
    if (imageHasChanged) {
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
        setImageUrl(data.secure_url)
        return data.secure_url
      }).catch(err => console.log(err))
    }

    // Get rev geocoding location data if location was changed
    if (locHasChanged) {
      console.log("lochaschanged route taken")

      const revGeoCodingResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`)

      if (!revGeoCodingResponse.ok) {
        throw new Error("error while fetching reverse geocoding")
      }

      const resData = await revGeoCodingResponse.json()
      setFormatted_address(resData.results[0].formatted_address)
      setPlaceId(resData.results[0].place_id)
      completeUpdatePlace(resData.results[0].formatted_address)
      return
    }
    // Initiate GraphQL Mutation & refetch
    completeUpdatePlace()

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

        <ImagePicker onImageTaken={imageTakenHandler} />
        <LocationPickerForUpdatePlace
          // navigation={props.navigation}
          route={props.route}
          onTakeNewLocation={locationReTakenHandler}
          locationForMapPreview={locationForMapPreview}
        />
        <Button
          title="Mettre à jour"
          color={TourTourColors.accent}
          onPress={updatePlaceHandler}
        />
      </View>
    </ScrollView>
  );
}


UpdateMyPlaceScreen.navigationOptions = {
  headerTitle: 'Update Place'
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
    paddingHorizontal: 2,
    marginBottom: 25
  }
});

export default UpdateMyPlaceScreen;

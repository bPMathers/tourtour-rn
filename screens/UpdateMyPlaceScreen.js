import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { getCloudinaryUrl } from '../utils/getCloudinaryUrl'
import { getReverseGeocodingInfo } from '../utils/getReverseGeocodingInfo'
import LocationPickerForUpdatePlace from '../components/LocationPickerForUpdatePlace'
import { TourTourColors } from '../constants/Colors';
import ImagePickerForUpdatePlace from '../components/ImagePickerForUpdatePlace';
import { GET_CAT_PLACES, GET_ADD_PLACE_DATA, GET_TOKEN, GET_PLACE, GET_MY_PLACES, GET_USER, GET_TOKEN_AND_USER_ID } from '../graphql/queries'

const UpdateMyPlaceScreen = props => {
  const place = props.route.params.place

  const { data: addPlaceData, client } = useQuery(GET_ADD_PLACE_DATA);
  const { data: tokenAndIdData, client: unusedClient2 } = useQuery(GET_TOKEN_AND_USER_ID);
  const jwtBearer = "".concat("Bearer ", tokenAndIdData.token).replace(/\"/g, "")

  // Previous Place Data
  const [name, setName] = useState(place.name);
  const [catId, setCatId] = useState(place.category.id);
  const [imageUrl, setImageUrl] = useState(place.imageUrl);
  const [lat, setLat] = useState(place.lat);
  const [lng, setLng] = useState(place.lng);
  const [placeId, setPlaceId] = useState(place.google_place_id);
  const [formatted_address, setFormatted_address] = useState(place.formatted_address);
  const [phone, setPhone] = useState(place.phone);
  // console.log(`formatted_address: ${formatted_address}`)

  const [locationForMapPreview, setLocationForMapPreview] = useState({ lat: place.lat, lng: place.lng })

  const [imageHasChanged, setImageHasChanged] = useState(false)
  const [imgBase64, setImgBase64] = useState(undefined)
  const [locHasChanged, setLocHasChanged] = useState(false)

  useEffect(() => {
    setLocationForMapPreview(props.route?.params?.pickedLocationOnMap)
    setLocHasChanged(true)
    setLat(props.route.params.pickedLocationOnMap?.lat)
    setLng(props.route.params.pickedLocationOnMap?.lng)

  }, [props.route.params.pickedLocationOnMap])


  /**
   * GRAPHQL
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
  const [updatePlace] = useMutation(UPDATE_PLACE)

  const DELETE_PLACE = gql`
    mutation($placeId: ID!) {
      deletePlace(
        id: $placeId 
      ){
        id
      }
    }  
  `
  const [deletePlace] = useMutation(DELETE_PLACE)


  /**
   * HELPERS
   */

  const nameChangeHandler = (text) => {
    // should sanitize input ?
    setName(text);
  };

  const imageTakenHandler = (image) => {
    setImageHasChanged(true)
    // manage imageBase64 in local state 
    setImgBase64(image.base64)

    // client.writeData({
    //   data: {
    //     imageUrl: image.uri,
    //     imageBase64: image.base64
    //   }
    // })
  };

  const locationReTakenHandler = (newLoc) => {

    if (newLoc) {
      setLat(newLoc.lat)
      setLng(newLoc.lng)
      setLocHasChanged(true)
    }
  }

  const updatePlaceHandler = async (newImgBase64, newLocation) => {

    try {
      const newImgUrl = await getCloudinaryUrl(newImgBase64)
      const newFormattedAddressAndGooglePlaceId = await getReverseGeocodingInfo(newLocation)

      updatePlace({
        variables: {
          id: place.id,
          name: name,
          // categoryId: we can't change that yet
          imageUrl: newImgUrl ?? imageUrl,
          // url: "websitelink",
          lat: lat,
          lng: lng,
          placeId: newFormattedAddressAndGooglePlaceId?.placeId ?? placeId,
          formatted_address: newFormattedAddressAndGooglePlaceId?.formattedAddress ?? formatted_address,
          phone: phone,
        },
        context: {
          headers: {
            Authorization: jwtBearer
          }
        },
        refetchQueries: [{
          query: GET_MY_PLACES, context: {
            headers: {
              Authorization: jwtBearer
            }
          },
        }]
      })
      props.navigation.goBack();
    } catch {
      throw new Error('Failed to update place')
    }

  }

  const onDeleteHandler = () => {
    deletePlace({
      variables: {
        placeId: place.id
      },
      context: {
        headers: {
          Authorization: jwtBearer
        }
      },
      refetchQueries: [
        {
          query: GET_MY_PLACES, context: {
            headers: {
              Authorization: jwtBearer
            }
          },
        },
        {
          query: GET_CAT_PLACES,
          variables: {
            catId: place.category.id
          }
        },
        {
          query: GET_USER,
          variables: {
            userId: tokenAndIdData.userId
          },
          context: {
            headers: {
              Authorization: jwtBearer
            }
          },
        }
      ]
    })
    props.navigation.goBack()
  }



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

        <ImagePickerForUpdatePlace onImageTaken={imageTakenHandler} initialImgUrl={place.imageUrl} />
        <LocationPickerForUpdatePlace
          // navigation={props.navigation}
          route={props.route}
          onTakeNewLocation={locationReTakenHandler}
          locationForMapPreview={locationForMapPreview}
        />
        <View style={{ marginBottom: 20 }}>
          <Button
            title="Mettre à jour"
            color={TourTourColors.accent}
            onPress={() => { updatePlaceHandler(imgBase64, { lat, lng }) }}
          />
        </View>
        <View style={{ marginBottom: 20 }}>

          <Button
            title="Supprimer"
            color='red'
            onPress={() => {
              Alert.alert(
                'Attention!',
                "Êtes-vous certain(e) de vouloir supprimer cet endroit ?",
                [
                  { text: 'Annuler', style: 'destructive' },
                  { text: 'Confirmer', onPress: () => { onDeleteHandler() } },
                ]
              )
            }}
          />
        </View>
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

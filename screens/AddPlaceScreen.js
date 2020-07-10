import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import i18n from 'i18n-js'

import { getCloudinaryUrl } from '../utils/getCloudinaryUrl'
import { getReverseGeocodingInfo } from '../utils/getReverseGeocodingInfo'
import LocationPicker from '../components/LocationPicker'
import { TourTourColors } from '../constants/Colors';
import ImagePicker from '../components/ImagePicker';
import { GET_CAT_PLACES, GET_ADD_PLACE_DATA, GET_TOKEN } from '../graphql/queries'
import CustomButton from '../components/CustomButton';

const NewPlaceScreen = props => {

  const client = useApolloClient()
  const [name, setName] = useState('');
  const [imgBase64, setImgBase64] = useState()
  const [lat, setLat] = useState()
  const [lng, setLng] = useState()
  const [phone, setPhone] = useState('')
  // use one of my cloudinary files instead!
  const [imageUri, setImageUri] = useState('https://res.cloudinary.com/db4mzdmnm/image/upload/v1592273897/no-image-icon-6_zoucqc.png')
  const { data: tokenData } = useQuery(GET_TOKEN);
  const jwtBearer = "".concat("Bearer ", tokenData?.token).replace(/\"/g, "")


  useEffect(() => {
    setName(props.route.params?.autoCompletePickedPlace?.name)
    if (props.route.params?.autoCompletePickedPlace?.geometry) {

      client.writeData({
        data: {
          lat: props.route.params?.autoCompletePickedPlace?.geometry.location.lat,
          lng: props.route.params?.autoCompletePickedPlace?.geometry.location.lng,
        }
      })

      setLat(props.route.params?.autoCompletePickedPlace?.geometry.location.lat)
      setLng(props.route.params?.autoCompletePickedPlace?.geometry.location.lng)
      setPhone(props.route.params?.autoCompletePickedPlace?.international_phone_number)
    }

  }, [props.route.params?.autoCompletePickedPlace])

  useEffect(() => {
    // setLocationForMapPreview(props.route?.params?.pickedLocationOnMap)
    // setLocHasChanged(true)
    setLat(props.route.params.pickedLocationOnMap?.lat)
    setLng(props.route.params.pickedLocationOnMap?.lng)

  }, [props.route.params.pickedLocationOnMap])

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

  const [addPlace] = useMutation(ADD_PLACE)

  /**
   * HELPERS
   */

  const nameChangeHandler = text => {
    setName(text);
  };
  const phoneChangeHandler = text => {
    setPhone(text);
  };

  const imageTakenHandler = (image) => {
    setImageUri(image.uri)
    setImgBase64(image.base64)
  };

  const locationTakenHandler = (newLoc) => {
    if (newLoc) {
      setLat(newLoc.lat)
      setLng(newLoc.lng)
    }
  }

  const savePlaceHandler = async (newImgBase64, newLocation) => {
    const newImgUrl = await getCloudinaryUrl(newImgBase64)
    const newFormattedAddressAndGooglePlaceId = await getReverseGeocodingInfo(newLocation)

    addPlace({
      // eventually prevent adding if some info is missing
      variables: {
        name: name,
        categoryId: props.route.params.catId,
        imageUrl: newImgUrl ?? "https://upload.wikimedia.org/wikipedia/en/6/60/No_Picture.jpg",
        lat: lat ?? 0,
        lng: lng ?? 0,
        placeId: newFormattedAddressAndGooglePlaceId?.placeId ?? '',
        formatted_address: newFormattedAddressAndGooglePlaceId?.formattedAddress ?? '',
        phone: phone ?? '',
      },
      context: {
        headers: {
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
        <Text style={styles.label}>{i18n.t('Name')}</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={nameChangeHandler}
          value={name}
        // placeholder={`Nom du ou de la "${props.route.params.catTitle}" à ajouter`}
        />
        <Text style={styles.label}>{i18n.t('Telephone')}</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={phoneChangeHandler}
          value={phone}
        // placeholder={`# de tel. du ou de la "${props.route.params.catTitle}" à ajouter`}
        />
        <View style={{ marginBottom: 20 }}>
          <CustomButton title={i18n.t('UseGoogleAc')} onPress={() => {
            props.navigation.navigate('GoogleAC')
          }}></CustomButton>
        </View>
        <ImagePicker onImageTaken={imageTakenHandler} imageUri={imageUri} />
        <LocationPicker
          navigation={props.navigation}
          route={props.route}
          onLocationTaken={locationTakenHandler}
        />
        <CustomButton
          title={i18n.t('Save')}
          color='#06eeaa'
          onPress={() => { savePlaceHandler(imgBase64, { lat, lng }) }}
        />
      </View>
    </ScrollView>
  );
}


NewPlaceScreen.navigationOptions = {
  headerTitle: 'Add Place'
};

const styles = StyleSheet.create({
  form: {
    margin: 30
  },
  label: {
    color: TourTourColors.accent,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 0
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    marginBottom: 20,
    paddingVertical: 4,
    paddingHorizontal: 2
  }
});

export default NewPlaceScreen;

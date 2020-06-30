import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useApolloClient } from "@apollo/react-hooks";
import i18n from 'i18n-js'

import CustomButton from './CustomButton'
import { googleApiKey } from '../env'

const GooglePlacesACInput = (props) => {
  const client = useApolloClient();

  const [pickedPlace, setPickedPlace] = React.useState()
  // const [geocodedLoc, setGeocodedLoc] = React.useState()

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder='Search'
        query={{
          key: googleApiKey,
          language: 'en', // language of the results
        }}
        fetchDetails={true}
        onPress={(data, details) => {
          setPickedPlace(details)
        }}
        onFail={error => console.error(error)}
        requestUrl={{
          url:
            'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
          useOnPlatform: 'web',
        }} // this in only required for use on the web. See https://git.io/JflFv more for details.
        styles={{
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            // width: 300,
            // flex: 1,
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />
      <CustomButton title={i18n.t('Select')} onPress={() => {
        props.navigation.navigate('AddPlace', { autoCompletePickedPlace: pickedPlace })
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
    paddingBottom: 100
    // marginVertical: 200
  },
});

export default GooglePlacesACInput;

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';

import LocationPicker from '../components/LocationPicker'
import { TourTourColors } from '../constants/Colors';
// import ImagePicker from '../components/ImagePicker';

const NewPlaceScreen = props => {
  const [titleValue, setTitleValue] = useState('');
  const [selectedImage, setSelectedImage] = useState();



  const titleChangeHandler = text => {
    // you could add validation
    setTitleValue(text);
  };

  const imageTakenHandler = imagePath => {
    setSelectedImage(imagePath);
  };

  const savePlaceHandler = () => {
    dispatch(placesActions.addPlace(titleValue, selectedImage));
    props.navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <Text style={styles.label}>Nom de la place</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={titleChangeHandler}
          value={titleValue}
        />
        {/*<ImagePicker onImageTaken={imageTakenHandler} />*/}
        <LocationPicker navigation={props.navigation} route={props.route} />
        <Button
          title="Save Place"
          color={TourTourColors.primary}
          onPress={savePlaceHandler}
        />
      </View>
    </ScrollView>
  );
};

NewPlaceScreen.navigationOptions = {
  headerTitle: 'Add Place'
};

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

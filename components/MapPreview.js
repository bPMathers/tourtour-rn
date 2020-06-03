import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { googleApiKey } from '../env'

const MapPreview = props => {
  let imagePreviewUrl;

  if (props.location) {
    imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${
      props.location.lat
      },${
      props.location.lng
      }&zoom=14&size=400x300&maptype=roadmap&markers=color:red%7Clabel:A%7C${
      props.location.lat
      },${props.location.lng}&key=${googleApiKey}`;
  }

  return (
    <TouchableOpacity onPress={props.onPressMap} style={{ ...styles.mapPreview, ...props.style }}>
      {props.location ? (
        <Image style={styles.mapImage} source={{ uri: imagePreviewUrl }} />
      ) : (
          props.children
        )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapImage: {
    width: '100%',
    height: '100%'
  }
});

export default MapPreview;

import React from 'react';
import { Image, StyleSheet } from 'react-native';

const MapPreview = (props) => {
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${props.location.lat},${props.location.lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:red%7Clabel:A%7C${props.location.lat},${props.location.lng}&key=${process.env}`

  return (
    
  );
}

const styles = StyleSheet.create({

})

export default MapPreview;
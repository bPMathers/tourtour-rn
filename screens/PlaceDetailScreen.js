import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceDetailScreen = (props) => {
  const place = props.route.params.place;

  return (
    <View style={styles.container}>
      <Text>{place.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlaceDetailScreen;

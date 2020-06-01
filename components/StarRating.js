import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

import { TourTourColors } from '../constants/Colors'

const StarRating = (props) => {
  return (
    <View style={styles.starRating}>
      <Ionicons
        style={styles.starIcon}
        name='ios-star'
        size={16}
        color={props.color}
      />
      <Ionicons
        style={styles.starIcon}
        name='ios-star'
        size={16}
        color={props.color}
      />
      <Ionicons
        style={styles.starIcon}
        name='ios-star'
        size={16}
        color={props.color}
      />
      <Ionicons
        style={styles.starIcon}
        name='ios-star'
        size={16}
        color={props.color}
      />
      <Ionicons
        style={styles.starIcon}
        name='ios-star-half'
        size={16}
        color={props.color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  starIcon: {
    marginLeft: 2,
  },
  starRating: {
    flexDirection: 'row',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default StarRating;


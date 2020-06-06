import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import SwipeableRating from 'react-native-swipeable-rating';

import { TourTourColors } from '../constants/Colors'


const StarRating = (props) => {
  // console.log(props.ratingg)

  // handleRating = (starRating) => {
  //   setRating(starRating);
  // }
  return (
    <View>
      <SwipeableRating
        swipeable={true}
        rating={props.rating}
        size={props.size ? props.size : 16}
        xOffset={0}
        allowHalves
        color={props.color}
        emptyColor={props.color}
        style={styles.rating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rating: {
    flex: 0,
    marginRight: 0
  }
})

export default StarRating;


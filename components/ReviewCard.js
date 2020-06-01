import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TourTourColors } from '../constants/Colors';

const ReviewCard = (props) => {
  return (
    <View style={styles.reviewCardContainer}>
      <Text>{props.author}</Text>
      <Text>{props.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewCardContainer: {
    height: 300,
    backgroundColor: TourTourColors.primary
  }
})

export default ReviewCard;
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'

import { TourTourColors } from '../constants/Colors';
import StarRating from './StarRating'


const ReviewCard = (props) => {

  const handleOnUserProfileSelect = () => {
    props.navigation.navigate('UserProfile', {
      userId: props.review.author.id,
      userName: props.review.author.name
    })
  }

  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }
  return (
    <TouchableComponent>
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableComponent onPress={handleOnUserProfileSelect}>
                <View style={{ marginRight: 5 }}>
                  <Image style={styles.tinyUserProfilePic} source={{ uri: props.review.author.imageUrl }} />
                </View>
              </TouchableComponent>
              <View>
                <TouchableComponent onPress={handleOnUserProfileSelect}>
                  <Text style={styles.authorName}>{props.review.author.name}</Text>
                </TouchableComponent>
                <StarRating color='white' />
                <Text style={styles.timeAgoText}>2h ago</Text>
              </View>
            </View>
            <TouchableComponent>
              <FontAwesome5 name='pencil-alt' color='white' size={18} />
            </TouchableComponent>
          </View>
        </View>
        <Text style={styles.reviewBody}>{props.review.body}</Text>
      </View>
    </TouchableComponent>
  );
}

const styles = StyleSheet.create({
  reviewCard: {
    flex: 1,
    backgroundColor: TourTourColors.accent,
    padding: 10,
    borderRadius: 10
  },
  authorName: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  reviewHeader: {
    marginBottom: 10
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  reviewBody: {
    color: 'white',
    fontSize: 16
  },
  tinyUserProfilePic: {
    width: 50,
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 50
  },
  timeAgoText: {
    color: 'white',
    fontSize: 10
  }
})

export default ReviewCard;
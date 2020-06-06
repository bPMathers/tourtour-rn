import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import TimeAgo from 'react-native-timeago';

import { TourTourColors } from '../constants/Colors';
import StarRating from './StarRating'


const ReviewCard = (props) => {
  console.log(props.review.updatedAt)
  let timestamp = "2015-06-21T06:24:44.124Z";

  const handleOnUserProfileSelect = () => {
    props.navigation.navigate('UserProfile', {
      userId: props.review.author.id,
      userName: props.review.author.name
    })
  }

  const handleEditPress = () => {
    props.navigation.navigate('UpdateReview', {
      review: props.review
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
                <StarRating rating={props.review.rating} color='white' />
                {/*<Text style={styles.timeAgoText}>2h ago</Text>*/}
                <TimeAgo style={styles.timeAgoText} time={props.review.updatedAt} />
              </View>
            </View>
            <TouchableComponent onPress={handleEditPress}>
              <FontAwesome5 name='pencil-alt' color='white' size={18} />
            </TouchableComponent>
          </View>
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.reviewTitleText}>:: {props.review.title}</Text>
        </View>
        <View>
          <Text style={styles.reviewBodyText}>{props.review.body}</Text>
        </View>
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
  reviewTitleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewBodyText: {
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
    fontSize: 12
  }
})

export default ReviewCard;
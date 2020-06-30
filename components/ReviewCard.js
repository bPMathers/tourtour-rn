import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import TimeAgo from 'react-native-timeago';

import { TourTourColors } from '../constants/Colors';
import StarRating from './StarRating'


const ReviewCard = (props) => {
  const loggedInUserId = props.loggedInUserId
  // console.log(loggedInUserId)

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

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleOnUserProfileSelect}>
              <View style={{ marginRight: 5 }}>
                <Image style={styles.tinyUserProfilePic} source={{ uri: props.review.author.imageUrl }} />
              </View>
            </TouchableOpacity>
            <View>
              <TouchableOpacity onPress={handleOnUserProfileSelect}>
                <Text style={styles.authorName}>{props.review.author.name}</Text>
              </TouchableOpacity>
              <StarRating rating={props.review.rating} color='white' />
              {/*<Text style={styles.timeAgoText}>2h ago</Text>*/}
              <TimeAgo style={styles.timeAgoText} time={props.review.updatedAt} />
            </View>
          </View>
          {loggedInUserId === props.review.author.id ? (
            <TouchableOpacity onPress={handleEditPress}>
              <FontAwesome5 name='pencil-alt' color='white' size={18} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {/*<View style={{ marginBottom: 8 }}>
        <Text style={styles.reviewTitleText}>:: {props.review.title}</Text>
      </View>*/}
      <View>
        <Text style={styles.reviewBodyText}>{props.review.body}</Text>
      </View>
    </View>
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
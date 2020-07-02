import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import i18n from 'i18n-js'

import { TourTourColors } from '../constants/Colors'
import SwipeableRating from 'react-native-swipeable-rating';
import { GET_REVIEWS, GET_TOKEN_AND_USER_ID, GET_MY_REVIEWS, GET_USER, GET_PLACE } from '../graphql/queries'
import CustomButton from '../components/CustomButton';


const UpdateReviewScreen = (props) => {
  const { data: tokenAndIdData } = useQuery(GET_TOKEN_AND_USER_ID);
  // const { data: placeData } = useQuery(GET_PLACE)
  const jwtBearer = "".concat("Bearer ", tokenAndIdData.token).replace(/\"/g, "")
  /**
   * VARIABLES
   */

  const place = props.route.params.review.place
  const review = props.route.params.review

  /**
   * HOOKS
   */

  const [rating, setRating] = useState(review.rating)
  const [body, setBody] = useState(review.body);

  /**
   * GRAPHQL
   */

  const UPDATE_REVIEW = gql`
    mutation($body: String!, $placeId: String!, $rating: Float!, $id: ID!) {
    updateReview(
      id: $id
      data: {
        body: $body
        rating: $rating
        placeId: $placeId
      }) {
      id
      }
    }
  `;

  const [updateReview] = useMutation(UPDATE_REVIEW)

  const DELETE_REVIEW = gql`
    mutation($id: ID!, $rating: Float!, $placeId: String!) {
      deleteReview(
        id: $id, 
        data: {
        rating: $rating
        placeId: $placeId
      }) {
        id
      }
    }
  `;

  const [deleteReview] = useMutation(DELETE_REVIEW)

  /**
   * HELPERS
   */

  const onSubmitHandler = () => {
    // Send mutation & refetch place 
    updateReview({
      variables: { body: body, placeId: place.id, rating: rating, id: review.id },
      refetchQueries: [
        { query: GET_REVIEWS, variables: { placeId: place.id } },
        { query: GET_PLACE, variables: { placeId: place.id } },
      ],
      context: {
        headers: {
          Authorization: jwtBearer
        }
      },
    })
    // Navigate to place detail
    props.navigation.goBack()
  }

  const onDeleteHandler = () => {
    deleteReview({
      variables: {
        id: review.id,
        rating: review.rating,
        placeId: place.id
      },
      refetchQueries: [
        { query: GET_REVIEWS, variables: { placeId: place.id } },
        { query: GET_PLACE, variables: { placeId: place.id } },
        {
          query: GET_MY_REVIEWS,
          context: {
            headers: {
              Authorization: jwtBearer
            }
          },
        },
        {
          query: GET_USER,
          variables: {
            userId: tokenAndIdData.userId
          },
          context: {
            headers: {
              Authorization: jwtBearer
            }
          },
        },
      ],
      context: {
        headers: {
          Authorization: jwtBearer
        }
      },
    })
    props.navigation.goBack()

  }

  /**
   * RETURN
   */

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 10 }}>
        <Text style={{
          color: TourTourColors.accent,
          fontWeight: 'bold'
        }}>{i18n.t('YourImpressions')}:</Text>
      </View>
      <View style={styles.placeInfo}>
        <Text style={{ fontWeight: 'bold' }}>{place.name}</Text>
        <Text>{place.formatted_address}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <View>
          <SwipeableRating
            swipeable={true}
            rating={rating}
            size={40}
            xOffset={0}
            allowHalves
            color="orange"
            emptyColor="orange"
            style={styles.rating}
            onPress={rating => setRating(rating)}
          />
        </View>
      </View>
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.label}>Review</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={body => setBody(body)}
          value={body}
          clearButtonMode="while-editing"
          multiline
        />
      </View>
      <View>
        <CustomButton title={i18n.t('Submit')} onPress={onSubmitHandler} color={TourTourColors.positive} />
      </View>
      <View>
        <CustomButton title={i18n.t('Delete')} onPress={() => {
          Alert.alert(
            `${i18n.t('Warning')}!`,
            i18n.t('ReviewDeleteConfirmAlert'),
            [
              { text: i18n.t('Cancel'), style: 'destructive' },
              { text: i18n.t('Confirm'), onPress: () => { onDeleteHandler() } },
            ]
          )
        }} color={TourTourColors.cancel} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  placeInfo: {
    marginBottom: 40
  },
  ratingContainer: {
    marginBottom: 30
  },
  rating: {
    flex: 0,
    marginRight: 0
  },
  formGroup: {
    marginBottom: 60
  },
  label: {
    color: TourTourColors.accent,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10
  },
  nameInput: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 2,
    marginBottom: 0,
    paddingVertical: 4,
    paddingHorizontal: 2
  }
})

export default UpdateReviewScreen

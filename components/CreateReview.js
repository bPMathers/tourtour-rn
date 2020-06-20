import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard, SafeAreaView } from 'react-native';
import SwipeableRating from 'react-native-swipeable-rating';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import { GET_REVIEWS, GET_TOKEN, GET_TOKEN_AND_USER_ID, GET_USER, GET_PLACE, GET_CAT_PLACES } from '../graphql/queries'
import { TourTourColors } from '../constants/Colors'

const CreateReview = (props) => {
  const place = props.place
  /**
   * HOOKS
   */
  const { data: tokenAndIdData } = useQuery(GET_TOKEN_AND_USER_ID);
  const jwtBearer = "".concat("Bearer ", tokenAndIdData?.token).replace(/\"/g, "")

  const reviewTextInput = useRef(null)
  const [title, setTitle] = useState('');
  const [body, setbody] = useState('');
  const [rating, setRating] = useState(3);


  /**
   * GRAPHQL
   */

  const CREATE_REVIEW = gql`
    mutation($title: String!, $body: String!, $placeId: String!, $rating: Float!) {
    createReview(
      data: {
        title: $title
        body: $body
        placeId: $placeId
        rating: $rating
      }) {
      id
      }
    }
  `;

  const [createReview, { data }] = useMutation(CREATE_REVIEW)

  /**
   * HELPERS
   */

  const handleSubmit = () => {
    createReview({
      variables: { title: title, body: body, placeId: place.id, rating: rating },
      context: {
        headers: {
          Authorization: jwtBearer
        }
      },
      refetchQueries: [
        { query: GET_REVIEWS, variables: { placeId: place.id } },
        { query: GET_PLACE, variables: { placeId: place.id } },
        { query: GET_CAT_PLACES, variables: { catId: place.catId } },
        {
          query: GET_USER, variables: { userId: tokenAndIdData.userId }, context: {
            headers: {
              Authorization: jwtBearer
            }
          },
        },
      ]
    })
    props.onClose()
  }

  const handleDictation = () => {
    Keyboard.dismiss()
  }

  const handleReviewsList = () => {
    Keyboard.dismiss()
  }

  return (
    <SafeAreaView>
      <View style={styles.reviewModalTopRow}>
        <View style={{ maxWidth: '90%' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: TourTourColors.accent }}>{props.place.name}
          </Text>
        </View>
        <TouchableOpacity onPress={props.onClose}>
          <AntDesign name='close' size={28} color='red' />
        </TouchableOpacity>
      </View>
      <View style={styles.reviewModalRatingRow}>
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
      <TextInput
        ref={reviewTextInput}
        autoFocus={true}
        style={styles.reviewModalTextInput}
        onChangeText={body => setbody(body)}
        value={body}
        placeholderTextColor="#bbb"
        placeholder="Avec ce mot on explique tout, on pardonne tout, on valide tout, parce que l’on ne cherche jamais à savoir ce qu’il contient. C’est le mot de passe qui permet d’ouvrir les cœurs, les sexes, les sacristies et les communautés humaines. Il couvre d’un voile prétendument désintéressé, voire transcendant, la recherche de la dominance et le prétendu instinct de propriété. "
        clearButtonMode="while-editing"
        multiline
        backgroundColor='white'

      />

      <View style={styles.reviewModalActionsRow}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{ marginRight: 7 }} onPress={() => {
            reviewTextInput.current.focus()
          }}>
            <MaterialCommunityIcons name='format-letter-case' size={26} color={TourTourColors.accent} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginRight: 7 }} onPress={handleDictation}>
            <MaterialCommunityIcons name='microphone' size={26} color={TourTourColors.accent} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginRight: 7 }} onPress={handleReviewsList}>
            <MaterialCommunityIcons name='star-box-outline' size={26} color={TourTourColors.accent} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.submitButton} color={TourTourColors.accent} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Soumettre</Text>
          <AntDesign name='arrowright' size={18} color='white' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  reviewModalTopRow: {
    marginTop: 20,
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rating: {
    flex: 0,
    marginLeft: -7,
  },
  reviewModalTextInput: {
    paddingVertical: 10,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 15,
  },
  reviewModalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: TourTourColors.accent,
    borderRadius: 10,
    // width: Dimensions.get("screen").width / 2
  },
  submitButtonText: {
    color: '#fff',
    // textAlign: 'center',
    paddingHorizontal: 7

  },
})

export default CreateReview;
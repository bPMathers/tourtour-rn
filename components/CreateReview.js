import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard, SafeAreaView, FlatList, Image } from 'react-native';
import SwipeableRating from 'react-native-swipeable-rating';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useNavigation } from '@react-navigation/native'
import TimeAgo from 'react-native-timeago';
import i18n from 'i18n-js'

import { GET_REVIEWS, GET_TOKEN_AND_USER_ID, GET_USER, GET_PLACE, GET_CAT_PLACES } from '../graphql/queries'
import { TourTourColors } from '../constants/Colors'
import FadeInView from '../components/FadeInView'
import StarRating from './StarRating'

const CreateReview = (props) => {
  const place = props.place
  /**
   * HOOKS
   */
  const { data: tokenAndIdData } = useQuery(GET_TOKEN_AND_USER_ID);
  const jwtBearer = "".concat("Bearer ", tokenAndIdData?.token).replace(/\"/g, "")
  const navigation = useNavigation()

  const reviewTextInput = useRef(null)
  const [body, setbody] = useState('');
  const [rating, setRating] = useState(3);
  const [showReviewsPane, setShowReviewsPane] = useState(false);

  const { loading: reviewsLoading, error: reviewsError, data: reviewsData, refetch } = useQuery(GET_REVIEWS, {
    variables: { placeId: place.id, orderBy: "updatedAt_DESC" },
  });

  /**
   * GRAPHQL
   */

  const CREATE_REVIEW = gql`
    mutation($body: String!, $placeId: String!, $rating: Float!) {
    createReview(
      data: {
        body: $body
        placeId: $placeId
        rating: $rating
      }) {
      id
      }
    }
  `;

  const [createReview] = useMutation(CREATE_REVIEW, {
    onCompleted: () => props.refetchReviews()
  })



  /**
   * HELPERS
   */

  const handleSubmit = () => {
    createReview({
      variables: { body: body, placeId: place.id, rating: rating },
      context: {
        headers: {
          Authorization: jwtBearer
        }
      },


    })
    props.onClose()

  }

  const handleDictation = () => {
    Keyboard.dismiss()
    setShowReviewsPane(false)
  }

  const handleReviewsList = () => {
    Keyboard.dismiss()
    setShowReviewsPane(true)
  }

  const renderListItem = ({ item }) => {

    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ marginRight: 5 }}>
                <Image style={styles.tinyUserProfilePic} source={{ uri: item.author.imageUrl }} />
              </View>
              <View>
                <View>
                  <Text style={styles.authorName}>{item.author.name}</Text>
                </View>
                <StarRating rating={item.rating} color='white' />
                <TimeAgo style={styles.timeAgoText} time={item.updatedAt} />
              </View>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.reviewBodyText}>{item.body}</Text>
        </View>
      </View>
    );
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
            setShowReviewsPane(false)
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
          <Text style={styles.submitButtonText}>{i18n.t('Submit')}</Text>
          <AntDesign name='arrowright' size={18} color='white' />
        </TouchableOpacity>
      </View>
      {showReviewsPane && <FadeInView style={{ marginTop: 10 }}>
        {reviewsLoading ? <View style={styles.container}>
          <Text>Loading...</Text></View> : <FlatList data={reviewsData.reviews} renderItem={renderListItem} ItemSeparatorComponent={() => <View style={{ margin: 4 }} />} />
        }
      </FadeInView>}
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
    paddingHorizontal: 15,
    backgroundColor: TourTourColors.accent,
    borderRadius: 20,
    // width: Dimensions.get("screen").width / 2
  },
  submitButtonText: {
    color: '#fff',
    // textAlign: 'center',
    paddingRight: 7,
    fontWeight: 'bold'

  },
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

export default CreateReview;
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import { TourTourColors } from '../constants/Colors'
import SwipeableRating from 'react-native-swipeable-rating';
import { GET_REVIEWS, GET_TOKEN, GET_TOKEN_AND_USER_ID, GET_MY_REVIEWS, GET_USER } from '../graphql/queries'


const UpdateReviewScreen = (props) => {
  const { data: tokenAndIdData, client: unusedClient } = useQuery(GET_TOKEN_AND_USER_ID);
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
  const [title, setTitle] = useState(review.title);
  const [body, setBody] = useState(review.body);

  /**
   * GRAPHQL
   */

  const UPDATE_REVIEW = gql`
    mutation($title: String!, $body: String!, $rating: Float!, $id: ID!) {
    updateReview(
      id: $id
      data: {
        title: $title
        body: $body
        rating: $rating
      }) {
      id
      }
    }
  `;

  const [updateReview, { data }] = useMutation(UPDATE_REVIEW)

  const DELETE_REVIEW = gql`
    mutation($id: ID!) {
      deleteReview(id: $id) {
        id
      }
    }
  `;

  const [deleteReview, { data: deleteData }] = useMutation(DELETE_REVIEW)

  /**
   * HELPERS
   */

  const onSubmitHandler = () => {
    // Send mutation & refetch place 
    updateReview({
      variables: { title: title, body: body, placeId: place.id, rating: rating, id: review.id },
      refetchQueries: [{ query: GET_REVIEWS, variables: { placeId: place.id } }],
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
      variables: { id: review.id },
      refetchQueries: [
        { query: GET_REVIEWS, variables: { placeId: place.id } },
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
        }
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
        <Text style={{ color: TourTourColors.accent, fontWeight: 'bold' }}>Mettre à jour vos impressions sur:</Text>
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
      <View style={styles.formGroup}>
        <Text style={styles.label}>Titre</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={title => setTitle(title)}
          value={title}
          placeholder="Un endroit complètement inusité et hirsute"
          clearButtonMode="while-editing"
          color='#444'

        />
      </View>
      <View style={{ marginBottom: 30 }}>
        <Text style={styles.label}>Review</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={body => setBody(body)}
          value={body}
          placeholder="Avec ce mot on explique tout, on pardonne tout, on valide tout, parce que l’on ne cherche jamais à savoir ce qu’il contient. C’est le mot de passe qui permet d’ouvrir les cœurs, les sexes, les sacristies et les communautés humaines. Il couvre d’un voile prétendument désintéressé, voire transcendant, la recherche de la dominance et le prétendu instinct de propriété. "
          clearButtonMode="while-editing"
          multiline
          color='#444'

        />
      </View>
      <View>
        <Button title="Annuler" onPress={() => { props.navigation.goBack() }} color='#F65E3C' />
      </View>
      <View>
        <Button title="Soumettre" onPress={onSubmitHandler} color={TourTourColors.primary} />
      </View>
      <View>
        <Button title="Supprimer" onPress={() => {
          Alert.alert(
            'Attention!',
            "Êtes-vous certain(e) de vouloir supprimer ce review ?",
            [
              { text: 'Annuler', style: 'destructive' },
              { text: 'Confirmer', onPress: () => { onDeleteHandler() } },
            ]
          )
        }} color='#F65E3C' />
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

    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    marginBottom: 0,
    paddingVertical: 4,
    paddingHorizontal: 2
  }
})

export default UpdateReviewScreen

import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, TouchableNativeFeedback, Image } from 'react-native';
import { useQuery } from '@apollo/react-hooks'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import TimeAgo from 'react-native-timeago';

import { GET_USER_REVIEWS } from '../graphql/queries'
import { TourTourColors } from '../constants/Colors'
import StarRating from '../components/StarRating'
import { useNavigation } from '@react-navigation/native';

const ReviewCard = ({ itemData }) => {
  const navigation = useNavigation()
  // const loggedInUserId = itemData.item.author.id

  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableComponent onPress={() => { navigation.goBack() }}>
              <View style={{ marginRight: 5 }}>
                <Image style={styles.tinyUserProfilePic} source={{ uri: itemData.item.author.imageUrl }} />
              </View>
            </TouchableComponent>
            <View>
              <TouchableComponent onPress={() => { navigation.goBack() }}>
                <Text style={styles.authorName}>{itemData.item.author.name}</Text>
              </TouchableComponent>
              <StarRating rating={itemData.item.rating} color='white' />
              <TimeAgo style={styles.timeAgoText} time={itemData.item.updatedAt} />
            </View>
          </View>
        </View>
      </View>
      <View style={{ marginBottom: 8, borderBottomColor: 'white', borderBottomWidth: StyleSheet.hairlineWidth }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: 'white' }}>Place: </Text>
          <TouchableOpacity onPress={() => { }}><Text style={{ fontWeight: 'bold', color: 'white' }}>{itemData.item.place.name}</Text></TouchableOpacity>
        </View>
      </View>
      <View style={{ marginBottom: 8 }}>
        <Text style={styles.reviewTitleText}>{itemData.item.title}</Text>
      </View>
      <View>
        <Text style={styles.reviewBodyText}>{itemData.item.body}</Text>
      </View>
    </View>
  )
}

const renderGridItem = (itemData) => {

  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }
  return (
    <ReviewCard itemData={itemData} />
  );
}

const UserReviewsListScreen = (props) => {
  const reviews = props.route.params.reviews
  // const { loading: reviewsLoading, error: reviewsError, data: reviewsData } = useQuery(GET_USER_REVIEWS, {
  //   context: {
  //     headers: {
  //       // Set the token dynamically from cache. 
  //       Authorization: props.route.params.userToken
  //     }
  //   },
  // });

  // if (reviewsLoading)
  //   return (
  //     <View style={styles.container}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // if (reviewsError)
  //   return (
  //     <View style={styles.container}>
  //       <Text>Error...</Text>
  //     </View>
  //   );

  return (
    <View style={{ padding: 10 }}>
      <FlatList data={reviews} renderItem={renderGridItem} ItemSeparatorComponent={() => <View style={{ margin: 4 }} />} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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

export default UserReviewsListScreen
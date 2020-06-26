import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, TouchableNativeFeedback, ActivityIndicator, TextInput, Modal } from 'react-native';
import { useQuery } from '@apollo/react-hooks'
import { Feather, Ionicons } from '@expo/vector-icons'
import TimeAgo from 'react-native-timeago';

import { GET_REVIEWS } from '../graphql/queries'
import { TourTourColors } from '../constants/Colors'
import ReviewCard from '../components/ReviewCard'
import StarRating from '../components/StarRating'
import { useNavigation } from '@react-navigation/native';

let loggedInUserId;
let navigation;
const renderGridItem = (itemData) => {

  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }
  return (
    <ReviewCard review={itemData.item} loggedInUserId={loggedInUserId} navigation={navigation} />
  );
}

const ReviewsListScreen = (props) => {
  const [orderBy, setOrderBy] = useState("updatedAt_DESC")
  const [orderByText, setOrderByText] = useState("Plus récentes")
  const [modalVisible, setModalVisible] = useState(false)
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  navigation = useNavigation()
  const { loading: reviewsLoading, error: reviewsError, data: reviewsData, refetch } = useQuery(GET_REVIEWS, {
    variables: {
      placeId: props.route.params.placeId,
      orderBy: orderBy,
      searchQuery: searchQuery
    },
    context: {
      headers: {
        // Set the token dynamically from cache. 
        Authorization: props.route.params.userToken
      }
    },
  });
  const [reviewsForDisplay, setReviewsForDisplay] = useState(reviewsData?.reviews);
  loggedInUserId = props.route.params.loggedInUserId


  useEffect(() => {
    if (searchInput.length > 2) {
      setSearchQuery(searchInput)
      refetch()
    } else {
      setSearchQuery("")
      refetch()
    }
  }, [searchInput, orderBy])

  const handleOrderBy = (orderByChoice) => {

    setOrderBy(orderByChoice)
    refetch()
    setModalVisible(false)
  }

  if (reviewsError)
    return (
      <View style={styles.container}>
        <Text>Error...</Text>
      </View>
    );

  return (
    <View style={{ paddingHorizontal: 10, flex: 1 }}>
      <Modal style={styles.pickerModal} visible={modalVisible} animationType='slide' transparent={true}>
        <View style={{
          height: '100%',
          justifyContent: "flex-end",
          alignItems: "center",
          // marginTop: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}>
          <View style={styles.pickerContainer}>
            <View style={{ paddingVertical: 10, borderBottomColor: 'white', borderBottomWidth: StyleSheet.hairlineWidth, alignItems: 'center' }}>
              <Text style={{ color: 'white' }}>Trier par</Text>
            </View>
            <View style={styles.pickerItem}>
              <TouchableOpacity onPress={() => { handleOrderBy("updatedAt_DESC"); setOrderByText("Plus récentes") }}>
                <Text style={styles.pickerItemText}>Plus récentes</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerItem}>
              <TouchableOpacity onPress={() => { handleOrderBy("updatedAt_ASC"); setOrderByText("Moins récentes") }}>
                <Text style={styles.pickerItemText}>Moins récentes</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerItem}>
              <TouchableOpacity onPress={() => { handleOrderBy("rating_DESC"); setOrderByText("Meilleure cote") }}>
                <Text style={styles.pickerItemText}>Meilleure cote</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerLastItem}>
              <TouchableOpacity onPress={() => { handleOrderBy("rating_ASC"); setOrderByText("Pire cote") }}>
                <Text style={styles.pickerItemText}>Pire cote</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cancelPickerButton}>
            <TouchableOpacity onPress={() => { setModalVisible(false) }} >
              <Text style={styles.pickerItemText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.actionsRow}>
        <View style={styles.searchSection}>
          <Ionicons name="ios-search" size={24} color='gray' style={{ paddingHorizontal: 10 }} />
          <TextInput
            style={styles.searchInput}
            onChangeText={(text) => setSearchInput(text)}
            value={searchInput}
            placeholder='Rechercher (min. 2 lettres)'
            autoCapitalize='none'
          />
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setModalVisible(true)}>
          <Text style={styles.actionButtonText}>{orderByText}</Text>
          <Ionicons name="ios-arrow-round-up" size={24} color={TourTourColors.accent} style={{ marginLeft: 5 }} />
          <Ionicons name="ios-arrow-round-down" size={24} color={TourTourColors.accent} />
        </TouchableOpacity>
      </View>
      {reviewsLoading ? <View style={styles.container}>
        <ActivityIndicator size="large" color={TourTourColors.accent} /></View> : <FlatList data={reviewsData.reviews} renderItem={renderGridItem} ItemSeparatorComponent={() => <View style={{ margin: 4 }} />} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 10,

    // marginTop: 50
  },
  searchInput: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
    borderRadius: 10,

  },
  pickerModal: {
    height: 200,
    backgroundColor: 'pink',
    alignItems: "center",
    backgroundColor: 'pink',
    // color: 'rgba(0, 0, 0, 0.6)'
  },
  pickerContainer: {
    backgroundColor: '#333745',
    width: '85%',
    borderRadius: 10
  },
  pickerItem: {
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'white'
  },
  pickerLastItem: {
    padding: 15
  },
  pickerItemText: {
    color: TourTourColors.primary,
    textAlign: 'center',
    fontSize: 20,
    // fontWeight: 'bold'
  },
  cancelPickerButton: {
    padding: 15,
    backgroundColor: '#333745',
    width: '85%',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 40
  },
  actionsRow: {
    // backgroundColor: 'pink',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionButton: {
    marginVertical: 8,
    height: 50,
    width: 100,
    backgroundColor: 'pink',
    // padding: 10,
    // backgroundColor: TourTourColors.primary,
    // borderWidth: 2,
    // borderColor: TourTourColors.accent,
    borderRadius: 20
  },
  actionButtonText: {
    fontWeight: 'bold',
    color: TourTourColors.accent
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

export default ReviewsListScreen
import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
  Modal,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { showLocation } from 'react-native-map-link'
import * as ImagePicker from 'expo-image-picker'
import * as Linking from 'expo-linking';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import TimeAgo from 'react-native-timeago';
import { Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import i18n from 'i18n-js'

import CreateReview from '../components/CreateReview'
import { TourTourColors } from '../constants/Colors'
import CustomButton from '../components/CustomButton'
import FeaturedPhotosGroup from '../components/FeaturedPhotosGroup'
import ReviewCard from '../components/ReviewCard'
import StarRating from '../components/StarRating'
import { GET_REVIEWS, GET_TOKEN_AND_USER_ID, GET_USER, GET_MY_PHOTOS } from '../graphql/queries'
import FadeInView from '../components/FadeInView';
import { useRoute } from '@react-navigation/native';

const ReviewsContainer = ({ navigation, reviewsLoading, reviewsError, reviewsData, loggedInUserId, refetch }) => {
  // console.log(reviewsData?.reviews?.length)

  // useEffect(() => {
  //   refetch
  // }, [reviewsData?.reviews])

  if (reviewsLoading) {
    return (
      <View style={styles.metaStateContainer}>
        <ActivityIndicator size="large" color={TourTourColors.accent} />
      </View>
    );
  }
  if (reviewsError)
    return (
      <View style={styles.container}>
        <Text>Error...</Text>
      </View>
    );

  return (
    !reviewsLoading &&
    reviewsData.reviews.map((review) => {
      return (
        <View key={review.id} style={styles.reviewCardContainer} >
          <ReviewCard loggedInUserId={loggedInUserId} review={review} navigation={navigation} />
        </View>
      )
    }))
}


const PlaceDetailScreen = (props) => {
  /**
   * HOOKS & VARIABLES
   */
  const { data: tokenAndIdData } = useQuery(GET_TOKEN_AND_USER_ID);


  const route = useRoute()
  const placeId = route.params.placeId
  const [modalVisible, setModalVisible] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const jwtBearer = "".concat("Bearer ", tokenAndIdData?.token).replace(/\"/g, "")
  const loggedInUserId = tokenAndIdData?.userId

  /**
   * GRAPHQL
   */
  const GET_PLACE = gql`
  query($placeId: String) {
    place(query: $placeId) {
      id
      name
      addedBy {
        id
        name
      }
      url
      phone
      category {
        id
        title
      }
      review_count
      avgRating
      imageUrl
      formatted_address
      lat
      lng
      google_place_id
      createdAt
      updatedAt
    }
  }
`;

  const { loading: placeLoading, error: placeError, data: placeData } = useQuery(GET_PLACE, {
    variables: {
      placeId: placeId,
    },
  });
  const place = placeData?.place

  const { loading: reviewsLoading, error: reviewsError, data: reviewsData, refetch } = useQuery(GET_REVIEWS, {
    variables: { placeId: placeId, orderBy: "updatedAt_DESC", first: 10 },
  });

  const GET_PHOTOS = gql`
    query($placeId: String, $orderBy: PhotoOrderByInput) {
      photos(query: $placeId, orderBy: $orderBy) {
        id
        url
        place {
          id
        }
        addedBy {
          id
          name
        }
      }
    }
  `;

  const { loading: photosLoading, error: photosError, data: photosData, refetch: refetchPhotos } = useQuery(GET_PHOTOS, {
    variables: {
      placeId: placeId,
      orderBy: "createdAt_DESC"
    },
  });

  const ADD_PHOTO = gql`
    mutation($url: String!, $placeId: String!) {
      createPhoto(data:{
        url: $url,
        placeId:  $placeId
      }){
        id 
        url
        place {
          id
        }
      }
    }
  `;

  const [addPhoto] = useMutation(ADD_PHOTO, {
    onCompleted: () => {
      setPhotoUploading(false)
      refetchPhotos()
    }
  })

  const DELETE_PHOTO = gql`
    mutation($id: ID!) {
      deletePhoto(id: $id){
        id 
      }
    }
  `;
  const [deletePhoto] = useMutation(DELETE_PHOTO, {
    onCompleted: () => refetchPhotos()
  })


  /**
   * HELPERS
   */

  const openImagePickerAsync = async () => {
    const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
      base64: true
    });
    if (!result.cancelled) {
      // setPhotoUrl(result.uri)

      const base64Img = `data:image/jpg;base64,${result.base64}`

      //Add your cloud name
      const apiUrl = 'https://api.cloudinary.com/v1_1/db4mzdmnm/image/upload';
      const data = {
        "file": base64Img,
        "upload_preset": "TourTour1",
      }
      fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async r => {
        const data = await r.json()
        // Send mutation to graphQL API
        addPhoto({
          variables: { url: data.secure_url, placeId: placeId },
          context: {
            headers: {
              Authorization: jwtBearer
            }
          },
          refetchQueries: [
            { query: GET_PHOTOS, variables: { url: data.secure_url, placeId: placeId } },
            {
              query: GET_USER, variables: { userId: tokenAndIdData.userId }, context: {
                headers: {
                  Authorization: jwtBearer
                }
              },
            },
            {
              query: GET_MY_PHOTOS, variables: { userId: tokenAndIdData.userId }, context: {
                headers: {
                  Authorization: jwtBearer
                }
              },
            },
          ]
        })
        setPhotoUploading(true)

        return data.secure_url
      }).catch(err => console.log(err))
    }
  }

  const openCameraAsync = async () => {
    const permissionResult2 = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult2.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
      base64: true
    });
    if (!result.cancelled) {
      // setPhotoUrl(result.uri)

      const base64Img = `data:image/jpg;base64,${result.base64}`

      //Add your cloud name
      const apiUrl = 'https://api.cloudinary.com/v1_1/db4mzdmnm/image/upload';
      const data = {
        "file": base64Img,
        "upload_preset": "TourTour1",
      }
      fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async r => {
        const data = await r.json()
        addPhoto({
          variables: { url: data.secure_url, placeId: placeId },
          context: {
            headers: {
              // Set the token dynamically from cache. 
              Authorization: jwtBearer
            }
          },
          refetchQueries: [{ query: GET_PHOTOS, variables: { url: data.secure_url, placeId: placeId } }]
        })

        // return data.secure_url
      }).catch(err => console.log(err))
    }
  }

  const handleUploadExistingPicture = async () => {
    await openImagePickerAsync();
    setModalVisible(false);
  }

  const handleTakeNewPictureForUpload = async () => {
    await openCameraAsync();
    setModalVisible(false);
  }

  const handleOnPressPhone = () => {
    if (place.phone && place.phone !== '') {
      Linking.openURL(`tel:${place.phone}`)
    } else {
      handleNoPlacePhone()
    }
  }

  const handleNoPlacePhone = () => {
    Alert.alert(
      i18n.t('NoPhone'),
      i18n.t('NoPhoneSearch'),
      [
        { text: i18n.t('no'), style: 'destructive' },
        { text: i18n.t('yes'), onPress: () => { Linking.openURL(`https:www.google.com/search?q=${place.name}+phone+number`) } },
      ]
    )
  }

  const handleOnPressWeb = () => {
    Linking.openURL(`https:www.google.com/search?q=${place.name}`)
  }


  const handleOnPressMap = async () => {
    // TODO : dynamically feed parameter values
    // Does including a googlePlaceId work ok along with lat & lng?
    showLocation({
      latitude: place.lat,
      longitude: place.lng,
      // sourceLatitude: 39.722157,  // optionally specify starting location for directions
      // sourceLongitude: 32.625768,  // not optional if sourceLatitude is specified
      title: place.formatted_address,  // optional
      googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
      googlePlaceId: place.google_place_id,  // optionally specify the google-place-id
      alwaysIncludeGoogle: false, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
      dialogTitle: 'Svp choisir quelle application ouvrir', // optional (default: 'Open in Maps')
      dialogMessage: 'Un sphincter, ça dit quoi?', // optional (default: 'What app would you like to use?')
      cancelText: 'Annuler', // optional (default: 'Cancel')
      appsWhiteList: ['google-maps', 'apple-maps'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
      // appTitles: { 'google-maps': 'My custom Google Maps title' } // optionally you can override default app titles
      // app: 'uber'  // optionally specify specific app to use
    })
  }

  const handleOnClose = () => {
    setReviewModalVisible(false)
  }

  const handleConfirmDeletePhoto = (selectedPhotoId) => {
    deletePhoto({
      variables: { id: selectedPhotoId },
      context: {
        headers: {
          Authorization: jwtBearer
        }
      }
    })
  }

  /**
   * NAV
   */

  props.navigation.setOptions({
    title: '',
    headerBackTitle: i18n.t('Back'),

  });

  /**
   * RETURN
   */

  return (
    !placeLoading &&
    <View>
      <View style={styles.modalContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3", marginBottom: 15 }}
                  onPress={handleTakeNewPictureForUpload}
                >
                  <Text style={styles.textStyle}>{i18n.t('NewPhoto')}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3", marginBottom: 15 }}
                  onPress={handleUploadExistingPicture}
                >
                  <Text style={styles.textStyle}>{i18n.t('ExistingPhoto')}</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "red" }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>{i18n.t('Cancel')}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <Modal animationType="slide" visible={reviewModalVisible}>
          <View style={styles.reviewModalContainer}>
            <CreateReview onClose={handleOnClose} place={place} refetchReviews={() => { refetch() }} loggedInUserId={loggedInUserId} />
          </View>
        </Modal>
      </View>
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <StatusBar barStyle={reviewModalVisible ? "dark-content" : "light-content"} backgroundColor="#6a51ae" />
        <View style={styles.placeDetailHeader}>
          <ImageBackground source={{ uri: place.imageUrl }} style={styles.image}>
            <View style={styles.overlayContentContainer}>
              {/*<TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                <View style={styles.topGroup}>
                  <View style={styles.backArrow}>
                    <Ionicons
                      style={styles.starIcon}
                      name='ios-arrow-back'
                      size={24}
                      color='white'
                    />
                  </View>
                </View>
              </TouchableOpacity>*/}
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.bottomGroup}>
                  <View>
                    <Text style={styles.name}>{place.name}</Text>
                  </View>
                  <View>
                    <Text style={styles.address}>{place.formatted_address}</Text>
                  </View>
                  <View style={styles.phoneRow}>
                    <FontAwesome name='phone' size={14} color='white' style={{ marginRight: 5 }} />
                    <View>
                      <Text style={styles.phone}>{place.phone ? place.phone : "--- numéro non défini ---"}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.submittedBy}>{i18n.t('addedBy')}: </Text>
                    <TouchableOpacity onPress={() => {
                      props.navigation.navigate('UserProfile', {
                        userId: place.addedBy.id,
                        userName: place.addedBy.name
                      })
                    }}>
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        {place.addedBy.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TimeAgo time={place.createdAt} style={{ color: 'white', fontSize: 12 }} />
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={handleOnPressPhone}>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <FontAwesome name='phone' size={22} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>{i18n.t('Call')}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOnPressMap}>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <FontAwesome5 name='map-marker-alt' size={18} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>{i18n.t('Map')}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOnPressWeb}>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <MaterialCommunityIcons name='web' size={26} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>{i18n.t('Website')}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setModalVisible(true) }}>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <MaterialCommunityIcons name='camera-enhance' size={25} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Photo</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            // props.navigation.navigate('CreateReview', { place: place }) 
            setReviewModalVisible(true)
          }}>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <Ionicons style={{ marginLeft: 4 }} name='ios-create' size={25} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Review</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {photoUploading || photosLoading ? <ActivityIndicator size="large" color={TourTourColors.accent} /> :
          <FadeInView>
            <FeaturedPhotosGroup place={place} photos={photosData?.photos} navigation={props.navigation} loggedInUserId={loggedInUserId} onConfirmDeletePhoto={handleConfirmDeletePhoto} />
          </FadeInView>}
        <View style={styles.reviewsHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.reviewsHeaderRowTitle}>Reviews</Text>
            <TouchableOpacity onPress={() => refetch()}><Ionicons name="md-refresh" size={30} color={TourTourColors.accent} /></TouchableOpacity>
          </View>
          <View>
            <StarRating color={TourTourColors.accent} rating={place.avgRating ?? 0} />
            <View>
              <Text style={{ textAlign: 'right', color: TourTourColors.accent, fontSize: 12 }}>
                {place.review_count} reviews
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.reviewsListContainer}>
          <ReviewsContainer
            place={place}
            navigation={props.navigation}
            reviewsData={reviewsData}
            reviewsLoading={reviewsLoading}
            reviewsError={reviewsError}
            loggedInUserId={loggedInUserId}
            refetch={() => refetch()}
          />
        </View>
        <View style={styles.moreReviewsButtonContainer}>
          <CustomButton width='50%' title={i18n.t('SeeAllReviews')} color={TourTourColors.primary} onPress={() => {
            props.navigation.navigate('ReviewsList', {
              placeId: placeId,
              loggedInUserId: loggedInUserId
            })
          }} />
        </View>
      </ScrollView>
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeDetailHeader: {
    height: 200,
    width: '100%',
    backgroundColor: '#ddd',
    overflow: 'hidden',
  },
  overlayContentContainer: {
    justifyContent: 'flex-end',
    height: '100%',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,.7)',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  topGroup: {
    marginTop: 30,
    flexDirection: 'row',

  },
  address: {
    color: 'white',
    maxWidth: '90%',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  phone: {
    color: 'white'
  },
  backArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  secondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomGroup: {
    marginLeft: 5,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 10

  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  starIcon: {
    marginLeft: 2,
  },
  location: {
    color: 'white',
    fontSize: 12,
  },
  submittedBy: {
    color: 'white',
    fontSize: 12,
  },
  actionsRow: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  actionGroup: {
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    backgroundColor: TourTourColors.primary,
    borderRadius: 25,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: "center"
  },
  actionTitle: {
    color: TourTourColors.accent,
    fontWeight: 'bold',
    fontSize: 12
  },
  reviewsHeaderRow: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12

  },
  reviewsHeaderRowTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TourTourColors.accent,
    marginRight: 10
  },
  reviewsListContainer: {
    flex: 1,
  },
  reviewCardContainer: {
    marginHorizontal: 12,
    marginVertical: 5
  },
  moreReviewsButtonContainer: {
    marginBottom: 40,
    alignItems: 'center'
  },
  centeredView: {
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  reviewModalContainer: {
    flex: 1,
    paddingHorizontal: 10
  },

});


export default PlaceDetailScreen;

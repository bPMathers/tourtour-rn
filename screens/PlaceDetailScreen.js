import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  ImageBackground,
  ScrollView,
  Button,
  FlatList,
  Alert,
  Modal,
  TouchableHighlight,
  SafeAreaView,
  Keyboard
} from 'react-native';
import { showLocation } from 'react-native-map-link'
import * as ImagePicker from 'expo-image-picker'
import * as Linking from 'expo-linking';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import TimeAgo from 'react-native-timeago';
import { Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

import CreateReview from '../components/CreateReview'
import { TourTourColors } from '../constants/Colors'
import FeaturedPhotosGroup from '../components/FeaturedPhotosGroup'
import ReviewCard from '../components/ReviewCard'
import StarRating from '../components/StarRating'
import { GET_REVIEWS, GET_TOKEN_AND_USER_ID, GET_USER, GET_MY_PHOTOS, GET_PLACE } from '../graphql/queries'
import { TextInput } from 'react-native-paper';

let loggedInUserId;

const ReviewsContainer = ({ place, navigation }) => {
  const { loading: reviewsLoading, error: reviewsError, data: reviewsData } = useQuery(GET_REVIEWS, {
    variables: { placeId: place.id, orderBy: "updatedAt_DESC", first: 10 },
  });

  if (reviewsLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
    reviewsData.reviews.map((review) => {
      return (
        <View key={review.id} style={styles.reviewCardContainer} >
          <ReviewCard loggedInUserId={loggedInUserId} review={review} navigation={navigation} />
        </View>
      )
    }))
}


const PlaceDetailScreen = (props) => {
  const place = props.route.params.place;
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const { data: tokenAndIdData } = useQuery(GET_TOKEN_AND_USER_ID);
  const { data: placeData, refetch } = useQuery(GET_PLACE, { variables: { placeId: place.id } });

  const jwtBearer = "".concat("Bearer ", tokenAndIdData?.token).replace(/\"/g, "")
  const loggedInUserId = tokenAndIdData?.userId


  const GET_PHOTOS = gql`
    query($placeId: String) {
      photos(query: $placeId) {
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

  const [addPhoto, { data }] = useMutation(ADD_PHOTO)

  const openImagePickerAsync = async () => {
    const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
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
          variables: { url: data.secure_url, placeId: place.id },
          context: {
            headers: {
              Authorization: jwtBearer
            }
          },
          refetchQueries: [
            { query: GET_PHOTOS, variables: { url: data.secure_url, placeId: place.id } },
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
      aspect: [4, 3],
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
          variables: { url: data.secure_url, placeId: place.id },
          context: {
            headers: {
              // Set the token dynamically from cache. 
              Authorization: jwtBearer
            }
          },
          refetchQueries: [{ query: GET_PHOTOS, variables: { url: data.secure_url, placeId: place.id } }]
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
      "Aucun numéro de téléphone n'est assigné pour cet endroit",
      "Voulez-vous accéder aux suggestions de google pour trouver le numéro?",
      [
        { text: 'Non', style: 'destructive' },
        { text: 'Oui', onPress: () => { Linking.openURL(`https:www.google.com/search?q=${place.name}+phone+number`) } },
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

  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
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
              <View style={{ flexDirection: 'column' }}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3", marginBottom: 15 }}
                  onPress={handleTakeNewPictureForUpload}
                >
                  <Text style={styles.textStyle}>Nouvelle Photo</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3", marginBottom: 15 }}
                  onPress={handleUploadExistingPicture}
                >
                  <Text style={styles.textStyle}>Photo déjà existante</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "red" }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Annuler</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <Modal animationType="slide" visible={reviewModalVisible}>
          <View style={styles.reviewModalContainer}>
            <CreateReview onClose={handleOnClose} place={place} />
          </View>
        </Modal>
      </View>
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <StatusBar barStyle={reviewModalVisible ? "dark-content" : "light-content"} backgroundColor="#6a51ae" />
        <View style={styles.placeDetailHeader}>
          <ImageBackground source={{ uri: place.imageUrl }} style={styles.image}>
            <View style={styles.overlayContentContainer}>
              <TouchableComponent onPress={() => { props.navigation.goBack() }}>
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
              </TouchableComponent>
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
                    <Text style={styles.submittedBy}>Ajouté par: </Text>
                    <TouchableComponent onPress={() => {
                      props.navigation.navigate('UserProfile', {
                        userId: place.addedBy.id,
                        userName: place.addedBy.name
                      })
                    }}>
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        {place.addedBy.name}
                      </Text>
                    </TouchableComponent>
                  </View>
                  <TimeAgo time={place.createdAt} style={{ color: 'white', fontSize: 12 }} />
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.actionsRow}>
          <TouchableComponent onPress={handleOnPressPhone}>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <FontAwesome name='phone' size={22} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Appeler</Text>
              </View>
            </View>
          </TouchableComponent>
          <TouchableComponent onPress={handleOnPressMap}>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <FontAwesome5 name='map-marker-alt' size={18} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Carte</Text>
              </View>
            </View>
          </TouchableComponent>
          <TouchableComponent onPress={handleOnPressWeb}>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <MaterialCommunityIcons name='web' size={26} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Site Web</Text>
              </View>
            </View>
          </TouchableComponent>
          <TouchableComponent onPress={() => { setModalVisible(true) }}>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <MaterialCommunityIcons name='camera-enhance' size={25} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Photo</Text>
              </View>
            </View>
          </TouchableComponent>
          <TouchableComponent onPress={() => {
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
          </TouchableComponent>
        </View>
        <FeaturedPhotosGroup place={place} navigation={props.navigation} loggedInUserId={loggedInUserId} />
        <View style={styles.reviewsHeaderRow}>
          <View>
            <Text style={styles.reviewsHeaderRowTitle}>Reviews</Text>
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
          <ReviewsContainer place={place} navigation={props.navigation} reviews={placeData?.reviews} />
        </View>
        <View style={styles.moreReviewsButtonContainer}>
          <Button title='Voir toutes les reviews' color={TourTourColors.accent} onPress={() => {
            props.navigation.navigate('ReviewsList', {
              placeId: place.id,
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
  placeDetailHeader: {
    height: 300,
    width: '100%',
    backgroundColor: '#ddd',
    overflow: 'hidden',
    // marginHorizontal: 10,
  },
  overlayContentContainer: {
    justifyContent: 'space-between',
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
  reviewCount: {
    color: 'white',
    fontSize: 12,
    marginBottom: 10
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
    // width: 100
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
  },
  reviewsListContainer: {
    flex: 1,
  },
  reviewCardContainer: {
    marginHorizontal: 12,
    marginVertical: 5
  },
  moreReviewsButtonContainer: {
    marginBottom: 40
  },
  centeredView: {
    // flex: 1,
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 0,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  reviewModalContainer: {
    flex: 1,
    paddingHorizontal: 10
  },

});


export default PlaceDetailScreen;

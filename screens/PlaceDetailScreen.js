import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  ImageBackground,
  FlatList,
  ScrollView,
  Button,
  Alert,
  Modal,
  TouchableHighlight
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import { TourTourColors } from '../constants/Colors'
import FeaturedPhotosGroup from '../components/FeaturedPhotosGroup'
import ReviewCard from '../components/ReviewCard'
import StarRating from '../components/StarRating'
import dummyReviewsList from '../data/dummyReviewsList'


const ReviewsContainer = ({ place, navigation }) => {
  const GET_REVIEWS = gql`
  query($placeId: String) {
    reviews(query: $placeId) {
      id
      title
      body
      rating
      author {
        id
        name
        imageUrl
      }
      place {
        id
      }
    }
  }
`;

  const { loading: reviewsLoading, error: reviewsError, data: reviewsData } = useQuery(GET_REVIEWS, {
    variables: { placeId: place.id },
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
          <ReviewCard review={review} navigation={navigation} />
        </View>
      )
    }))
}


const PlaceDetailScreen = (props) => {
  const place = props.route.params.place;
  const [modalVisible, setModalVisible] = useState(false);



  const GET_PHOTOS = gql`
    query($placeId: String) {
      photos(query: $placeId) {
        id
        url
        place {
          id
        }
      }
    }
  `;


  //recheck this mutation since we have modified schema quite a bit
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

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });
    if (!result.cancelled) {
      // setPhotoUrl(result.uri)

      let base64Img = `data:image/jpg;base64,${result.base64}`

      //Add your cloud name
      let apiUrl = 'https://api.cloudinary.com/v1_1/db4mzdmnm/image/upload';
      let data = {
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
        let data = await r.json()
        // Send mutation to graphQL API
        addPhoto({
          variables: { url: data.secure_url, placeId: place.id },
          refetchQueries: [{ query: GET_PHOTOS, variables: { url: data.secure_url, placeId: place.id } }]
        })
        // console.log(data.secure_url)

        return data.secure_url
      }).catch(err => console.log(err))
    }
  }

  let openCameraAsync = async () => {
    let permissionResult2 = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult2.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });
    if (!result.cancelled) {
      // setPhotoUrl(result.uri)

      let base64Img = `data:image/jpg;base64,${result.base64}`

      //Add your cloud name
      let apiUrl = 'https://api.cloudinary.com/v1_1/db4mzdmnm/image/upload';
      let data = {
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
        let data = await r.json()
        addPhoto({
          variables: { url: data.secure_url, placeId: place.id },
          refetchQueries: [{ query: GET_PHOTOS, variables: { url: data.secure_url, placeId: place.id } }]
        })

        return data.secure_url
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
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}></Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "red", marginRight: 4 }}
                  onPress={handleTakeNewPictureForUpload}
                >
                  <Text style={styles.textStyle}>Nouvelle Photo</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={handleUploadExistingPicture}
                >
                  <Text style={styles.textStyle}>Photo déjà existante</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
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
                  {/*<View>
      <Text style={{ color: 'white' }}>retour</Text>
    </View>*/}
                </View>
              </TouchableComponent>
              <View style={styles.bottomGroup}>
                <View>
                  <Text style={styles.name}>{place.name}</Text>
                </View>
                <StarRating color='white' />
                <View>
                  <Text style={styles.reviewCount}>69 reviews</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.submittedBy}>Ajouté par: </Text>
                  <TouchableComponent onPress={() => {
                    props.navigation.navigate('UserProfile', {
                      userId: place.addedBy.id
                    })
                  }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      Flavien Denree de Choix
    </Text>
                  </TouchableComponent>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.actionsRow}>
          <TouchableComponent>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <FontAwesome name='phone' size={22} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Appeler</Text>
              </View>
            </View>
          </TouchableComponent>
          <TouchableComponent>
            <View style={styles.actionGroup}>
              <View style={styles.actionButton}>
                <FontAwesome5 name='map-marker-alt' size={18} color={TourTourColors.accent} />
              </View>
              <View>
                <Text style={styles.actionTitle}>Carte</Text>
              </View>
            </View>
          </TouchableComponent>
          <TouchableComponent>
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
        </View>
        <FeaturedPhotosGroup place={place} />
        <View style={styles.reviewsHeaderRow}>

          <View>
            <Text style={styles.reviewsHeaderRowTitle}>Reviews</Text>
          </View>
          <View>
            <StarRating color={TourTourColors.accent} />
            <View>
              <Text style={{ textAlign: 'right', color: TourTourColors.accent, fontSize: 12 }}>
                69 Reviews
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.reviewsListContainer}>
          <ReviewsContainer place={place} navigation={props.navigation} />
        </View>
        <View style={styles.moreReviewsButtonContainer}>
          <Button title='Plus de reviews' color={TourTourColors.accent} />
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
    backgroundColor: 'rgba(0,0,0,.45)',
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
    marginLeft: 5
  },
  name: {
    color: 'white',
    fontSize: 14,
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
  }
});


export default PlaceDetailScreen;

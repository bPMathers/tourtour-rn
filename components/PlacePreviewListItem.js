import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import TimeAgo from 'react-native-timeago';
import { useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js';


import StarRating from './StarRating'


const PlacePreviewListItem = (props) => {
  const { place } = props
  const navigation = useNavigation()

  return (
    <View style={styles.placePreviewListItem}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => {
        navigation.navigate('PlaceDetail', {
          placeId: place.id
        })
      }}>
        <ImageBackground source={{ uri: place.imageUrl }} style={styles.image}>
          <View style={styles.overlayContentContainer}>
            <View style={styles.leftColumn}>
              <View style={styles.leftTopGroup}>
                <View style={styles.leftRow1}>
                  {props.loggedInUserId === props.place.addedBy.id &&
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {
                      navigation.navigate('UpdateMyPlace', {
                        place: place
                      })
                    }}>
                      <FontAwesome5
                        style={styles.starIcon}
                        name='pencil-alt'
                        size={20}
                        color='white'
                      />
                    </TouchableOpacity>}
                  <View>
                    <Text style={styles.name}>{place.name}</Text>
                  </View>
                </View>
                <View style={styles.leftRow2}>
                  <View>
                    <Text style={styles.location}>{place.formatted_address}</Text>
                  </View>
                </View>
                <View style={styles.leftRow3}>
                  <FontAwesome name='phone' size={14} color='white' style={{ marginRight: 5 }} />
                  <View>
                    <Text style={styles.phone}>{place.phone ? place.phone : i18n.t('UndefinedPhone')}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.leftBottomGroup}>
                <View>
                  <Text style={styles.submittedBy}>{i18n.t('addedBy')}: </Text>
                  <TouchableOpacity onPress={props.onSelectUserProfile}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      {place.addedBy.name}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TimeAgo time={place.createdAt} style={{ color: 'white', fontSize: 12 }} />
              </View>
            </View>
            <View style={styles.rightColumn}>
              <View>
                <View style={styles.rightRow1}>
                  <StarRating color='white' rating={place.avgRating} />
                </View>
                <View style={styles.rightRow2}>
                  <Text style={styles.reviewCount}>{place.review_count} {place.review_count === 1 ? "review" : "reviews"}</Text>
                </View>
              </View>
              <View>
                <View style={styles.rightRow3}>

                  <TouchableOpacity onPress={() => {
                    navigation.navigate('PlaceDetail', {
                      placeId: place.id
                    })
                  }}>
                    <Ionicons
                      style={styles.starIcon}
                      name='md-arrow-forward'
                      size={24}
                      color='white'
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  placePreviewListItem: {
    height: 200,
    width: '100%',
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
    // marginHorizontal: 10,
  },
  overlayContentContainer: {
    flexDirection: 'row',
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
  leftColumn: {
    height: '100%',
    width: '65%',
    justifyContent: 'space-between',
  },
  leftRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  leftRow2: {
    marginBottom: 5
  },
  leftRow3: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightColumn: {
    height: '100%',
    width: '35%',
    justifyContent: 'space-between',
  },
  rightRow1: {
    alignItems: 'flex-end'
  },
  rightRow2: {

    alignItems: 'flex-end'
  },
  rightRow3: {
    alignItems: 'flex-end'
  },
  phone: {
    color: 'white',
    fontSize: 12
  },
  name: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  starRating: {
    flexDirection: 'row',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  starIcon: {
    marginLeft: 2,
  },
  location: {
    width: '100%',
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
  arrowContainer: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlacePreviewListItem;

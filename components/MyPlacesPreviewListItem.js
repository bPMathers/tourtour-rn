import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import TimeAgo from 'react-native-timeago';
import { useNavigation } from '@react-navigation/native'

import StarRating from './StarRating'


const MyPlacesPreviewListItem = (props) => {
  const { place } = props
  const navigation = useNavigation()

  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
    <View style={styles.placePreviewListItem}>
      <ImageBackground source={{ uri: place.imageUrl }} style={styles.image}>
        <View style={styles.overlayContentContainer}>
          <View style={styles.leftColumn}>
            <View style={styles.leftTopGroup}>
              <View style={styles.leftRow1}>
                <View>
                  <Text style={styles.name}>{place.name}</Text>
                </View>
              </View>
              <View style={styles.leftRow2}>
                <View>
                  <Text style={styles.location}>{place.formatted_address}</Text>
                </View>
              </View>
            </View>
            <View style={styles.leftBottomGroup}>
              <View style={styles.leftRow3}>
                <Text style={styles.submittedBy}>Ajouté par: </Text>
                <TouchableComponent onPress={() => { }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {place.addedBy.name}
                  </Text>
                </TouchableComponent>
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
                <Text style={styles.reviewCount}>{place.review_count} reviews</Text>
              </View>
            </View>
            <View>
              <View style={styles.rightRow3}>
                {place.addedBy.id &&
                  <TouchableComponent onPress={() => {
                    navigation.navigate('UpdateMyPlace', {
                      place: place
                    })
                  }}>
                    <FontAwesome5
                      style={styles.starIcon}
                      name='pencil-alt'
                      size={24}
                      color='white'
                    />
                  </TouchableComponent>}
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
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
  leftRow2: {},
  leftRow3: {},
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

export default MyPlacesPreviewListItem;

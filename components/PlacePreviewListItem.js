import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlacePreviewListItem = (props) => {
  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
    <View style={styles.placePreviewListItem}>
      <TouchableComponent
        style={{ flex: 1 }}
        onPress={props.onSelectPlace}
      >
        <ImageBackground source={{ uri: props.imageUrl }} style={styles.image}>
          <View style={styles.overlayContentContainer}>
            <View style={styles.topRowGroup}>
              <View style={styles.topRow}>
                <View>
                  <Text style={styles.name}>{props.name}</Text>
                </View>
                <View style={styles.starRating}>
                  <Ionicons
                    style={styles.starIcon}
                    name='ios-star'
                    size={16}
                    color='white'
                  />
                  <Ionicons
                    style={styles.starIcon}
                    name='ios-star'
                    size={16}
                    color='white'
                  />
                  <Ionicons
                    style={styles.starIcon}
                    name='ios-star'
                    size={16}
                    color='white'
                  />
                  <Ionicons
                    style={styles.starIcon}
                    name='ios-star'
                    size={16}
                    color='white'
                  />
                  <Ionicons
                    style={styles.starIcon}
                    name='ios-star-half'
                    size={16}
                    color='white'
                  />
                </View>
              </View>
              <View style={styles.secondRow}>
                <View>
                  <Text style={styles.location}>Location</Text>
                </View>
                <View>
                  <Text style={styles.reviewCount}>30 reviews</Text>
                </View>
              </View>
            </View>
            <View style={styles.bottomRow}>
              <View>
                <Text style={styles.submittedBy}>Ajouté par: </Text>
                <TouchableComponent onPress={props.onSelectUserProfile}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Flavien Denre de Choix
                  </Text>
                </TouchableComponent>
              </View>
              <View>
                <TouchableComponent
                  onPress={props.onSelectPlace}
                >
                  <Ionicons
                    style={styles.starIcon}
                    name='md-arrow-forward'
                    size={24}
                    color='white'
                  />
                </TouchableComponent>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableComponent>
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
  topRowGroup: {},

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  secondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

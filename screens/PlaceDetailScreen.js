import React from 'react';
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
  ScrollView
} from 'react-native';
import { Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import { TourTourColors } from '../constants/Colors'
import FeaturedPhotosGroup from '../components/FeaturedPhotosGroup'
import ReviewCard from '../components/ReviewCard'
import StarRating from '../components/StarRating'
import { SafeAreaView } from 'react-native-safe-area-context';

const dummyReviewsList = [
  {
    id: "1",
    author: 'Flavien Denree de Choix',
    rating: '3.5',
    body: 'Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more'
  },
  {
    id: "2",
    author: 'Flavien Denree de Choix',
    rating: '3.5',
    body: 'Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more'
  },
  {
    id: "3",
    author: 'Flavien Denree de Choix',
    rating: '3.5',
    body: 'Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more'
  },
  {
    id: "4",
    author: 'Flavien Denree de Choix',
    rating: '3.5',
    body: 'Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more'
  },
]

const PlaceDetailScreen = (props) => {
  const place = props.route.params.place;

  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  const reviewListRender = (itemData) => {
    return (
      <ReviewCard author={itemData.item.author} body={itemData.item.body} />
    )
  }

  return (

    <ScrollView>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <View style={styles.placeDetailHeader}>
        <ImageBackground source={{ uri: place.mainPhoto }} style={styles.image}>
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
                <Text style={styles.reviewCount}>30 reviews</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.submittedBy}>Ajouté par: </Text>
                <TouchableComponent onPress={() => { props.navigation.setOptions({ title: 'Updated!' }) }}>
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
        <TouchableComponent>
          <View style={styles.actionGroup}>
            <View style={styles.actionButton}>
              <Ionicons name='ios-camera' size={27} color={TourTourColors.accent} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Photo</Text>
            </View>
          </View>
        </TouchableComponent>
      </View>
      <FeaturedPhotosGroup />
      <View style={styles.reviewsHeaderRow}>

        <View>
          <Text style={styles.reviewsHeaderRowTitle}>Reviews</Text>
        </View>
        <View>
          <StarRating color={TourTourColors.accent} />
          <View>
            <Text style={{ textAlign: 'right', color: TourTourColors.accent, fontSize: 12 }}>
              30 reviews
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.reviewsListContainer}>
        <ScrollView>
          <Text>'Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more''Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more''Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more''Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more''Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more''Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more''Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more''Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more''Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more''Bacon ipsum dolor amet meatball spare ribs salami, beef ball tip capicola chicken tail strip steak kielbasa shankle cupim ham hock pork chop filet mignon. Landjaeger short ribs pork kielbasa ribeye sirloin capicola hamburger strip steak corned beef shank brisket pork loin. Kielbasa pastrami ham strip steak sausage short loin leberkas andouille. T-bone swine jerky, spare ribs beef cow tri-tip leberka… read more'</Text>
        </ScrollView>
      </View>
    </ScrollView>


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
    marginHorizontal: 15

  },
  reviewsHeaderRowTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TourTourColors.accent,
  },
  reviewsListContainer: {
    flex: 1,
    backgroundColor: 'pink'
  }
});


export default PlaceDetailScreen;

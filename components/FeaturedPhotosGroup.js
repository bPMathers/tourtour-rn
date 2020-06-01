import React from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions } from 'react-native';

import { TourTourColors } from '../constants/Colors'
import FeaturedPhoto from './FeaturedPhoto';

const dummyPhotos = [
  {
    key: "1",
    imageUrl: 'https://www.neomedia.com/upload/7/evenements/2015/2/211562/ptit-st-do-pauline-jonquiere.jpg'
  },
  {
    key: "2",
    imageUrl: 'https://www.district132.ca/wp-content/uploads/2016/07/FullSizeRender-2-1024x768.jpg'
  },
  {
    key: "3",
    imageUrl: 'https://i.pinimg.com/originals/59/d4/35/59d435cbc55b2a70f4b86cad1b738d9b.jpg'
  },
  {
    key: "4",
    imageUrl: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
  {
    key: "5",
    imageUrl: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
  {
    key: "6",
    imageUrl: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
  {
    key: "7",
    imageUrl: 'https://www.neomedia.com/upload/7/evenements/2015/2/211562/ptit-st-do-pauline-jonquiere.jpg'
  },
  {
    key: "8",
    imageUrl: 'https://www.district132.ca/wp-content/uploads/2016/07/FullSizeRender-2-1024x768.jpg'
  },
  {
    key: "9",
    imageUrl: 'https://i.pinimg.com/originals/59/d4/35/59d435cbc55b2a70f4b86cad1b738d9b.jpg'
  },
  {
    key: "10",
    imageUrl: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
  {
    key: "11",
    imageUrl: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
  {
    key: "12",
    imageUrl: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
]

const FeaturedPhotosGroup = (props) => {


  const renderGridItem = (itemData) => {
    return (
      <FeaturedPhoto
        imgUrl={itemData.item.imageUrl}
        onSelect={() => {
          // console.log(itemData.item.id)
          // props.navigation.navigate('CategorySearch', {
          //   categoryId: itemData.item.id,
          //   categoryTitle: itemData.item.title
          // });
        }}
      />
    );
  };
  // const renderGridItem = (itemData) => {
  //   return (
  //     <View
  //       style={{
  //         padding: 16,
  //         backgroundColor: 'yellow',
  //         height: 100,
  //         width: Dimensions.get('screen').width / 3 - 20
  //       }}>
  //       <Text>{itemData.item.key}</Text>
  //     </View>
  //   );
  // };

  return (
    <View style={styles.container}>
      {/*<FlatList data={dummyPhotos} renderItem={renderGridItem} horizontal={true} ItemSeparatorComponent={() => <View style={{ margin: 4 }} />} />*/}
      <FlatList data={dummyPhotos} renderItem={renderGridItem} horizontal={true} ItemSeparatorComponent={() => <View style={{ margin: 1 }} />} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
})

export default FeaturedPhotosGroup;
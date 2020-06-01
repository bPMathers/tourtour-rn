import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';

import { TourTourColors } from '../constants/Colors'
import FeaturedPhoto from './FeaturedPhoto';

const dummyPhotos = [
  {
    id: 1,
    imageUrl: 'https://www.neomedia.com/upload/7/evenements/2015/2/211562/ptit-st-do-pauline-jonquiere.jpg'
  },
  {
    id: 2,
    imageUrl: 'https://www.district132.ca/wp-content/uploads/2016/07/FullSizeRender-2-1024x768.jpg'
  },
  {
    id: 3,
    imageUrl: 'https://i.pinimg.com/originals/59/d4/35/59d435cbc55b2a70f4b86cad1b738d9b.jpg'
  },
  {
    id: 4,
    imageUrl: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
  {
    id: 5,
    imageUrl: 'https://lh3.googleusercontent.com/proxy/RibgHxkyGYmPKAbPds3OfWHd6ayuPz6iaOOOIL1U3Jh1kAgFgVOEkyXLpCo3Ef7bPyyl3R3-du_sdlAIZ5CRMADXixqEY7B6j5kT2gx0gfZJLgMymLs'
  },
  {
    id: 6,
    imageUrl: 'https://lh3.googleusercontent.com/proxy/HsD2YB-jQ3Ub7nJfyvNojHRX2rx1pN5RO1qtK-DtetwKRyZlmXkh_vGqI35ct3AjDLlhx_tzMFwo0WMinU3C84NM_w405KyKmD52KizDrClS3nL7FjQ'
  },
  {
    id: 7,
    imageUrl: 'https://www.neomedia.com/upload/7/evenements/2015/2/211562/ptit-st-do-pauline-jonquiere.jpg'
  },
  {
    id: 8,
    imageUrl: 'https://www.district132.ca/wp-content/uploads/2016/07/FullSizeRender-2-1024x768.jpg'
  },
  {
    id: 9,
    imageUrl: 'https://i.pinimg.com/originals/59/d4/35/59d435cbc55b2a70f4b86cad1b738d9b.jpg'
  },
  {
    id: 10,
    imageUrl: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
  {
    id: 11,
    imageUrl: 'https://lh3.googleusercontent.com/proxy/RibgHxkyGYmPKAbPds3OfWHd6ayuPz6iaOOOIL1U3Jh1kAgFgVOEkyXLpCo3Ef7bPyyl3R3-du_sdlAIZ5CRMADXixqEY7B6j5kT2gx0gfZJLgMymLs'
  },
  {
    id: 12,
    imageUrl: 'https://lh3.googleusercontent.com/proxy/HsD2YB-jQ3Ub7nJfyvNojHRX2rx1pN5RO1qtK-DtetwKRyZlmXkh_vGqI35ct3AjDLlhx_tzMFwo0WMinU3C84NM_w405KyKmD52KizDrClS3nL7FjQ'
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

  return (
    <View style={styles.container}>
      <FlatList data={dummyPhotos} renderItem={renderGridItem} numColumns={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    // backgroundColor: TourTourColors.primary
  }
})

export default FeaturedPhotosGroup;
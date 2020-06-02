import React from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { TourTourColors } from '../constants/Colors'
import FeaturedPhoto from './FeaturedPhoto';

const dummyPhotos = [
  {
    key: "1",
    url: 'https://www.neomedia.com/upload/7/evenements/2015/2/211562/ptit-st-do-pauline-jonquiere.jpg'
  },
  {
    key: "2",
    url: 'https://www.district132.ca/wp-content/uploads/2016/07/FullSizeRender-2-1024x768.jpg'
  },
  {
    key: "3",
    url: 'https://i.pinimg.com/originals/59/d4/35/59d435cbc55b2a70f4b86cad1b738d9b.jpg'
  },
  {
    key: "4",
    url: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
  {
    key: "5",
    url: 'file:///Users/bpm19/Library/Developer/CoreSimulator/Devices/0D67DC1C-E2E0-4AE5-AEE0-2FA4FE3955FC/data/Containers/Data/Application/F0104546-51C1-47ED-A1C8-DE15405DD0EA/Library/Caches/ExponentExperienceData/%2540anonymous%252Ftourtour-rn-cfbebf97-3570-4d66-a840-daa77a8dead1/ImagePicker/BE8EDA30-0B51-4E5E-B2BB-513DE730B852.jpg'
  },
  {
    key: "6",
    url: 'file:///Users/bpm19/Library/Developer/CoreSimulator/Devices/0D67DC1C-E2E0-4AE5-AEE0-2FA4FE3955FC/data/Containers/Data/Application/F0104546-51C1-47ED-A1C8-DE15405DD0EA/Library/Caches/ExponentExperienceData/%2540anonymous%252Ftourtour-rn-cfbebf97-3570-4d66-a840-daa77a8dead1/ImagePicker/4CCD0C55-62C2-4275-A7F0-351688C37C9C.jpg'
  },
  {
    key: "7",
    url: 'https://www.neomedia.com/upload/7/evenements/2015/2/211562/ptit-st-do-pauline-jonquiere.jpg'
  },
  {
    key: "8",
    url: 'https://www.district132.ca/wp-content/uploads/2016/07/FullSizeRender-2-1024x768.jpg'
  },
  {
    key: "9",
    url: 'https://i.pinimg.com/originals/59/d4/35/59d435cbc55b2a70f4b86cad1b738d9b.jpg'
  },
  {
    key: "10",
    url: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
  {
    key: "11",
    url: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
  {
    key: "12",
    url: 'https://img.src.ca/2016/03/20/1250x703/160320_a86l5_pauline3_sn1250.jpg'
  },
]

const FeaturedPhotosGroup = (props) => {
  const GET_PHOTOS = gql`
    query($placeId: String) {
      photos(query: $placeId) {
        id
        url
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_PHOTOS, {
    variables: {
      placeId: props.place.id,
    },
  });

  const renderGridItem = (itemData) => {
    return (
      <FeaturedPhoto
        imgUrl={itemData.item.url}
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
  if (loading)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.container}>
        <Text>Error...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList data={data.photos.reverse()} renderItem={renderGridItem} horizontal={true} ItemSeparatorComponent={() => <View style={{ margin: 1 }} />} />
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
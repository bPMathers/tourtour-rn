import React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import { TourTourColors } from '../constants/Colors'

const getPlaces = gql`
  query {
    places{
      id 
      name
    }
  }
`

const CategorySearchScreen = (props) => {
    const { loading, error, data } = useQuery(getPlaces);

    const renderGridItem = (itemData) => {
        return (
            <View style={styles.listItem}>
                <Text>{itemData.item.name}</Text>
                <Button title="PlaceDetailScreen" onPress={() => { props.navigation.navigate('PlaceDetail') }} />
            </View>
        );
    };

    if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;
    if (error) return <View style={styles.container}><Text>Error...</Text></View>;

    return (
        <View style={styles.container}>
            <View>
                <Text>Places à poutine près de Montreal</Text>
            </View>
            <View>
                <Button title="Changer de location" color={TourTourColors.primary}></Button>
            </View>
            <FlatList data={data.places} renderItem={renderGridItem} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listItem: {
        flex: 1,
        margin: 2,
        height: 150,
        borderRadius: 5,
        elevation: 5,
        overflow: Platform.OS === "android" ? "hidden" : "hidden",
    },
})

export default CategorySearchScreen;
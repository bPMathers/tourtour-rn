import React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import { TourTourColors } from '../constants/Colors'

import PlacePreviewListItem from '../components/PlacePreviewListItem'

// How can I dynamically set the query parameter?
const getPlaces = gql`
  query($catId: String) {
    places(query: $catId) {
        id
        name
        mainPhoto
        category {
            id
        }
  }
}
`

const CategorySearchScreen = (props) => {
    const { loading, error, data } = useQuery(getPlaces, {
        variables: {
            catId: props.route.params.categoryId
        },
    });

    const renderGridItem = (itemData) => {
        return (
            <PlacePreviewListItem name={itemData.item.name} imageUrl={itemData.item.mainPhoto} />
        );
    };

    if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;
    if (error) return <View style={styles.container}><Text>Error...</Text></View>;

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Text>Places à poutine près de <Text style={{ fontWeight: 'bold' }}>Montreal, QC</Text></Text>
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
        flex: 1,
        margin: 10
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
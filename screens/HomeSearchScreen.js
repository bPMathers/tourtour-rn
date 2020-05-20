import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from "@expo/vector-icons";

import { CATEGORIES } from "../data/dummy-data";
import CategoryGridTile from "../components/CategoryGridTile";

export const HomeSearchScreen = (props) => {
    const [searchInput, setSearchInput] = React.useState();

    const renderGridItem = (itemData) => {
        return (
            <CategoryGridTile
                title={itemData.item.title}
                color={itemData.item.color}
                imgUrl={itemData.item.imageUrl}
                onSelect={() => {
                    // props.navigation.navigate("CategoryMeals", {
                    //     categoryId: itemData.item.id,
                    // });
                }
                }
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text}>TourTour - Nice image ou animation</Text>
            </View>
            <View style={styles.searchSection}>
                <Ionicons style={styles.searchIcon} name='ios-search' size={25} color='black' />
                <TextInput
                    style={styles.searchInput}
                    onChangeText={text => setSearchInput(text)}
                    value={searchInput}
                    placeholder='Rechercher'
                />
            </View>
            <FlatList data={CATEGORIES} renderItem={renderGridItem} numColumns={2} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: 'white'
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    text: {
        color: '#2699FB',
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'center'
    },
    header: {
        height: 200,
        backgroundColor: 'white',
        justifyContent: 'center',
        marginTop: 50
    },
    searchInput: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
    searchSection: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    searchIcon: {
        padding: 10,
    },
})

export default HomeSearchScreen;

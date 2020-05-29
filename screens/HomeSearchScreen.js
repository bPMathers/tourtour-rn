import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import LottieView from "lottie-react-native";
import ApolloClient, { gql } from 'apollo-boost';

import { useQuery } from '@apollo/react-hooks';
import { Ionicons } from "@expo/vector-icons";

import { CATEGORIES } from "../data/dummy-data";
import CategoryGridTile from "../components/CategoryGridTile";
import Animation from '../components/Animation'

import UserList from '../components/UserList'

const getUsers = gql`
  query {
    users{
      id 
      name
      
    }
  }
`

export const HomeSearchScreen = (props) => {
    const { loading, error, data } = useQuery(getUsers);
    const [searchInput, setSearchInput] = React.useState();
    // console.log(JSON.stringify(data.users, undefined, 2))
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

    if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;
    if (error) return <View style={styles.container}><Text>Error...</Text></View>;

    return (
        <View style={styles.container}>
            {/* <View style={styles.titleContainer}>
                <Text style={styles.title}>Bienvenue dans TourTour</Text>
            </View>*/}

            <View style={styles.animationContainer}>
                <Animation />
            </View>
            <View style={styles.userList}>
                <UserList style={{ flex: 1 }} users={data.users} />
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
    titleContainer: {
        marginTop: 60,
        paddingLeft: 10,
    },
    title: {
        color: '#EA027C',
        fontWeight: "bold"

    },
    animationContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingBottom: 30,
        backgroundColor: '#a3d6ff',
        // marginTop: 30
        // width: 20
        // flex: 1,
    },
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
        // marginTop: 50
    },
    searchIcon: {
        padding: 10,
    },
    userList: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default HomeSearchScreen;

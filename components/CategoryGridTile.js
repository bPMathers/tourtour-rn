import React from "react";
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Platform,
    ImageBackground
} from "react-native";
import i18n from 'i18n-js';


const CategoryGridTile = (props) => {

    return (
        <View style={styles.gridItem}>
            <TouchableOpacity style={{ flex: 1 }} onPress={props.onSelect}>
                <ImageBackground source={{ uri: props.imgUrl }} style={styles.image}>
                    <View style={styles.container}>
                        <Text style={styles.title} numberOfLines={2}>
                            {i18n.t(props.title)}
                        </Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    gridItem: {
        flex: 1,
        margin: 2,
        height: 150,
        borderRadius: 5,
        elevation: 5,
        overflow: Platform.OS === "android" ? "hidden" : "hidden",
    },
    container: {
        flex: 1,
        borderRadius: 5,
        // shadowColor: "black",
        // shadowOpacity: 0.26,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 10,
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,.4)'
    },
    title: {
        // fontFamily: "open-sans-bold",
        fontSize: 16,
        textAlign: "center",
        color: 'white',
        fontWeight: 'bold'
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },

});

export default CategoryGridTile;

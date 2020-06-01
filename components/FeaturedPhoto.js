import React from "react";
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableNativeFeedback,
    ImageBackground
} from "react-native";

const FeaturedPhoto = (props) => {
    let TouchableComponent = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
        TouchableComponent = TouchableNativeFeedback;
    }

    return (
        <View style={styles.gridItem}>
            <TouchableComponent style={{ flex: 1 }} onPress={props.onSelect}>
                <ImageBackground source={{ uri: props.imgUrl }} style={styles.image}>

                </ImageBackground>
            </TouchableComponent>
        </View>
    );
};

const styles = StyleSheet.create({
    gridItem: {
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'white',
        height: 120,
        margin: 2,
        borderRadius: 5,
        // elevation: 5,
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

export default FeaturedPhoto;

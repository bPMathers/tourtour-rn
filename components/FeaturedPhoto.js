import React from "react";
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Platform,
    ImageBackground,
    Dimensions
} from "react-native";

const FeaturedPhoto = (props) => {

    return (
        <View style={styles.gridItem}>
            <TouchableOpacity style={{ flex: 1 }} onPress={props.onSelect}>
                <ImageBackground source={{ uri: props.imgUrl }} style={styles.image}>

                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    gridItem: {
        // flex: 1,
        // // borderWidth: 1,
        // // borderColor: 'white',
        // height: 120,
        // margin: 2,
        // borderRadius: 5,
        // // elevation: 5,
        // overflow: Platform.OS === "android" ? "hidden" : "hidden",

        backgroundColor: 'white',
        height: 150,
        width: Dimensions.get('screen').width / 2 - 15
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },

});

export default FeaturedPhoto;

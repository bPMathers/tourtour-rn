import React from "react";
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableNativeFeedback,
    ImageBackground,
    Dimensions
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

import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import LottieView from "lottie-react-native";

// Source : https://lottiefiles.com/22203-japan-scene#

export default class Animation extends React.Component {
    componentDidMount() {
        this.animation.play();
        // Or set a specific startFrame and endFrame with:
        // this.animation.play(30, 120);
    }

    resetAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };

    render() {
        return (
            // <View style={styles.animationContainer}>
            <LottieView
                ref={animation => {
                    this.animation = animation;
                }}
                style={{
                    width: 110,
                    height: 110,
                    // backgroundColor: '#fff',
                }}
                source={require('../assets/animations/japan-scene.json')}
            // OR find more Lottie files @ https://lottiefiles.com/featured
            // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
            />

            // </View>
        );
    }
}

const styles = StyleSheet.create({
    animationContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        // flex: 1,
    },
    buttonContainer: {
        paddingTop: 20,
    },
});

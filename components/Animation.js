import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import LottieView from "lottie-react-native";

import { TourTourColors } from '../constants/Colors'

export default class Animation extends React.Component {
    componentDidMount() {
        this.animation.play();
    }

    resetAnimation = () => {
        this.animation.reset();
        this.animation.play();
    };

    render() {
        return (
            <LottieView
                ref={animation => {
                    this.animation = animation;
                }}
                style={{
                    width: this.props.width ?? 110,
                    height: this.props.height ?? 110,
                    backgroundColor: TourTourColors.accent

                }}
                source={require('../assets/animations/japan-scene.json')}
            />
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

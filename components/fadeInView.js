import React, { useState, useEffect } from 'react';
import { Animated, Text, View, Dimensions } from 'react-native';

const FadeInView = props => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: props.fadeInDuration ?? 1000,
    }).start();
  }, []);


  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [props.yTranslate ?? 0, 0],
            })
          },

          // { rotateY: fadeAnim },
        ]

      }}>
      {props.children}
    </Animated.View>
  );
};

export default FadeInView
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { TourTourColors } from '../constants/Colors'

const CustomButton = (props) => {

  const styles = StyleSheet.create({
    customButton: {
      marginVertical: 10,
      paddingVertical: 10,
      backgroundColor: props.color ?? TourTourColors.accent,
      borderRadius: 20,
      // width: Dimensions.get("screen").width / 2
      width: props.width ?? '100%',
      shadowColor: '#000',
      shadowOffset: { height: 5, width: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      alignItems: 'center',
      justifyContent: 'center'
    },
    customButtonText: {
      color: '#fff',
      textAlign: 'center',
      paddingHorizontal: 15,
      fontWeight: 'bold'
    },
  })

  return (
    <TouchableOpacity style={styles.customButton} color={TourTourColors.accent} onPress={props.onPress}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.customButtonText}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}
export default CustomButton;
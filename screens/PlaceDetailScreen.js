import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceDetailScreen = () => {
    return (
        <View style={styles.container}>
            <Text>PlaceDetailScreen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default PlaceDetailScreen;
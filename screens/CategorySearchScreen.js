import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import { TourTourColors } from '../constants/Colors'


const CategorySearchScreen = (props) => {
    const location = "Montréal"

    return (
        <View style={styles.container}>
            <View>
                <Text>Places à poutine près de Montreal</Text>
            </View>
            <View>
                <Button title="Changer de location" color={TourTourColors.primary}></Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default CategorySearchScreen;
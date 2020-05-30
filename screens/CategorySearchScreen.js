import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CategorySearchScreen = (props) => {
    return (
        <View style={styles.container}>
            <Text>CategorySearchScreen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default CategorySearchScreen;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserList = ({ users }) => {
    return (
        users.map((user, index) => {
            return <View key={index} style={styles.container}><Text>{user.name}</Text></View>
        })
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default UserList;
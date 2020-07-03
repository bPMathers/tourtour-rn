import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons, SimpleLineIcons, AntDesign, Feather } from '@expo/vector-icons';
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks';
import i18n from 'i18n-js'

import { TourTourColors } from '../constants/Colors'


const UserProfileScreen = (props) => {
    const GET_USER = gql`
    query($userId: String) {
      user(query: $userId) {
        id
        name
        imageUrl
        status
        places {
            id
        }
        reviews {
            id
            rating
            body
            author {
                id
                name
                imageUrl
            }
            place {
                id
                name 
            }
            createdAt
            updatedAt
        }
        photos {
            id
            url 
            addedBy {
                id
                name
            }
            createdAt
        }
        createdAt
        updatedAt
      }
    }
  `;

    const { loading, error, data } = useQuery(GET_USER, {
        variables: {
            userId: props.route.params.userId,
        },
    });
    // console.log(data.user.name)

    if (loading)
        return (
            <View style={styles.metaStateContainer}>
                <ActivityIndicator size="large" color={TourTourColors.accent} />
            </View>
        );
    if (error)
        return (
            <View style={styles.metaStateContainer}>
                <Text>Error...</Text>
            </View>
        );

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.userProfileHeader}>
                    <View>
                        <Image style={styles.userImg} source={{ uri: data.user.imageUrl }} />
                    </View>
                </View>
                <View style={styles.userNameContainer}>
                    <Text style={styles.userName}>
                        {data.user.name}
                    </Text>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Text>
                        Montréal, QC
                </Text>
                </View>
                <View style={styles.userStatusContainer}>
                    <Text style={styles.userStatus}>{data.user.status}</Text>
                </View>
                <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            `${i18n.t('Warning')}!`,
                            i18n.t('MessageWarning'),
                            [
                                { text: 'Ok' },
                            ]
                        )
                    }}>
                        <View style={styles.actionGroup}>
                            <View style={styles.actionButton}>
                                <AntDesign name='message1' size={18} color={TourTourColors.accent} />
                            </View>
                            <View>
                                <Text style={styles.actionTitle}>Message</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            `${i18n.t('Warning')}!`,
                            i18n.t('FollowWarning'),
                            [
                                { text: 'Ok' },
                            ]
                        )
                    }}>
                        <View style={styles.actionGroup}>
                            <View style={styles.actionButton}>
                                <SimpleLineIcons name='user-follow' size={20} color={TourTourColors.accent} />
                            </View>
                            <View>
                                <Text style={styles.actionTitle}>{i18n.t('Follow')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowsContainer}>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            `${i18n.t('Warning')}!`,
                            i18n.t('RecentActivityWarning'),
                            [
                                { text: 'Ok' },
                            ]
                        )
                    }}>
                        <View style={styles.row}>
                            <View style={styles.rowLeftGroup}>
                                <View style={styles.rowIconBox}>
                                    <Feather name='activity' size={24} color='#333' />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>{i18n.t('RecentActivity')}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 12, color: '#333', fontWeight: 'bold' }}></Text>
                                </View>
                            </View>
                            <View style={styles.forwardArrow}>
                                <Ionicons name='ios-arrow-forward' size={20} color='#333' />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('UserPlaces', {
                            userId: data.user.id
                        })
                    }}>
                        <View style={styles.row}>
                            <View style={styles.rowLeftGroup}>
                                <View style={styles.rowIconBox}>
                                    <Ionicons name='ios-images' size={26} color='#333' />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Places</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 12, color: '#333', fontWeight: 'bold' }}> ({data.user.places.length})</Text>
                                </View>
                            </View>
                            <View style={styles.forwardArrow}>
                                <Ionicons name='ios-arrow-forward' size={20} color='#333' />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('UserReviews', { reviews: data.user.reviews })
                    }}>
                        <View style={styles.row}>
                            <View style={styles.rowLeftGroup}>
                                <View style={styles.rowIconBox}>
                                    <MaterialCommunityIcons name='star-box' size={28} color='#333' />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Reviews</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 12, color: '#333', fontWeight: 'bold' }}> ({data.user.reviews.length})</Text>
                                </View>
                            </View>
                            <View style={styles.forwardArrow}>
                                <Ionicons name='ios-arrow-forward' size={20} color='#333' />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('UserPhotos', {
                            photos: data.user.photos
                        })
                    }}>
                        <View style={{ ...styles.row, ...styles.lastRow }}>
                            <View style={styles.rowLeftGroup}>
                                <View style={styles.rowIconBox}>
                                    <Ionicons name='ios-camera' size={28} color='#333' />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Photos</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 12, color: '#333', fontWeight: 'bold' }}> ({data.user.photos.length})</Text>
                                </View>
                            </View>
                            <View style={styles.forwardArrow}>
                                <Ionicons name='ios-arrow-forward' size={20} color='#333' />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 30
    },
    metaStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userImg: {
        height: 144,
        width: 144,
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 72,
        borderColor: TourTourColors.accent,
        borderWidth: 2,
        backgroundColor: TourTourColors.primary
    },
    userNameContainer: {
        marginBottom: 3
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    userStatusContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%'
    },
    userStatus: {
        textAlign: 'center'
    },
    actionsRow: {
        width: '70%',
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    actionGroup: {
        alignItems: 'center',
    },
    actionButton: {
        width: 40,
        height: 40,
        backgroundColor: TourTourColors.primary,
        borderRadius: 25,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: "center"
    },
    actionTitle: {
        color: TourTourColors.accent,
        fontWeight: 'bold',
        fontSize: 12
    },
    rowsContainer: {
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#999',
        maxHeight: 50,
        minHeight: 50
    },
    lastRow: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#999',
    },
    rowLeftGroup: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rowIconBox: {
        alignItems: 'center',
        width: 30,
        marginRight: 10
    },
    forwardArrow: {
        marginRight: 5
    }
})

export default UserProfileScreen;
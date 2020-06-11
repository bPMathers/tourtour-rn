import React from 'react';
import { View, Text, StyleSheet, Image, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome, FontAwesome5, MaterialCommunityIcons, SimpleLineIcons, AntDesign, Feather } from '@expo/vector-icons';
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks';

import { GET_TOKEN_AND_USER_ID } from '../graphql/queries'

import { TourTourColors } from '../constants/Colors'


const UserEditScreen = (props) => {

  const GET_USER = gql`
    query($userId: String) {
      user(query: $userId) {
        id
        name
        imageUrl
        reviews {
            id
        }
        photos {
            id
        }
      }
    }
  `;

  const { data: tokenAndIdData, client: unusedClient } = useQuery(GET_TOKEN_AND_USER_ID);
  const jwtBearer = "".concat("Bearer ", tokenAndIdData?.token).replace(/\"/g, "")
  const loggedInUserId = tokenAndIdData?.userId
  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userId: loggedInUserId,
    },
  });


  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  if (loading)
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View style={styles.container}>
        <Text>Error...</Text>
      </View>
    );

  return (
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
      <View style={styles.userCity}>
        <Text>
          Montréal, QC
                </Text>
      </View>
      <View style={styles.actionsRow}>

        <TouchableComponent>
          <View style={styles.actionGroup}>
            <View style={styles.actionButton}>
              <FontAwesome5 name='pencil-alt' size={20} color={TourTourColors.accent} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Modifier</Text>
            </View>
          </View>
        </TouchableComponent>
      </View>
      <View style={styles.rowsContainer}>
        <TouchableComponent>
          <View style={styles.row}>
            <View style={styles.rowLeftGroup}>
              <View style={styles.rowIconBox}>
                <Feather name='activity' size={24} color='#333' />
              </View>
              <View>
                <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Activité récente</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12, color: '#333', fontWeight: 'bold' }}></Text>
              </View>
            </View>
            <View style={styles.forwardArrow}>
              <Ionicons name='ios-arrow-forward' size={20} color='#333' />
            </View>
          </View>
        </TouchableComponent>
        <TouchableComponent onPress={() => { props.navigation.navigate('MyReviews', { userToken: jwtBearer }) }}>
          <View style={styles.row}>
            <View style={styles.rowLeftGroup}>
              <View style={styles.rowIconBox}>
                <MaterialCommunityIcons name='star-box' size={28} color='#333' />
              </View>
              <View>
                <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Mes reviews</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12, color: '#333', fontWeight: 'bold' }}> (21)</Text>
              </View>
            </View>
            <View style={styles.forwardArrow}>
              <Ionicons name='ios-arrow-forward' size={20} color='#333' />
            </View>
          </View>
        </TouchableComponent>
        <TouchableComponent>
          <View style={{ ...styles.row, ...styles.lastRow }}>
            <View style={styles.rowLeftGroup}>
              <View style={styles.rowIconBox}>
                <Ionicons name='ios-camera' size={28} color='#333' />
              </View>
              <View>
                <Text style={{ fontSize: 16, color: '#333', fontWeight: 'bold' }}>Mes photos</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12, color: '#333', fontWeight: 'bold' }}> (69)</Text>
              </View>
            </View>
            <View style={styles.forwardArrow}>
              <Ionicons name='ios-arrow-forward' size={20} color='#333' />
            </View>
          </View>
        </TouchableComponent>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
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

export default UserEditScreen;
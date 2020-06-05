import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, StatusBar, TouchableOpacity, TouchableHighlight, Dimensions, Modal } from 'react-native';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { FontAwesome5, AntDesign } from '@expo/vector-icons'

import { TourTourColors } from '../constants/Colors';

import PlacePreviewListItem from '../components/PlacePreviewListItem';

const GET_PLACES = gql`
  query($catId: String) {
    places(query: $catId) {
      id
      name
      imageUrl
      formatted_address
      addedBy {
        id
        name
      }
      review_count
      category {
        id
      }
      photos{
        id
      }
    }
  }
`;

const CategorySearchScreen = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { loading, error, data } = useQuery(GET_PLACES, {
    variables: {
      catId: props.route.params.categoryId,
    },
  });

  props.navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity style={{ marginRight: 15 }} onPress={() => {

        props.navigation.navigate('AddPlace', {
          catId: props.route.params.categoryId
        })
      }}>
        <AntDesign name='plus' size={24} color='white' />
      </TouchableOpacity>
    ),
  });

  const renderGridItem = (itemData) => {
    return (
      <PlacePreviewListItem
        name={itemData.item.name}
        imageUrl={itemData.item.imageUrl}
        formatted_address={itemData.item.formatted_address}
        addedBy={itemData.item.addedBy.name}
        onSelectUserProfile={() => {
          props.navigation.navigate('UserProfile', {
            userId: itemData.item.addedBy.id,
            userName: itemData.item.addedBy.name
          });
        }}
        onSelectPlace={() => {
          props.navigation.navigate('PlaceDetail', {
            place: itemData.item,
          });
        }}
      />
    );
  };

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
      <View style={styles.modalContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>On va pouvoir rajouter une place avec un formulaire ici</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "red", marginRight: 4 }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Annuler</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Sauvegarder</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={{ marginBottom: 100 }}>
        <StatusBar barStyle="light-content" />
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>{props.route.params.categoryTitle} </Text>
          <Text>
            près de{' '}
            <Text style={{ fontWeight: 'bold' }}>Montreal, QC</Text>
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.locationButton} color={TourTourColors.accent}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.locationButtonText}>Changer de Location</Text>
              <FontAwesome5 name='map-marker-alt' size={18} color='white' />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList data={data.places} renderItem={renderGridItem} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  modalContainer: {

  },
  listItem: {
    flex: 1,
    margin: 2,
    height: 150,
    borderRadius: 5,
    elevation: 5,
    overflow: Platform.OS === 'android' ? 'hidden' : 'hidden',
  },
  locationButton: {
    marginVertical: 10,
    paddingVertical: 5,
    backgroundColor: TourTourColors.accent,
    borderRadius: 10,
    width: Dimensions.get("screen").width / 2
  },
  locationButtonText: {
    color: '#fff',
    // textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,

  },
  centeredView: {
    // flex: 1,
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default CategorySearchScreen;

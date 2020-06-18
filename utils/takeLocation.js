// // This util is unused for now

// import * as Location from 'expo-location';
// import * as Linking from 'expo-linking';
// import { Alert } from 'react-native';

// export const takeLocation = async (client) => {
//   try {
//     let { status } = await Location.requestPermissionsAsync();
//     if (status !== 'granted') {
//       setErrorMsg('Permission to access location was denied');
//     }

//     let location = await Location.getCurrentPositionAsync({});
//     let revGeocode = await Location.reverseGeocodeAsync({
//       latitude: location.coords.latitude,
//       longitude: location.coords.longitude,
//     });
//     console.log(`location: ${JSON.stringify(location, undefined, 2)}`)
//     client.writeData({
//       data: {
//         myLat: location.coords.latitude,
//         myLng: location.coords.longitude,
//         searchLocCity: `${revGeocode[0].city}, ${revGeocode[0].region}`,
//         searchLocLat: location.coords.latitude,
//         searchLocLng: location.coords.longitude,
//       }
//     })
//   } catch {
//     Alert.alert(
//       'Attention!',
//       "L'application ne fonctionnera pas si vous ne l'autorisez pas à prendre votre location. Changez vos réglages ou quittez l'application",
//       [{ text: 'Changer mes réglages', onPress: () => { Linking.openURL('app-settings:') } }]
//     );
//   }
// }
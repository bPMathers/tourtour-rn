import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import i18n from 'i18n-js'

const verifyCameraRollPermissions = async () => {
  const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (result.status !== 'granted') {
    Alert.alert(
      `${i18n.t('InsufficientPermissions')}!`,
      i18n.t('CameraPermissionsAlert'),
      [{ text: 'Okay' }]
    );
    return false;
  }
  return true;
};

const verifyCameraPermissions = async () => {
  const result = await Permissions.askAsync(Permissions.CAMERA);
  if (result.status !== 'granted') {
    Alert.alert(
      `${i18n.t('InsufficientPermissions')}!`,
      i18n.t('CameraPermissionsAlert'),
      [{ text: 'Okay' }]
    );
    return false;
  }
  return true;
};

// Eventually add arguments for options like aspect, quality, size, etc
export const takeExistingImage = async () => {
  const hasPermission = await verifyCameraRollPermissions();
  if (!hasPermission) {
    return;
  }
  const image = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
    base64: true
  });

  if (image.cancelled) {
    return
  }

  return image

  // setImgUrl(image.uri)
  // props.onImageTaken(image);
  // setModalVisible(false)
};

// Eventually add arguments for options like aspect, quality, size, etc
export const takeNewImage = async () => {
  const hasPermission = await verifyCameraPermissions();
  if (!hasPermission) {
    return;
  }
  const image = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
    base64: true
  });

  // const base64Img = `data:image/jpg;base64,${image.base64}`

  if (image.cancelled) {
    return
  }

  return image
};


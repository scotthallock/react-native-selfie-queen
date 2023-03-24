import { View, Pressable, Text, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { API_UPLOADS_PATH } from './constants';
import styles from './styles';

const status = {
  permissionPending: 'pending',
  permissionGranted: 'granted',
  permissionDenied: 'denied',
  ready: 'ready',
};

export default function TakeSelfieScreen({ navigation }) {
  const cameraRef = useRef();
  const [cameraStatus, setCameraStatus] = useState(status.permissionPending);
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermissionsAsync();
      if (permission.granted) {
        setCameraStatus(status.permissionGranted);
      } else {
        setCameraStatus(status.permissionDenied);
      }
    })();
  }, []);

  if (cameraStatus === status.permissionPending) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.message}>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (cameraStatus === status.permissionDenied) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.message}>
          Permission for camera not granted. Please change this in settings.
        </Text>
      </View>
    );
  }

  const onCameraReady = () => {
    setCameraStatus(status.ready);
  };

  const takePhoto = async () => {
    if (cameraStatus !== status.ready) {
      return console.log('Camera is not ready yet.');
    }
    const newPhoto = await cameraRef.current.takePictureAsync({
      width: 640,
      height: 480,
      quality: 1,
      base64: true,
      exif: false,
    });
    // iOS doesn't include "data:image/png;base64," but the web browser does.
    if (!/^data:image\/(jpg|png);base64,/.test(newPhoto.base64)) {
      newPhoto.base64 = 'data:image/png;base64,' + newPhoto.base64;
    }
    setPhoto(newPhoto);
  };

  const postPhoto = () => {
    const base64Data = photo.base64.replace(
      /^data:image\/(jpg|png);base64,/,
      ''
    );

    fetch(API_UPLOADS_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selfie: base64Data,
        emoji: '📱',
      }),
    })
      .catch(console.error)
      .then(() => {
        setPhoto(undefined);
        navigation.navigate('View');
      });
  };

  if (photo) {
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.containedImage} source={{ uri: photo.base64 }} />
        <View style={styles.cameraButtonContainer}>
          <View style={styles.cameraButtonWrapper}>
            <Pressable
              style={({ pressed }) => [
                { backgroundColor: pressed ? '#a467e4' : '#581b98' },
                { ...styles.button, flex: 0.4, opacity: 0.7 },
              ]}
              onPress={() => setPhoto(undefined)}>
              <Text style={styles.buttonText}>Discard</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                { backgroundColor: pressed ? '#a467e4' : '#581b98' },
                { ...styles.button, flex: 0.4, opacity: 0.7 },
              ]}
              onPress={postPhoto}>
              <Text style={styles.buttonText}>Post</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.imageContainer}>
      <Camera
        ref={cameraRef}
        type={CameraType.front}
        onCameraReady={onCameraReady}
        style={styles.containedImage}
      />
      <View style={styles.cameraButtonContainer}>
        <View style={styles.cameraButtonWrapper}>
          <Pressable
            style={({ pressed }) => [
              { backgroundColor: pressed ? '#a467e4' : '#581b98' },
              { ...styles.button, opacity: 0.7 },
            ]}
            onPressOut={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

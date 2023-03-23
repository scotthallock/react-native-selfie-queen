import { View, Pressable, Text, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { API_UPLOADS_PATH } from './constants';
import styles from './styles';

export default function TakeSelfieScreen({ navigation }) {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.message}>Requesting camera permissions...</Text>
      </View>
    );
  } else if (!hasCameraPermission) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.message}>
          Permission for camera not granted. Please change this in settings.
        </Text>
      </View>
    );
  }

  const takePhoto = async () => {
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
              style={{ ...styles.button, flex: 0.4, opacity: 0.7 }}
              onPressOut={() => setPhoto(undefined)}>
              <Text style={styles.buttonText}>Discard</Text>
            </Pressable>
            <Pressable
              style={{ ...styles.button, flex: 0.4, opacity: 0.7 }}
              onPressOut={postPhoto}>
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
        style={styles.containedImage}
      />
      <View style={styles.cameraButtonContainer}>
        <View style={styles.cameraButtonWrapper}>
          <Pressable
            style={{ ...styles.button, opacity: 0.7 }}
            onPressOut={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

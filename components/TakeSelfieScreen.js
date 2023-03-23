import { View, Pressable, Text, ImageBackground } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import { API_UPLOADS_PATH } from "./constants.js";
import styles from "./styles.js";

export default function TakeSelfieScreen({ navigation }) {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  const takePhoto = async () => {
    const newPhoto = await cameraRef.current.takePictureAsync({
      width: 640,
      height: 480,
      quality: 1,
      base64: true,
      exif: false,
      skipProcessing: true,
    });

    // iOS doesn't include "data:image/png;base64," but the web browser does.
    if (!/^data:image\/(jpg|png);base64,/.test(newPhoto.base64)) {
      newPhoto.base64 = "data:image/png;base64," + newPhoto.base64;
    }

    setPhoto(newPhoto);
  };

  const postPhoto = () => {
    const base64Data = photo.base64.replace(/^data:image\/(jpg|png);base64,/, "");
    fetch(API_UPLOADS_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selfie: base64Data,
        emoji: "📱",
      }),
    })
      .catch(console.error)
      .then(() => {
        setPhoto(undefined);
        navigation.navigate("View");
      });
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.preview} source={{ uri: photo.base64 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-end"
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                style={{ ...styles.button, flex: 0.4 }}
                onPressOut={() => setPhoto(undefined)}
              >
                <Text style={styles.buttonText}>Discard</Text>
              </Pressable>
              <Pressable
                style={{ ...styles.button, flex: 0.4 }}
                onPressOut={postPhoto}
              >
                <Text style={styles.buttonText}>Post</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <Camera
      ref={cameraRef}
      type={CameraType.front}
      style={{ ...styles.container, flexDirection: "column" }}
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Pressable style={styles.button} onPressOut={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </Pressable>
      </View>
    </Camera>
  );
}

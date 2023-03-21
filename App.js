import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  SafeAreaView,
  Text,
  Button,
  Image,
  SliderBase,
} from "react-native";

// https://reactnative.dev/docs/navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

// CANNOT import path from "path";
// It will result in this error when opening the app on a web browser:
// Uncaught ReferenceError: process is not defined
//    at ./node_modules/path/path.js (path.js:25:1)
//    ...
// See more about this issue:
// https://github.com/facebook/create-react-app/issues/12212
// There are a few solutions which require extra dependencies.
// For simplicity, we elect to concatenate strings instead.

const UPLOADS_PATH = "https://scotthallock-c0d3.onrender.com/selfie-queen/uploads/";
const API_UPLOADS_PATH = "https://scotthallock-c0d3.onrender.com/selfie-queen/api/uploads/";

// const UPLOADS_PATH = "http://localhost:8123/selfie-queen/uploads/";
// const API_UPLOADS_PATH = "http://localhost:8123/selfie-queen/api/uploads/";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Welcome to Selfie Queen" }}
        />
        <Stack.Screen
          name="Post"
          component={TakeSelfieScreen}
          options={{ title: "Take a Selfie" }}
        />
        <Stack.Screen
          name="View"
          component={ViewSelfiesScreen}
          options={{ title: "View Selfies" }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: "About" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <>
      <Text>This is the home screen</Text>
      <Button
        title="Take a Selfie"
        onPress={() => {
          navigation.navigate("Post");
        }}
      />
      <Button
        title="View Selfies"
        onPress={() => {
          navigation.navigate("View");
        }}
      />
      <Button
        title="About"
        onPress={() => {
          navigation.navigate("About");
        }}
      />
    </>
  );
}

function TakeSelfieScreen({ navigation }) {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
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
    });

    // iOS doesn't include "data:image/jpg;base64," but the web browser does.
    if (!newPhoto.base64.startsWith("data:image/jpg;base64,") && !newPhoto.base64.startsWith("data:image/png;base64,")) {
      newPhoto.base64 = "data:image/png;base64," + newPhoto.base64;
    }

    setPhoto(newPhoto);
  };

  const postPhoto = () => {
    const base64Data = photo.base64.replace(/^data:image\/png;base64,/, '');
    fetch(API_UPLOADS_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        selfie: base64Data,
        emoji: "📱"
      })
    })
      .catch(console.error)
      .then(() => {
        setPhoto(undefined);
        navigation.navigate("View"); // take user to view
      });
  };

  const savePhoto = () => {
    MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
      setPhoto(undefined);
    });
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Nice photo</Text>
        <Image
          style={styles.preview}
          source={{ uri: photo.base64 }}
        />
        <Button title="Post" onPress={postPhoto} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera ref={cameraRef} type={CameraType.front} style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePhoto} />
      </View>
    </Camera>
  );
}

function ViewSelfiesScreen({ navigation }) {
  const [selfies, setSelfies] = useState();

  useEffect(() => {
    (() => {
      fetch(API_UPLOADS_PATH)
        .then((res) => res.json())
        .then((data) => setSelfies(data))
        .catch(console.error);
    })();
  }, []);

  if (!selfies) {
    return <Text>Loading selfies...</Text>;
  }

  if (selfies.length === 0) {
    return <Text>No selfies posted yet!</Text>;
  }

  return (
    <View>
      <FlatList
        data={Object.values(selfies).reverse()}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Image
              style={{
                marginTop: 10,
                borderRadius: 0,
                resizeMode: "contain",
                height: undefined,
                width: "100%",
                aspectRatio: 4/3,
              }}
              source={{ uri: UPLOADS_PATH + item.filename }}
            />
            <View style={{
              flexDirection: "row",
              alignContent: "space-between",
              justifyContent: "center",
              backgroundColor: "#ccc",
            }}>
              <Text style={{fontSize: 30, flex: 0.3,}}>
                {item.emoji}
              </Text>
              <Text style={{fontSize: 20, flex: 0.7, textAlign: "right"}}>
                {item.timestamp}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}

function AboutScreen({ navigation }) {
  return <Text>This is the About page</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
  allSelfies: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  }
});

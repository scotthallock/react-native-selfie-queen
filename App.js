import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Button,
  Image,
} from "react-native";
import path from "path";
// https://reactnative.dev/docs/navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// https://www.youtube.com/watch?v=4WPjWK0MYMI
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

const SELFIE_QUEEN_PATH = "https://scotthallock-c0d3.onrender.com/selfie-queen";

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
  const [cameraType, setCameraType] = useState(CameraType.front);
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
      quality: 1,
      base64: true,
      exif: false,
    });

    // iOS doesn't include "data:image/jpg;base64," but the web browser does.
    if (!newPhoto.base64.startsWith("data:image/jpg;base64,")) {
      newPhoto.base64 = "data:image/jpg;base64," + newPhoto.base64;
    }

    setPhoto(newPhoto);
  };

  const flipCamera = () => {
    setCameraType(
      cameraType === CameraType.front ? CameraType.back : CameraType.front
    );
  };

  const postPhoto = () => {
    // shareAsync(photo.uri).then(() => {
    //   setPhoto(undefined);
    // });
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
    <Camera ref={cameraRef} type={cameraType} style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePhoto} />
        <Button title="Flip Camera" onPress={flipCamera} />
      </View>
    </Camera>
  );
}

function ViewSelfiesScreen({ navigation }) {
  const [selfies, setSelfies] = useState();

  useEffect(() => {
    (() => {
      fetch(path.join(SELFIE_QUEEN_PATH, "/api/uploads"))
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

  const images = Object.keys(selfies);
  const metadata = Object.values(selfies);

  const selfieElements = images.map((_, i) => {
    const sourcePath = path.join(SELFIE_QUEEN_PATH, "/uploads", images[i]);
    return (
      <View key={images[i]}>
        <Image
          style={{
            borderRadius: 5,
            resizeMode: "contain",
            height: 100,
            width: 200,
          }}
          source={{ uri: sourcePath }}
        />
        <Text>{metadata[i].emoji}</Text>
        <Text>{metadata[i].timestamp}</Text>
      </View>
    );
  });

  return <View>{selfieElements}</View>;
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
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});

import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  Linking,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";

// https://reactnative.dev/docs/navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Camera, CameraType } from "expo-camera";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// ---------------------------------------------------------------------
// CANNOT import path from "path";
// It will result in this error when opening the app on a web browser:
// Uncaught ReferenceError: process is not defined
//    at ./node_modules/path/path.js (path.js:25:1)
//    ...
// See more about this issue:
// https://github.com/facebook/create-react-app/issues/12212
// There are a few solutions which require extra dependencies.
// But, for simplicity, we elect to concatenate strings instead.
// ---------------------------------------------------------------------

const UPLOADS_PATH =
  "https://scotthallock-c0d3.onrender.com/selfie-queen/uploads/";
const API_UPLOADS_PATH =
  "https://scotthallock-c0d3.onrender.com/selfie-queen/api/uploads/";

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
          options={{ title: "Home" }}
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
    <View style={styles.container}>
      <Text style={{ fontSize: 100 }}>👑</Text>
      <Pressable
        style={{ ...styles.button, width: "90%", backgroundColor: "#581b98" }}
        title="Take a Selfie"
        onPressOut={() => navigation.navigate("Post")}
      >
        <Text style={styles.buttonText}>Take a Selfie</Text>
      </Pressable>
      <Pressable
        style={{ ...styles.button, width: "90%", backgroundColor: "#9c1de7" }}
        title="View Selfies"
        onPressOut={() => navigation.navigate("View")}
      >
        <Text style={styles.buttonText}>View Selfies</Text>
      </Pressable>
      <Pressable
        style={{ ...styles.button, width: "90%", backgroundColor: "#f3558e" }}
        title="About"
        onPressOut={() => navigation.navigate("About")}
      >
        <Text style={styles.buttonText}>About</Text>
      </Pressable>
      <Text style={{ fontSize: 100 }}>🤳</Text>
    </View>
  );
}

function TakeSelfieScreen({ navigation }) {
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

    // iOS doesn't include "data:image/jpg;base64," but the web browser does.
    if (
      !newPhoto.base64.startsWith("data:image/jpg;base64,") &&
      !newPhoto.base64.startsWith("data:image/png;base64,")
    ) {
      newPhoto.base64 = "data:image/png;base64," + newPhoto.base64;
    }

    setPhoto(newPhoto);
  };

  const postPhoto = () => {
    const base64Data = photo.base64.replace(/^data:image\/png;base64,/, "");
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
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                backgroundColor: "black",
                color: "white",
                fontSize: 20,
                margin: 10,
              }}
            >
              Looking good!
            </Text>
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
      <View style={{ height: "100%", justifyContent: "flex-end" }}>
        <Pressable style={styles.button} onPressOut={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </Pressable>
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
    return (
      <View style={styles.container}>
        <Text style={{ color: "#9c1de7", fontSize: 20 }}>
          Loading selfies...
        </Text>
      </View>
    );
  }

  if (selfies.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#9c1de7", fontSize: 20 }}>
          No selfies posted yet!
        </Text>
      </View>
    );
  }

  renderSeparator = () => (
    <View style={{ backgroundColor: "gray", height: 1, margin: "2.5%" }} />
  );

  return (
    <View>
      <FlatList
        data={Object.values(selfies).reverse()}
        keyExtractor={({ id }) => id.toString()}
        ItemSeparatorComponent={this.renderSeparator}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Image
              style={styles.selfie}
              source={{ uri: UPLOADS_PATH + item.filename }}
            />
            <Text style={{ fontSize: 20 }}>
              {dayjs().to(dayjs(item.timestamp))}
            </Text>
            <Text style={{ fontSize: 30 }}>{item.emoji}</Text>
          </View>
        )}
      />
    </View>
  );
}

function AboutScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.aboutText}>
        This UI was built with React Native. The web version of this app can be
        found at:
      </Text>
      <Text
        style={{ ...styles.aboutText, color: "blue" }}
        onPress={() =>
          Linking.openURL("https://scotthallock-c0d3.onrender.com/selfie-queen")
        }
      >
        https://scotthallock-c0d3.onrender.com/selfie-queen
      </Text>
      <Text style={styles.aboutText}>The code can be found at:</Text>
      <Text
        style={{ ...styles.aboutText, color: "blue" }}
        onPress={() =>
          Linking.openURL(
            "https://github.com/scotthallock/react-native-selfie-queen"
          )
        }
      >
        https://github.com/scotthallock/react-native-selfie-queen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "blue",
    color: "white",
  },
  cameraButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 30,
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    flex: 1,
    alignSelf: "stretch",
  },
  allSelfies: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  selfie: {
    marginTop: 10,
    borderRadius: 0,
    resizeMode: "contain",
    height: undefined,
    width: "95%",
    aspectRatio: 4 / 3,
  },
  aboutText: {
    fontSize: 16,
    padding: 16,
    paddingBottom: 0,
  },
});

import { View, Text, Linking } from 'react-native';
import styles from "./styles.js";

export default function AboutScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.aboutText}>
        This UI was built with React Native. The web/desktop version of this app can be
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
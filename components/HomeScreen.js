import { View, Text, Pressable } from "react-native";
import styles from "./styles.js";

export default function HomeScreen({ navigation }) {
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
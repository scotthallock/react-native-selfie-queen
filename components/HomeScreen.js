import { View, Text, Pressable } from 'react-native';
import styles from './styles';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={{ marginTop: 40, fontSize: 100 }}>🤳 👑</Text>
      <Pressable
        style={({ pressed }) => [
          { backgroundColor: pressed ? '#a467e4' : '#581b98' },
          { ...styles.button, width: '90%' },
        ]}
        title="Take a Selfie"
        onPress={() => navigation.navigate('Post')}>
        <Text style={styles.buttonText}>Take a Selfie</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          { backgroundColor: pressed ? '#d7a3f5' : '#9c1de7' },
          { ...styles.button, width: '90%' },
        ]}
        title="View Selfies"
        onPress={() => navigation.navigate('View')}>
        <Text style={styles.buttonText}>View Selfies</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          { backgroundColor: pressed ? '#fab7d0' : '#f3558e' },
          { ...styles.button, width: '90%' },
        ]}
        title="About"
        onPress={() => navigation.navigate('About')}>
        <Text style={styles.buttonText}>About</Text>
      </Pressable>
    </View>
  );
}

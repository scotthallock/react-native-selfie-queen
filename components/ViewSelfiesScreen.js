import { View, Text, Pressable, Image, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { API_UPLOADS_PATH, UPLOADS_PATH } from './constants';
import styles from './styles';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default function ViewSelfiesScreen() {
  const [selfies, setSelfies] = useState();
  const [selectedSelfie, setSelectedSelfie] = useState();

  useEffect(() => {
    (() => {
      fetch(API_UPLOADS_PATH)
        .then((res) => res.json())
        .then((data) => setSelfies(data))
        .catch(console.error);
    })();
  }, []);

  if (selectedSelfie) {
    return (
      <Pressable style={{ flex: 1 }} onPress={() => setSelectedSelfie(null)}>
        <View style={styles.imageContainer}>
          <Image style={styles.containedImage} source={selectedSelfie} />
        </View>
      </Pressable>
    );
  }

  if (!selfies) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.message}>Loading selfies...</Text>
      </View>
    );
  }

  if (Object.keys(selfies).length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.message}>No selfies posted yet!</Text>
      </View>
    );
  }

  renderSeparator = () => (
    <View style={{ backgroundColor: 'gray', height: 1, margin: '2.5%' }} />
  );

  renderSelfie = ({ item }) => {
    const uri = new URL(item.filename, UPLOADS_PATH).href;
    const source = { uri };
    return (
      <Pressable
        onPress={() => setSelectedSelfie(source)}>
        <View style={styles.container}>
          <Image style={styles.selfie} source={source} />
          <Text style={{ fontSize: 20 }}>
            {dayjs().to(dayjs(item.timestamp))}
          </Text>
          <Text style={{ fontSize: 30 }}>{item.emoji}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ width: '100%' }}>
      <FlatList
        data={Object.values(selfies).reverse()}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => renderSelfie({ item })}
        ItemSeparatorComponent={this.renderSeparator}
      />
    </View>
  );
}

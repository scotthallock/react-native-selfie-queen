import { View, Text, Image, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { API_UPLOADS_PATH, UPLOADS_PATH } from "./constants.js";
import styles from "./styles.js";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function ViewSelfiesScreen() {
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
        <Text style={{ fontSize: 20 }}>
          Loading selfies...
        </Text>
      </View>
    );
  }

  if (selfies.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>
          No selfies posted yet!
        </Text>
      </View>
    );
  }

  renderSeparator = () => (
    <View style={{ backgroundColor: "gray", height: 1, margin: "2.5%" }} />
  );

  return (
    <View style={styles.container}>
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
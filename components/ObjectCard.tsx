import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import { ObjectInfo } from "@/interfaces";

interface ObjectCardProps {
  item: ObjectInfo;
  onPress: (id: string) => void;
}

export const ObjectCard: React.FC<ObjectCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 1,
  },
  titleContainer: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

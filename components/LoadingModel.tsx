import { StyleSheet, Text, View } from "react-native";
import React from "react";
import BouncingDots from "./BouncingDots";

const LoadingModel = () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>Loading Model</Text>
        <BouncingDots />
      </View>
    </View>
  );
};

export default LoadingModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    gap: 15,
  },
  innerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  text: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
});

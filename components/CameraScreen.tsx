import React from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import { Scene3D } from "./Scene3D";
import { useCamera } from "../hooks/useCamera";
import * as ScreenOrientation from "expo-screen-orientation";

export const CameraScreen: React.FC = () => {
  const { facing, permission, requestPermission, toggleCameraFacing } =
    useCamera();

  ScreenOrientation.unlockAsync();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.container}>
          <Scene3D style={styles.glView} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  glView: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

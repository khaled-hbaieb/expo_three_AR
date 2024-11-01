import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import { Scene3D } from "../components/Scene3D";
import { useCamera } from "../hooks/useCamera";
import * as ScreenOrientation from "expo-screen-orientation";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./_layout";
import { useNavigation } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import IconButton from "@/components/IconButton";

const CameraScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CameraScreen">>();
  const { objectId } = route.params;
  const navigation = useNavigation();

  const { facing, permission, requestPermission, toggleCameraFacing } =
    useCamera();

  ScreenOrientation.unlockAsync();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          IconComponent={MaterialIcons}
          iconProps={{
            name: "flip-camera-ios",
            size: 28,
            color: "white",
          }}
          onPress={toggleCameraFacing}
        />
      ),
    });
  }, [navigation, toggleCameraFacing]);

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
          <Scene3D style={styles.glView} objectId={objectId} />
        </View>
      </CameraView>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    height: "100%",
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

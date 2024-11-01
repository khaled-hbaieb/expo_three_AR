import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PanResponder,
} from "react-native";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Asset } from "expo-asset";
import {
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Vector2,
  Vector3,
  Quaternion,
} from "three";
import { Renderer, THREE } from "expo-three";
import { GLView } from "expo-gl";
import * as ScreenOrientation from "expo-screen-orientation";

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const glRef = useRef(null);
  const objRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  ScreenOrientation.unlockAsync();

  // Track touch state
  const touchStart = useRef(new Vector2());
  const touchMove = useRef(new Vector2());
  const rotationSpeed = 0.01;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      const { pageX, pageY } = evt.nativeEvent;
      touchStart.current.set(pageX, pageY);
    },

    onPanResponderMove: (evt) => {
      const { pageX, pageY } = evt.nativeEvent;
      touchMove.current.set(pageX, pageY);

      if (objRef.current) {
        // Calculate rotation based on touch movement
        const deltaX = touchMove.current.x - touchStart.current.x;
        const deltaY = touchMove.current.y - touchStart.current.y;

        // Rotate around Y axis for horizontal movement
        objRef.current.rotateY(deltaX * rotationSpeed);
        // Rotate around X axis for vertical movement
        objRef.current.rotateX(deltaY * rotationSpeed);

        // Update touch start for next move
        touchStart.current.set(pageX, pageY);
      }
    },
  });

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    const scene = new Scene();
    sceneRef.current = scene;

    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Ensure camera is looking at the center
    cameraRef.current = camera;

    const ambientLight = new AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load the OBJ model
    const asset = Asset.fromModule(require("../assets/obj/car_obj.obj"));
    await asset.downloadAsync();

    const loader = new OBJLoader();
    loader.load(
      asset.localUri!,
      (obj) => {
        // Traverse through all children and add material
        obj.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xff0000, // Red color
              roughness: 0.5,
              metalness: 0.5,
            });
          }
        });

        obj.position.set(0, -3, 0);
        obj.scale.set(1, 1, 1);
        scene.add(obj);
        objRef.current = obj;
      },
      undefined,
      (error) => console.error("Error loading OBJ model:", error)
    );

    // Animation loop
    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

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
          <GLView
            style={styles.glView}
            onContextCreate={onContextCreate}
            {...panResponder.panHandlers}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  glView: {
    width: "100%",
    height: "100%",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
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

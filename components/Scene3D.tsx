import React, { useEffect } from "react";
import { GLView } from "expo-gl";
import { Renderer, THREE } from "expo-three";
import {
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
} from "three";
import { StyleSheet } from "react-native";
import { use3DModel } from "../hooks/use3DModel";
import { useModelTransform } from "@/hooks/useModelTransform";
import LoadingModel from "./LoadingModel";

interface Scene3DProps {
  style?: object;
  objectId?: string;
}

export const Scene3D: React.FC<Scene3DProps> = ({ style, objectId }) => {
  const { objRef, sceneRef, cameraRef, loadModel, loading } = use3DModel({
    objectId: objectId as string,
  });

  const panResponder = useModelTransform(cameraRef, objRef);

  useEffect(() => {
    console.log("loading: ", loading);
  }, [loading]);

  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    const scene = new Scene();
    sceneRef.current = scene;

    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraRef.current = camera;

    scene.add(new AmbientLight(0x404040, 2));

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load the 3D model into the scene
    await loadModel(scene);

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <>
      <GLView
        style={[styles.glView, style]}
        onContextCreate={onContextCreate}
        {...panResponder.panHandlers}
      />

      {loading && <LoadingModel />}
    </>
  );
};

const styles = StyleSheet.create({
  glView: {
    width: "100%",
    height: "100%",
  },
});

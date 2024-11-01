import React from "react";
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

// Define the props expected by the Scene3D component
interface Scene3DProps {
  style?: object;
  objectId?: string;
}

/**
 * A React functional component that renders a 3D scene using Three.js in an Expo GLView.
 * It loads a 3D model based on the provided objectId and allows user interaction via touch gestures.
 *
 * @param {Scene3DProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered GLView component containing the 3D scene.
 */
export const Scene3D: React.FC<Scene3DProps> = ({ style, objectId }) => {
  // Custom hook to manage loading and references to the 3D model
  const { objRef, sceneRef, cameraRef, loadModel } = use3DModel({
    objectId: objectId as string, // Ensure objectId is treated as a string
  });

  // Use the model transform hook for touch interactions
  const panResponder = useModelTransform(cameraRef, objRef);

  // This function is called when the GLView context is created
  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Create a new renderer instance with the GL context
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height); // Set the size of the renderer

    // Create a new scene
    const scene = new Scene();
    sceneRef.current = scene; // Store the scene reference

    // Set up the camera
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5); // Position the camera
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Point the camera at the scene's center
    cameraRef.current = camera; // Store the camera reference

    // Add ambient light to the scene
    scene.add(new AmbientLight(0x404040, 2));

    // Set up directional light
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5); // Position the directional light
    scene.add(directionalLight); // Add light to the scene

    // Load the 3D model into the scene
    await loadModel(scene);

    // Function to handle the rendering loop
    const render = () => {
      requestAnimationFrame(render); // Request the next frame
      renderer.render(scene, camera); // Render the scene from the camera's perspective
      gl.endFrameEXP(); // End the frame for the GL context
    };
    render(); // Start rendering
  };

  // Render the GLView with the appropriate styles and pan responder handlers
  return (
    <GLView
      style={[styles.glView, style]}
      onContextCreate={onContextCreate}
      {...panResponder.panHandlers}
    />
  );
};

const styles = StyleSheet.create({
  glView: {
    width: "100%",
    height: "100%",
  },
});

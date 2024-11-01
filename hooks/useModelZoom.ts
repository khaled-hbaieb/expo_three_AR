import { useRef } from "react";
import { PanResponder } from "react-native";
import * as THREE from "three";

export const useModelZoom = (
  cameraRef: React.RefObject<THREE.PerspectiveCamera>
) => {
  const initialDistance = useRef(0);
  const zoomSpeed = 0.1;
  const minZoom = useRef(5); // Minimum zoom level
  const maxZoom = useRef(20); // Maximum zoom level

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length === 2,
    onMoveShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length === 2,

    onPanResponderGrant: (evt) => {
      if (evt.nativeEvent.touches.length === 2) {
        const dx =
          evt.nativeEvent.touches[0].pageX - evt.nativeEvent.touches[1].pageX;
        const dy =
          evt.nativeEvent.touches[0].pageY - evt.nativeEvent.touches[1].pageY;
        initialDistance.current = Math.sqrt(dx * dx + dy * dy);
      }
    },

    onPanResponderMove: (evt) => {
      if (evt.nativeEvent.touches.length === 2) {
        const dx =
          evt.nativeEvent.touches[0].pageX - evt.nativeEvent.touches[1].pageX;
        const dy =
          evt.nativeEvent.touches[0].pageY - evt.nativeEvent.touches[1].pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate the zoom factor
        const zoomFactor = initialDistance.current / distance;
        initialDistance.current = distance;

        if (cameraRef.current) {
          cameraRef.current.position.z = Math.max(
            minZoom.current,
            Math.min(maxZoom.current, cameraRef.current.position.z * zoomFactor)
          );
        }
      }
    },
  });

  return panResponder;
};

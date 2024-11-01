import { useRef } from "react";
import { PanResponder } from "react-native";
import { Vector2 } from "three";
import * as THREE from "three";

/**
 * A custom hook to handle touch interactions for 3D model manipulation,
 * including rotation and zooming in a Three.js scene.
 *
 * @param {React.RefObject<THREE.PerspectiveCamera>} cameraRef - A reference to the PerspectiveCamera instance.
 * @param {React.RefObject<THREE.Object3D>} objRef - A reference to the 3D object to be manipulated.
 * @returns {object} - The PanResponder configuration object to be used in a touchable component.
 */
export const useModelTransform = (
  cameraRef: React.RefObject<THREE.PerspectiveCamera>,
  objRef: React.RefObject<THREE.Object3D>
) => {
  // References to track initial distance between two touch points and touch positions
  const initialDistance = useRef(0);
  const touchStart = useRef(new Vector2());
  const touchMove = useRef(new Vector2());

  // Speed settings for rotation
  const rotationSpeed = 0.01;

  // Zoom limits
  const minZoom = useRef(5); // Minimum zoom level
  const maxZoom = useRef(20); // Maximum zoom level

  // Create a PanResponder to handle touch interactions
  const panResponder = PanResponder.create({
    // Allow the responder to start when the touch begins
    onStartShouldSetPanResponder: (evt) => true,

    // Allow the responder to move when the touch moves
    onMoveShouldSetPanResponder: (evt) => true,

    // Handle the start of a touch gesture
    onPanResponderGrant: (evt) => {
      if (evt.nativeEvent.touches.length === 2) {
        // For pinch zooming, calculate the initial distance between two touch points
        const dx =
          evt.nativeEvent.touches[0].pageX - evt.nativeEvent.touches[1].pageX;
        const dy =
          evt.nativeEvent.touches[0].pageY - evt.nativeEvent.touches[1].pageY;
        initialDistance.current = Math.sqrt(dx * dx + dy * dy);
      } else if (evt.nativeEvent.touches.length === 1) {
        // For single touch, record the starting position
        const { pageX, pageY } = evt.nativeEvent;
        touchStart.current.set(pageX, pageY);
      }
    },

    // Handle touch movement
    onPanResponderMove: (evt) => {
      if (evt.nativeEvent.touches.length === 2) {
        // For pinch zooming, calculate the new distance and update camera position
        const dx =
          evt.nativeEvent.touches[0].pageX - evt.nativeEvent.touches[1].pageX;
        const dy =
          evt.nativeEvent.touches[0].pageY - evt.nativeEvent.touches[1].pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate the zoom factor based on the initial distance and current distance
        const zoomFactor = initialDistance.current / distance;
        initialDistance.current = distance;

        // Update camera position while enforcing zoom limits
        if (cameraRef.current) {
          cameraRef.current.position.z = Math.max(
            minZoom.current,
            Math.min(maxZoom.current, cameraRef.current.position.z * zoomFactor)
          );
        }
      } else if (evt.nativeEvent.touches.length === 1) {
        // For rotation with a single touch, calculate the change in position
        const { pageX, pageY } = evt.nativeEvent;
        touchMove.current.set(pageX, pageY);

        // Apply rotation to the object based on the change in touch position
        if (objRef.current) {
          const deltaX = touchMove.current.x - touchStart.current.x;
          const deltaY = touchMove.current.y - touchStart.current.y;

          // Rotate the object around the Y and X axes
          objRef.current.rotateY(deltaX * rotationSpeed);
          objRef.current.rotateX(deltaY * rotationSpeed);

          // Update the starting touch position for the next movement
          touchStart.current.set(pageX, pageY);
        }
      }
    },
  });

  return panResponder; // Return the PanResponder configuration
};

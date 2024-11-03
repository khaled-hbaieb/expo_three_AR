import { useRef } from "react";
import { PanResponder } from "react-native";
import { Vector2 } from "three";
import * as THREE from "three";

/**
 * A custom hook to handle touch interactions for 3D model movement
 * in a Three.js scene with boundary restrictions.
 *
 * @param {React.RefObject<THREE.PerspectiveCamera>} cameraRef - A reference to the PerspectiveCamera instance (not used in this case).
 * @param {React.RefObject<THREE.Object3D>} objRef - A reference to the 3D object to be moved.
 * @param {number} boundaryX - The maximum x boundary.
 * @returns {object} - The PanResponder configuration object to be used in a touchable component.
 */
export const useModelTransform = (
  cameraRef: React.RefObject<THREE.PerspectiveCamera>,
  objRef: React.RefObject<THREE.Object3D>,
  boundaryX: number = 10
) => {
  // References to track touch positions
  const touchStart = useRef(new Vector2());
  const touchMove = useRef(new Vector2());

  // Speed multiplier for object movement
  const movementSpeed = 0.1;

  // Store the initial position for reference
  const initialPosition = useRef(new THREE.Vector3());

  const panResponder = PanResponder.create({
    // Allow the responder to start when the touch begins
    onStartShouldSetPanResponder: () => true,

    // Allow the responder to move when the touch moves
    onMoveShouldSetPanResponder: () => true,

    // Handle the start of a touch gesture
    onPanResponderGrant: (evt) => {
      const { touches } = evt.nativeEvent;
      if (touches.length === 1) {
        // Record the initial touch position
        const { pageX, pageY } = touches[0];
        touchStart.current.set(pageX, pageY);

        // Store the initial position of the object
        if (objRef.current) {
          initialPosition.current.copy(objRef.current.position);
        }
      }
    },

    // Handle touch movement
    onPanResponderMove: (evt) => {
      const { touches } = evt.nativeEvent;

      if (touches.length === 1) {
        // For moving the object with one finger
        const { pageX, pageY } = touches[0];
        touchMove.current.set(pageX, pageY);

        // Calculate movement deltas
        if (objRef.current) {
          const deltaX = touchMove.current.x - touchStart.current.x;
          const deltaY = touchMove.current.y - touchStart.current.y;

          // Adjust object position
          objRef.current.position.x += deltaX * movementSpeed; // Move in the X direction
          objRef.current.position.y -= deltaY * movementSpeed; // Move in the Y direction

          // Clamp the position to stay within defined boundaries
          objRef.current.position.x = Math.max(
            -boundaryX,
            Math.min(boundaryX, objRef.current.position.x)
          );

          // Update the starting touch position for the next movement
          touchStart.current.set(pageX, pageY);
        }
      }
    },
  });

  return panResponder; // Return the PanResponder configuration
};

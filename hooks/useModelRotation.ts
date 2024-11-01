import { useRef } from "react";
import { PanResponder } from "react-native";
import { Vector2 } from "three";
import * as THREE from "three";

export const useModelRotation = (objRef: React.RefObject<THREE.Object3D>) => {
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
        const deltaX = touchMove.current.x - touchStart.current.x;
        const deltaY = touchMove.current.y - touchStart.current.y;

        objRef.current.rotateY(deltaX * rotationSpeed);
        objRef.current.rotateX(deltaY * rotationSpeed);

        touchStart.current.set(pageX, pageY);
      }
    },
  });

  return panResponder;
};

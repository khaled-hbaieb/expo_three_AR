import { useRef } from "react";
import { Scene, PerspectiveCamera, Object3D } from "three";
import { Asset } from "expo-asset";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import { MODEL_MAPPING } from "@/constants";

type use3DModelProps = {
  objectId: string;
};

export const use3DModel = ({ objectId }: use3DModelProps) => {
  const objRef = useRef<Object3D | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);

  const loadModel = async (scene: Scene) => {
    const asset = Asset.fromModule(
      MODEL_MAPPING[objectId as keyof typeof MODEL_MAPPING]
    );
    await asset.downloadAsync();

    const loader = new OBJLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        asset.localUri!,
        (obj) => {
          const boundingBox = new THREE.Box3().setFromObject(obj);
          const size = new THREE.Vector3();
          boundingBox.getSize(size);

          // Center the model
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          obj.position.sub(center); // Offset the object to center it

          // Uniform scale based on bounding box size
          const desiredSize = 5;
          const scaleFactor = desiredSize / Math.max(size.x, size.y, size.z);
          obj.scale.set(scaleFactor, scaleFactor, scaleFactor);

          // Adjust the Y position slightly if the model still appears off-center
          obj.position.y = -size.y / 2; // Center it vertically

          scene.add(obj);
          objRef.current = obj;
          resolve(obj);
        },
        undefined,
        reject
      );
    });
  };

  return {
    objRef,
    sceneRef,
    cameraRef,
    loadModel,
  };
};

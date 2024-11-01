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
          obj.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                roughness: 0.5,
                metalness: 0.5,
              });
            }
          });

          obj.position.set(0, -3, 0);
          obj.scale.set(1, 1, 1);
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

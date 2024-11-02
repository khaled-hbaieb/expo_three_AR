import { useRef } from "react";
import { Scene, PerspectiveCamera, Object3D } from "three";
import { Asset } from "expo-asset";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import { MODEL_MAPPING, ModelMappingKeys } from "@/constants";
import { loadTextureAsync } from "expo-three";

type use3DModelProps = {
  objectId: string;
};

export const use3DModel = ({ objectId }: use3DModelProps) => {
  const objRef = useRef<Object3D | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);

  const loadModel = async (scene: Scene) => {
    const modelData = MODEL_MAPPING[objectId];
    const asset = Asset.fromModule(modelData.obj);
    await asset.downloadAsync();

    const loader = new OBJLoader();
    return new Promise(async (resolve, reject) => {
      loader.load(
        asset.localUri!,
        async (obj) => {
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

          // Load and apply textures
          const texturePromises = modelData.textures.map(
            async (texturePath) => {
              return await loadTextureAsync({ asset: texturePath });
            }
          );

          // Wait for all textures to load
          const textures = await Promise.all(texturePromises);

          // Apply textures to the model
          let textureIndex = 0;
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh && textureIndex < textures.length) {
              // Create a new material for each mesh and assign the texture
              child.material = new THREE.MeshPhongMaterial({
                map: textures[textureIndex],
              });
              textureIndex++;
            }
          });

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

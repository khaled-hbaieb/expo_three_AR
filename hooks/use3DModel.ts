import { useRef, useState } from "react";
import { Scene, PerspectiveCamera, Object3D } from "three";
import { Asset } from "expo-asset";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import { MODEL_MAPPING } from "@/constants";
import { loadTextureAsync } from "expo-three";

type use3DModelProps = {
  objectId: string;
};

export const use3DModel = ({ objectId }: use3DModelProps) => {
  const objRef = useRef<Object3D | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const loadModel = async (scene: Scene) => {
    const modelData = MODEL_MAPPING[objectId];
    const asset = Asset.fromModule(modelData.obj);
    await asset.downloadAsync();

    // Create a loading manager
    const manager = new THREE.LoadingManager();

    // Define loading manager events
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
      console.log(
        `Started loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`
      );
    };

    manager.onLoad = function () {
      console.log("Loading complete!");
      setLoading(false); // Set loading to false when all models/textures are loaded
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log(
        `Loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`
      );
    };

    manager.onError = function (url) {
      console.log(`There was an error loading ${url}`);
      setLoading(false); // Ensure loading is set to false on error

      // TODO:Handle error
    };

    const loader = new OBJLoader(manager);
    return new Promise(async (resolve, reject) => {
      loader.load(
        asset.localUri!,
        async (obj) => {
          console.log("Model loaded successfully."); // Log on successful load
          const boundingBox = new THREE.Box3().setFromObject(obj);
          const size = new THREE.Vector3();
          boundingBox.getSize(size);

          // Center the model
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          obj.position.sub(center); // Offset the object to center it

          // Uniform scale based on bounding box size
          const desiredSize = 12;
          const scaleFactor = desiredSize / Math.max(size.x, size.y, size.z);
          obj.scale.set(scaleFactor, scaleFactor, scaleFactor);

          // Center it vertically
          obj.position.y = -size.y / 2;

          // Rotate the model to correct its orientation
          obj.rotation.x = 4.5; // Adjust as necessary

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
        (error) => {
          console.log("Error loading model:", error); // Log loading error
          setLoading(false); // Ensure loading is set to false on error
          reject(error);
        }
      );
    });
  };

  return {
    objRef,
    sceneRef,
    cameraRef,
    loadModel,
    loading,
  };
};

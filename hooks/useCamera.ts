import { useState } from "react";
import { CameraType, useCameraPermissions } from "expo-camera";

export const useCamera = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return {
    facing,
    permission,
    requestPermission,
    toggleCameraFacing,
  };
};

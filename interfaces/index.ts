import { OBJECT_DATA } from "@/constants";

export type ThreeDObjectType = (typeof OBJECT_DATA)[number];

export interface ObjectInfo {
  id: string;
  title: string;
  thumbnail: string;
}

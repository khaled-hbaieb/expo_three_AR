import { ObjectInfo } from "@/interfaces";

export const OBJECT_DATA: ObjectInfo[] = [
  {
    id: "deer",
    title: "Deer Model",
    thumbnail:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=500&q=80",
  },
  {
    id: "cat",
    title: "Cat Model",
    thumbnail:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80",
  },
  {
    id: "duck",
    title: "duck Model",
    thumbnail:
      "https://images.unsplash.com/photo-1586276633990-fb6092e2de01?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const MODEL_MAPPING: ModelMapping = {
  duck: {
    obj: require("../assets/obj/duck_obj.obj"),
    textures: [require("../assets/duck/duck_texture.jpg")],
  },
  cat: {
    obj: require("../assets/cat/cat_obj.obj"),
    textures: [require("../assets/cat/cat_texture.jpg")],
  },
  deer: {
    obj: require("../assets/deer/deer_obj.obj"),
    textures: [require("../assets/deer/deer_texture.jpg")],
  },
} as const;

// Define the structure of each model entry
type ModelEntry = {
  obj: string; // Path to the object
  textures: readonly string[]; // Array of texture paths
};

// Define the structure of MODEL_MAPPING
export type ModelMapping = {
  [key: string]: ModelEntry;
};

// Define a type for the keys of MODEL_MAPPING
export type ModelMappingKeys = keyof typeof MODEL_MAPPING;

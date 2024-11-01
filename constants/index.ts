import { ObjectInfo } from "@/interfaces";

export const OBJECT_DATA: ObjectInfo[] = [
  {
    id: "car",
    title: "Car Model",
    thumbnail:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=500&q=80",
  },
  {
    id: "cat",
    title: "Cat Model",
    thumbnail:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80",
  },
];

export const MODEL_MAPPING = {
  car: require("../assets/obj/car_obj.obj"),
  cat: require("../assets/obj/cat_obj.obj"),
} as const;

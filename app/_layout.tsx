import { NavigationProp } from "@react-navigation/native";
import { Stack } from "expo-router";

export type RootStackParamList = {
  index: undefined;
  HomeScreen: undefined;
  CameraScreen: {
    objectId: string;
  };
};

export type NavigationProps = NavigationProp<RootStackParamList>;

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="HomeScreen"
        options={{ headerShown: false, headerTransparent: true }}
      />
      <Stack.Screen
        name="CameraScreen"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
}

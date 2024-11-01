import IconButton from "@/components/IconButton";
import { NavigationProp } from "@react-navigation/native";
import { Stack, useNavigation } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export type RootStackParamList = {
  index: undefined;
  HomeScreen: undefined;
  CameraScreen: {
    objectId: string;
  };
};

export type NavigationProps = NavigationProp<RootStackParamList>;

export default function RootLayout() {
  const navigation = useNavigation<NavigationProps>();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
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
          headerBackTitle: "",
          headerBackTitleVisible: false,
          headerLeft: () => (
            <IconButton
              IconComponent={MaterialIcons}
              iconProps={{
                name: "arrow-back-ios-new",
                size: 24,
                color: "white",
              }}
              onPress={() => navigation.goBack()}
            />
          ),
        }}
      />
    </Stack>
  );
}

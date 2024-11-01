import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ObjectCard } from "@/components/ObjectCard";
import { OBJECT_DATA } from "@/constants";
import { useNavigation } from "expo-router";
import { NavigationProps } from "./_layout";

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();
  const renderItem: ListRenderItem<(typeof OBJECT_DATA)[number]> = ({
    item,
  }) => {
    const handleObjectPress = () => {
      navigation.navigate("CameraScreen", {
        objectId: item.id,
      });
    };
    return <ObjectCard item={item} onPress={handleObjectPress} />;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={OBJECT_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

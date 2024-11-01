import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface IconButtonProps {
  IconComponent: React.ElementType; // The icon component (e.g., from any icon library)
  iconProps?: object; // Props to pass to the icon component
  onPress: () => void; // Function to execute on press
}

const IconButton: React.FC<IconButtonProps> = ({
  IconComponent,
  iconProps,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <IconComponent {...iconProps} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 5,
  },
});

export default IconButton;

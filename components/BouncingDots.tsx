import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const BouncingDots = () => {
  // Create shared values for each dot's vertical position
  const dotY = useSharedValue(0);
  const dot2Y = useSharedValue(0);
  const dot3Y = useSharedValue(0);

  // Start the bouncing animation
  const startAnimation = () => {
    const bounceHeight = -30; // Height of the bounce
    const duration = 600; // Base duration for each bounce
    const delayIncrement = 200; // Delay between each dot's animation

    // Animate the first dot
    dotY.value = withRepeat(
      withTiming(bounceHeight, { duration, easing: Easing.bounce }),
      -1,
      true
    );

    // Animate the second dot with a delay
    dot2Y.value = withRepeat(
      withTiming(bounceHeight, { duration, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    // Animate the third dot with a longer delay
    dot3Y.value = withRepeat(
      withTiming(bounceHeight, { duration, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  };

  // Start the animation when the component mounts
  React.useEffect(() => {
    // Adjust the delays for each dot to create a staggered effect
    dotY.value = withRepeat(
      withTiming(-15, { duration: 400, easing: Easing.bounce }),
      -1,
      true
    );

    setTimeout(() => {
      dot2Y.value = withRepeat(
        withTiming(-15, { duration: 400, easing: Easing.bounce }),
        -1,
        true
      );
    }, 200); // Delay for the second dot

    setTimeout(() => {
      dot3Y.value = withRepeat(
        withTiming(-15, { duration: 400, easing: Easing.bounce }),
        -1,
        true
      );
    }, 400); // Delay for the third dot
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.dot, { transform: [{ translateY: dotY }] }]}
      />
      <Animated.View
        style={[styles.dot, { transform: [{ translateY: dot2Y }] }]}
      />
      <Animated.View
        style={[styles.dot, { transform: [{ translateY: dot3Y }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    columnGap: 5,
    marginTop: 30,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#000", // Change the color as needed
  },
});

export default BouncingDots;

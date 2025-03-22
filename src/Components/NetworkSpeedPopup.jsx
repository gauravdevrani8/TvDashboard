import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const NetworkStatusIndicator = () => {
  const [speed, setSpeed] = useState(null);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.details) {
        setSpeed(state.details.downlink); // Speed in Mbps
      } else {
        setSpeed(0);
      }
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();

    return () => unsubscribe();
  }, []);

  const getStatusColor = () => {
    if (speed === null || speed === 0) return "#FF0000"; // No internet
    if (speed < 1) return "#FF4500"; // Very slow (under 1 Mbps)
    if (speed < 5) return "#FFA500"; // Slow (1-5 Mbps)
    if (speed < 10) return "#FFD700"; // Medium (5-10 Mbps)
    return "#00C851"; // Fast (10+ Mbps)
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: getStatusColor(),
            opacity: fadeAnim,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 23,
    right: 230,
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 50,
  },
});

export default NetworkStatusIndicator;

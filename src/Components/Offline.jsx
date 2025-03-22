import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

const OfflineScreen = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      {/* SVG Illustration */}
      <Svg width={200} height={200} viewBox="0 0 512 512">
        {/* Cloud */}
        <Path
          d="M400 192c-8.8 0-16 7.2-16 16v16H208v-16c0-8.8-7.2-16-16-16s-16 7.2-16 16v16h-48c-44.2 0-80 35.8-80 80s35.8 80 80 80h288c44.2 0 80-35.8 80-80s-35.8-80-80-80h-16v-16c0-8.8-7.2-16-16-16z"
          fill="#888"
        />
        {/* Cross Line */}
        <Path
          d="M144 368l224-224"
          stroke="red"
          strokeWidth="20"
          strokeLinecap="round"
        />
        <Path
          d="M368 368L144 144"
          stroke="red"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Small Circle */}
        <Circle cx="256" cy="352" r="16" fill="red" />
      </Svg>

      {/* Offline Message */}
      <Text style={styles.text}>No Internet Connection</Text>

      {/* Retry Button */}
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OfflineScreen;

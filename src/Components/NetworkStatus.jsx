import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

const NetworkStatus = ({ children }) => {
  const netInfo = useNetInfo();
  const [isConnected, setIsConnected] = useState(netInfo.isConnected);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (netInfo.isConnected !== null) {
      setIsConnected(netInfo.isConnected);
    }

    if (netInfo.isConnected) {
      setIsOfflineMode(false);
    } else if (!isConnected) {
      setIsOfflineMode(true);
    }
  }, [netInfo.isConnected]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isConnected ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected]);

  return (
    <View style={styles.container}>
      {/* Show previous app state when offline */}
      {isOfflineMode && (
        <Text style={styles.offlineCacheText}>
          Showing last cached state...
        </Text>
      )}

      {/* Main app content */}
      {children}

      {/* Show offline notification */}
      {!isConnected && (
        <View style={styles.overlay}>
          <Animated.View style={[styles.notificationBox, { opacity: fadeAnim }]}>
            <ActivityIndicator size="small" color="#ffffff" style={styles.loader} />
            <Text style={styles.offlineText}>
              You are offline. Please check your internet connection.
            </Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBox: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  offlineText: {
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 10,
  },
  loader: {
    marginRight: 5,
  },
  offlineCacheText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 10,
  },
});

export default NetworkStatus;

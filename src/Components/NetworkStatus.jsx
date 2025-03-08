import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isSlow, setIsSlow] = useState(false);

  const checkLocalNetwork = async () => {
    const state = await NetInfo.fetch();

    if (state.type === "wifi" || state.type === "ethernet") {
      console.log("Connected to local network!");
    } else {
      console.log("Not connected to local network!");
    }
  };

  useEffect(() => {
    checkLocalNetwork();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setIsSlow(state.details?.downlink && state.details.downlink < 1);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Modal transparent visible={!isConnected} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.notificationBox}>
          <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
          <Text style={styles.offlineText}>
            {isSlow
              ? "Your network is slow. Some features may take longer to load."
              : "You are offline. Please check your internet connection."}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  notificationBox: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 6,
    alignItems: "center",
    width: "80%",
  },
  offlineText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  loader: {
    marginBottom: 10,
  },
});

export default NetworkStatus;

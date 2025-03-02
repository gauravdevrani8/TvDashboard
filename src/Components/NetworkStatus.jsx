import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected || state.isInternetReachable === false) {
        setIsConnected(false);
        setIsSlow(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }).start();
      } else if (state.isConnected && state.details?.downlink < 1) {
        setIsConnected(true);
        setIsSlow(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }).start();
      } else {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.in(Easing.exp),
        }).start(() => {
          setIsConnected(true);
          setIsSlow(false);
        });
      }
    });

    return () => unsubscribe();
  }, [fadeAnim]);

  if (isConnected && !isSlow) return null;

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.notificationBox, { opacity: fadeAnim }]}>  
          <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
          <Text style={styles.offlineText}>
            {isSlow ? 'Your network is slow. Some features may take longer to load.' : 'You are offline. Please check your internet connection.'}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  notificationBox: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 6,
    alignItems: 'center',
    width: '30%',
  },
  offlineText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  loader: {
    marginBottom: 10,
  },
});

export default NetworkStatus;

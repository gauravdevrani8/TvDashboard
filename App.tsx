import React from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardForm from './src/Components/DashboardForm';
import NetworkStatus from './src/Components/NetworkStatus';

export default function App() {
  return (
    <View style={styles.container}>
      <NetworkStatus>
      <DashboardForm />
      </NetworkStatus>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%', // Full width of the screen
    flex: 1, // Full height of the screen
    backgroundColor: '#F5F5F7', // Light gray background
  },
});

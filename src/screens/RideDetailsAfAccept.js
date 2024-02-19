import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RideDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ride Details</Text>
      <View style={styles.detailsContainer}>
        <Text>Driver: John Doe</Text>
        <Text>Vehicle: Toyota Camry</Text>
        <Text>License Plate: ABC123</Text>
        {/* Add more details as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: "#F0F0F0",
    padding: 20,
    borderRadius: 10,
  },
});

export default RideDetailsScreen;

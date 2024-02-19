import React, { useContext } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import RideContext from "./RideIdContext";

const EmptyScreen = () => {
  const { rideId } = useContext(RideContext);

  return (
    <ImageBackground
      source={require("../../assets/ride.png")} // Replace with the path to your image
      style={styles.background}
    ></ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default EmptyScreen;

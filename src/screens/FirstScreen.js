import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import { Button } from "@rneui/themed";
import { Text } from "@rneui/themed";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const FirstScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../assets/WELCOME.png")}
      style={[styles.background, { width: windowWidth, height: windowHeight }]}
    >
      {/* {/* <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to {"\n"}Your App!</Text>

          <TouchableOpacity
            style={[styles.roleButton, styles.passengerButton]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.roleButtonText}>Passenger</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, styles.driverButton]}
            onPress={() => navigation.navigate("LoginDriver")}
          >
            <Text style={styles.roleButtonText}>Driver</Text>
          </TouchableOpacity>
        </View>
      </View> */}
      <View style={styles.container}>
        <View style={{ marginBottom: 0 }}>
          <Text h2 h2Style={{ color: "#4b296b" }}>
            Login
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={{ borderRadius: 10 }}
            title={"Passenger"}
            onPress={() => navigation.navigate("Login")}
          ></Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            buttonStyle={{ borderRadius: 10 }}
            title={"Driver"}
            onPress={() => navigation.navigate("LoginDriver")}
          ></Button>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    position: "absolute",
    bottom: 80, // Adjust this value to align the buttons nearly to the bottom
    left: 0,
    right: 0,
    alignItems: "center",
  },
  buttonContainer: {
    marginVertical: 10,
    width: "80%", // Adjust this as needed
  },
  button: {
    height: 50, // Adjust this as needed
  },
});

export default FirstScreen;

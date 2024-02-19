import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import messaging from "@react-native-firebase/messaging";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { Dimensions } from "react-native";
import { Button } from "@rneui/themed";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const AcceptScreen = () => {
  const info = useSelector((state) => state.info);
  const [notificationData, setNotificationData] = useState(null);
  const navigation = useNavigation(); // Get navigation object using useNavigation hook

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        // Handle incoming notifications when the app is in the foreground
        console.log("Received notification:", remoteMessage.notification);
        setNotificationData(remoteMessage.notification);
      }
    );

    return () => {
      unsubscribeForeground();
    };
  }, []);

  const closeModalAndNavigate = () => {
    if (notificationData && notificationData.title === "Ride Accepted") {
      // If Ride Accepted, navigate to EmptyScreen
      navigation.navigate("EmptyScreen", { rideDetails: notificationData });
    } else {
      // Otherwise, navigate to HomeScreen
      navigation.navigate("Map");
    }
    setNotificationData(null);
  };

  return (
    <ImageBackground
      source={require("../../assets/wait.png")}
      style={[styles.background, { width: windowWidth, height: windowHeight }]}
    >
      {notificationData && (
        <View style={styles.notificationContainer}>
          <Text
            style={[
              styles.notificationText,
              {
                color:
                  notificationData.title === "Ride Accepted"
                    ? "#0e6a67"
                    : "#C30101",
              },
            ]}
          >
            {notificationData.title}
          </Text>
          <Text style={styles.notificationText}>{notificationData.body}</Text>
          {/* <TouchableOpacity
            style={styles.okButton}
            onPress={closeModalAndNavigate}
          >
            <Text>OK</Text>
          </TouchableOpacity> */}
          <Button
            buttonStyle={{ borderRadius: 10, backgroundColor: "#0e6a67" }}
            title={"OK"}
            onPress={closeModalAndNavigate}
          ></Button>
        </View>
      )}
      {/* <Text>Waiting for the Driver's response</Text> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  notificationContainer: {
    backgroundColor: "white",
    padding: 32,
    margin: 20,
    borderRadius: 10,
    elevation: 10,
    alignItems: "center",
  },
  notificationText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#4b296b",
  },
  okButton: {
    marginTop: 20,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rideAccept: {},
  rideReject: {},
});

export default AcceptScreen;

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import firebase from "@react-native-firebase/app"; // Import firebase
import { useNavigation } from "@react-navigation/native";
import RideContext from "./RideIdContext";

const DriverScreen = ({ route }) => {
  const { remoteMessage } = route.params;
  const navigation = useNavigation(); // Initialize useNavigation hook

  const [rideDetails, setRideDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add state to track loading
  const { rideId, setRideId } = useContext(RideContext);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        if (!rideDetails) {
          const currentRideId = remoteMessage.data.requestId;
          setRideId(remoteMessage.data.requestId); // Set rideId in the context
          console.log(currentRideId + " from driver screen");

          const rideSnapshot = await firestore()
            .collection("ride_requests")
            .doc(currentRideId)
            .get();

          if (rideSnapshot.exists) {
            const data = rideSnapshot.data();
            setRideDetails(data);
          } else {
            console.log("Ride details not found");
          }
        }
      } catch (error) {
        console.error("Error fetching ride details:", error);
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    fetchRideDetails();
  }, [remoteMessage]);

  const updateStatus = async (action) => {
    try {
      // Update status in the ride_requests collection based on driver's action
      await firestore()
        .collection("ride_requests")
        .doc(remoteMessage.data.requestId)
        .update({
          status: action === "accept" ? "Accepted" : "Rejected",
        });

      setRideDetails(rideDetails); // Save ride details after action

      // Check if the current user is a driver and then navigate to the map
      const currentUser = firebase.auth().currentUser;
      if (
        currentUser &&
        rideDetails.driver_id === currentUser.uid &&
        action === "accept"
      ) {
        navigation.navigate("EmptyScreen"); // Navigate to the map screen
      } else if (action === "reject") {
        navigation.navigate("Home"); // Navigate to the map screen
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {rideDetails && isLoading ? (
          <Text>Loading ride details...</Text>
        ) : (
          <>
            <Text style={styles.detailItem}>
              Passenger:{" "}
              {rideDetails && rideDetails.user_name
                ? rideDetails.user_name
                : "Unknown"}
            </Text>
            <Text style={styles.detailItem}>
              Destination:{" "}
              {rideDetails && rideDetails.destination
                ? rideDetails.destination
                : "Unknown"}
            </Text>
            <Text style={styles.detailItem}>
              Pickup Location:{" "}
              {rideDetails && rideDetails.origin
                ? rideDetails.origin
                : "Unknown"}
            </Text>

            <Text style={styles.infoText}>Have a safe journey!</Text>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => updateStatus("accept")}
            >
              <Text style={styles.buttonText}>ACCEPT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => updateStatus("reject")}
            >
              <Text style={styles.buttonText}>REJECT</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  detailItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  infoText: {
    color: "blue",
    fontSize: 16,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#0e6a67",
  },
  rejectButton: {
    backgroundColor: "#C30101",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DriverScreen;

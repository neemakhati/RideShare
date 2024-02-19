import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import firestore from "@react-native-firebase/firestore";

const DriverScreen = ({ remoteMessage }) => {
  const [rideDetails, setRideDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        if (!rideDetails) {
          const rideId = remoteMessage.data.requestId;
          const rideSnapshot = await firestore()
            .collection("ride_requests")
            .doc(rideId)
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
      }
    };

    fetchRideDetails();
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    // Optionally, you can navigate away from this screen or perform other actions upon closing the modal
  };

  const updateStatus = async (action) => {
    try {
      // Update status in the ride_requests collection based on driver's action
      await firestore()
        .collection("ride_requests")
        .doc(remoteMessage.data.requestId)
        .update({
          status: action === "accept" ? "Accepted" : "Rejected",
        });

      closeModal();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {rideDetails ? (
              <>
                <Text style={styles.detailItem}>
                  Passenger: {rideDetails.user_name}
                </Text>
                <Text style={styles.detailItem}>
                  Destination: {rideDetails.destination}
                </Text>
                <Text style={styles.detailItem}>
                  Pickup Location: {rideDetails.origin}
                </Text>

                <Text style={styles.infoText}>Have a safe journey!</Text>

                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => updateStatus("accept")}
                >
                  <Text style={styles.buttonText}>ACCEPT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => updateStatus("reject")}
                >
                  <Text style={styles.buttonText}>REJECT</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>Loading ride details...</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
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
  acceptButton: {
    marginTop: 20,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rejectButton: {
    marginTop: 10,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DriverScreen;

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyDriver = functions.firestore
    .document("ride_requests/{requestId}")
    .onCreate(async (snapshot, context) => {
      const requestData = snapshot.data();
      const driverId = requestData.driver_id;

      // Fetch driver's FCM token from Firestore based on driverId
      const driverSnapshot = await admin.firestore()
          .collection("car_db")
          .doc(driverId)
          .get();
      const driverData = driverSnapshot.data();
      const driverToken = driverData.fcmToken; // Assuming you store

      // Create notification payload
      const payload = {
        notification: {
          title: "New Ride Request",
          body: "You have a new ride request!",
        },
        data: {
        // Additional data you want to send to the driver's app
          requestId: context.params.requestId,
        // Add more data fields as needed
        },
      };

      // Send FCM notification to the driver
      try {
        await admin.messaging().sendToDevice(driverToken, payload);
        console.log("Notification sent to driver");
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });

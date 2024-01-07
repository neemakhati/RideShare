const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyDriver = functions.firestore
    .document("ride_requests/{requestId}")
    .onCreate(async (snapshot, context) => {
      try {
        const requestData = snapshot.data();
        const driverId = requestData.driver_id;

        // Fetch driver's FCM token from Firestore based on driverId
        const driverSnapshot = await admin.firestore()
            .collection("car_db")
            .doc(driverId)
            .get();

        if (!driverSnapshot.exists) {
          console.error("Driver document not found");
          return;
        }

        const driverData = driverSnapshot.data();
        const driverToken = driverData.fcmToken;

        if (!driverToken) {
          console.error("Driver FCM token not found");
          return;
        }

        // Create notification payload
        const payload = {
          notification: {
            title: "New Ride Request",
            body: "You have a new ride request!",
          },
          data: {
            requestId: context.params.requestId,
          // Add more data fields as needed
          },
        };

        // Send FCM notification to the driver
        await admin.messaging().sendToDevice(driverToken, payload);
        console.log("Notification sent to driver");
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });


exports.notifyUser = functions.firestore.document("ride_requests/{requestId}")
    .onUpdate(async (change, context) => {
      const newData = change.after.data();
      const previousData = change.before.data();

      // Check if the status field has been updated
      if (newData.status !== previousData.status) {
        const requestingUserId = newData.user_id;

        // Fetch user's FCM token from Firestore based on requestingUserId
        const userSnapshot = await admin.firestore()
            .collection("users") // Replace with your users collection name
            .doc(requestingUserId)
            .get();

        if (!userSnapshot.exists) {
          console.error("User document not found");
          return;
        }

        const userData = userSnapshot.data();
        const userToken = userData.fcmToken;

        if (!userToken) {
          console.error("User FCM token not found");
          return;
        }

        const status = newData.status === "Accepted" ? "Accepted" : "Rejected";
        const action = status.toLowerCase();

        const payload = {
          notification: {
            title: `Ride ${status}`,
            body: `Your ride request has been ${action} by the driver.`,
          },
          token: userToken,
        };


        try {
          await admin.messaging().send(payload);
          console.log("Notification sent to user");
        } catch (error) {
          console.error("Error sending notification:", error);
        }
      }
    });

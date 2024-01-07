import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux';

const AcceptScreen = () => {
  const info = useSelector(state => state.info);
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      // Handle incoming notifications when the app is in the foreground
      console.log('Received notification:', remoteMessage.notification);
      setNotificationData(remoteMessage.notification);
    });

  

    return () => {
      unsubscribeForeground();
    };
  }, []);

  const closeModal = () => {
    setNotificationData(null);
    // Optionally, you can perform actions upon closing the modal
  };

  return (
    <View style={styles.container}>
      {notificationData && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={true} // Always visible when there's a notification
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>{notificationData.title}</Text>
              <Text>{notificationData.body}</Text>
              <TouchableOpacity style={styles.okButton} onPress={closeModal}>
                <Text>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      <Text>Waiting for the Driver's response</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  okButton: {
    marginTop: 20,
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

export default AcceptScreen;

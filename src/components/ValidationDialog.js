import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";

const ValidationDialog = ({ visible, message, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.dialog}>
          <Text style={styles.message}>{message}</Text>
          <Button title="OK" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    marginBottom: 20,
  },
});

export default ValidationDialog;

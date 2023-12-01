import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const AcceptScreen = () => {
  const info = useSelector(state => state.info);

  return (
    <View style={styles.container}>
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
});

export default AcceptScreen;

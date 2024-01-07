import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const FirstScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to {'\n'}Your App!</Text>

        <TouchableOpacity 
          style={[styles.roleButton, styles.passengerButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.roleButtonText}>Passenger</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleButton, styles.driverButton]}
          onPress={() => navigation.navigate('LoginDriver')}
        >
          <Text style={styles.roleButtonText}>Driver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2196F3',
    textAlign: 'center',
  },
  roleButton: {
    width: '100%', // Make the buttons take the full width of the container
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    backgroundColor: 'black',
    elevation: 3,
  },
  passengerButton: {
    marginTop: 15,
    backgroundColor: '#2196F3',
  },
  driverButton: {
    marginTop: 15,
    backgroundColor: '#2196F3',
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default FirstScreen;

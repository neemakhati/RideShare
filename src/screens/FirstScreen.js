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
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
    textAlign: 'center',
  },
  roleButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3498db',
    backgroundColor: 'blue', 
    elevation: 3,
  },
  passengerButton: {
    backgroundColor: 'blue', 
  },
  driverButton: {
    marginTop: 15,
    backgroundColor: 'blue', 
  },
  roleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default FirstScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RoleSelectionScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text>Sign Up Using</Text>
        <TouchableOpacity 
            style={{marginTop: 10}}
            onPress={() => navigation.navigate('SignUp')}
        >
            <Text style={styles.signUp}>SIGN UP as Passenger</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={{marginTop: 10}}
            onPress={() => navigation.navigate('SignUpDriver')}
        >
            <Text style={styles.signUp}>SIGN UP as Driver</Text>
        </TouchableOpacity> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  selectedRole: {
    backgroundColor: '#c0c0c0',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RoleSelectionScreen;

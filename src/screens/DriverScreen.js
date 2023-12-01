import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const DriverScreen = ({remoteMessage}) => {

    return (
        <View style={styles.container}>
        <View style={styles.avatarContainer}>
            <Image
            source={require('../../assets/avatar.png')}
            style={styles.avatar}
            />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.name}>{remoteMessage.data.name}</Text>
            <Text style={styles.rating}><Text style={{color: 'black'}}>Car Num: </Text>{remoteMessage.data.num}</Text>
            <Text style={styles.rating}><Text style={{color: 'black'}}>Phone: </Text> {remoteMessage.data.phone}</Text>
            <Text style={{fontSize: 18,
        color: 'black',
        marginVertical: 20, alignSelf: 'center'}}>Have a safe journey!</Text>
        </View>

        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 780,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  textContainer: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  rating: {
    fontSize: 18,
    color: 'gray',
    marginVertical: 5,
    alignSelf: 'flex-start'
  },
  button: {
    color: 'white',
    backgroundColor: 'rgb(95, 232, 120)',
    borderRadius: 17,
    padding: 7,
    width: '35%',
    marginVertical: 20
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
});

export default DriverScreen;

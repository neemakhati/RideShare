import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import firestore from '@react-native-firebase/firestore';

const DriverDetail = ({ name, num, distance, availableSeat, deleteItem, index, navigation, token, phone, uid }) => {
  const dispatch = useDispatch();
  const pToken = useSelector(state => state.token);
  const origin = useSelector(state => state.origin);
  const myName = useSelector(state => state.name);
  const myPhone = useSelector(state => state.phone);
  const destination = useSelector(state => state.destination);
  const myuid = useSelector(state => state.uid);

  const sendRideRequest = async (user_id, driver_id, origin, destination, user_name, driver_name, distance) => {
    const request = {
      user_id: user_id,
      driver_id: driver_id,
      status: 'pending', // Initial status
      timestamp: firestore.FieldValue.serverTimestamp(),
      origin: origin,
      destination: destination,
      user_name: user_name,
      driver_name: driver_name,
      distance: distance,
    };

    try {
      await firestore().collection('ride_requests').add(request);
      console.log('Ride request sent successfully!');
    } catch (error) {
      console.error('Error sending ride request:', error);
    }
  };

  return (
    <View style={styles.cardStyle}>
      <View style={styles.container}>
        <Image style={styles.imageStyle} source={require('../../assets/Car2.jpg')} />
        <View style={{ justifyContent: 'center' }}>
  <Text>
    <Text style={styles.boldText}>Name:</Text> {name}
  </Text>
  <Text>
    <Text style={styles.boldText}>Car Plate:</Text> {num}
  </Text>
  <Text>
    <Text style={styles.boldText}>Distance:</Text> {distance} Km
  </Text>
  <Text>
    <Text style={styles.boldText}>Available Seats:</Text> {availableSeat}
  </Text>
</View>

      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch({
              type: 'info', payload: {
                name: name,
                car_num: num,
                phone: phone
              }
            })
            navigation.navigate('Accept');
            sendRideRequest(myuid, uid, origin, destination, myName, name, distance)
          }}
        >
          <Text style={styles.buttonText}>REQUEST</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => deleteItem(index)}
        >
          <Text style={styles.rejectButtonText}>REJECT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    width: 80,
    height: 80,
    borderRadius: 80,
    margin: 10
  },
  container: {
    flexDirection: 'row'
  },
  cardStyle: {
    borderRadius: 10,
    marginBottom: 20,
    width: 350,
    backgroundColor: '#fff',
    elevation: 5,
    padding: 15,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 17,
    padding: 10,
    marginBottom: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: 'rgb(227, 57, 62)',
    borderRadius: 17,
    padding: 10,
    marginBottom: 10,
    width: '45%',
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default DriverDetail;

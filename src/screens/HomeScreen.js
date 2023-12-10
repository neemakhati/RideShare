import React, { useState, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle} from 'react-native-maps';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import * as Location from 'expo-location';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width/height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const HomeScreen = () => {
  console.log('this is home page');
  const uid = useSelector(state => state.uid);
  const [location, setLocation] = useState(null);
  const [seats, setSeats] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(true);

  useEffect(() => {
      (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
              console.log('Permission not granted');
          }

          const position = await Location.getCurrentPositionAsync();
          setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
          });
      })();
  }, []);

  const handleOKButtonPress = () => {
      firestore()
          .collection('car_db')
          .doc(uid)
          .update({
              location: {
                  latitude: location.latitude,
                  longitude: location.longitude,
              },
              seats: parseInt(seats, 10) || 0,
          });
      // setIsInputVisible(false);
      console.log('UID:', uid);

  };

  if (!location) {
      return null;
  }

  return (
      <View style={styles.container}>
          <MapView
              style={styles.map}
              region={location}
              showsUserLocation={true}
              followsUserLocation={true}
          >
              <Marker 
                  coordinate={location} 
                  draggable
                  onDragEnd={({ nativeEvent }) => {
                      setLocation(prev => ({
                          ...prev,
                          latitude: nativeEvent.coordinate.latitude,
                          longitude: nativeEvent.coordinate.longitude,
                      }));
                  }}
              />
              <Circle center={location} radius={500} />
          </MapView>

          <View style={styles.inputContainer}>
              <Text style={styles.label}>Available Seats:</Text>
              {isInputVisible && (
                  <TextInput
                      style={styles.input}
                      value={seats}
                      onChangeText={text => setSeats(text)}
                      keyboardType="numeric"
                  />
              )}
              <TouchableOpacity style={styles.button} onPress={handleOKButtonPress}>
                  <Text>OK</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
  },
  map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
  },
  inputContainer: {
      position: 'absolute',
      top: 20,
      left: 20,
      right: 20,
      width: '76%',
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 8,
      elevation: 3,
      flexDirection: 'row',  
      alignItems: 'center',  
      justifyContent: 'flex-start', 
  },
  label: {
      marginRight: 10,  
  },
  input: {
      flex: 1,
      borderBottomWidth: 1,
      borderBottomColor: 'black',
      padding: 5,
  },
  button: {
      marginLeft: 10,  
      padding: 10,
      backgroundColor: 'lightblue',
      borderRadius: 5,
  },
});

export default HomeScreen;





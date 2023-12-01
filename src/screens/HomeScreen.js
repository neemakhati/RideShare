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
    const uid = useSelector(state => state.uid);
   
    const [location, setLocation] = useState(null);
    useEffect(() => {
        (async () => {
    
          let {status} = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission not granted')
          }
    
          const position = await Location.getCurrentPositionAsync();
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          })
        })();


      }, [])

      if (!location) {
        return null;
      }
      
       firestore()
        .collection('car_db')
        .doc(uid)
        .update({
            location: {
              latitude: location.latitude,
              longitude: location.longitude
            }
        });
    
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
              onDragEnd={({nativeEvent}) => {
                setLocation(prev => ({
                  ...prev,
                  latitude: nativeEvent.coordinate.latitude,
                  longitude: nativeEvent.coordinate.longitude
                }))
              }}
            />
            <Circle center={location} radius={500} />
          </MapView>
        </View>
      );
    }
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
  });

export default HomeScreen;
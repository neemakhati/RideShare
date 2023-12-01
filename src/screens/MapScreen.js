import React, { useState, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_GOOGLE, LatLng, Marker, Callout, Circle} from 'react-native-maps';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Dimensions} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import store from '../store';
import firestore from '@react-native-firebase/firestore'; 

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width/height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type InputAutocompleteProps ={
    label:string;
    placeholder:string;
    onPlaceSelected: (details:GooglePlaceDetail|null)=>void;
};

function InputAutocomplete({
    label,
    placeholder,
    onPlaceSelected,
}:InputAutocompleteProps) {
    const dispatch = useDispatch();

    return(
        <>
            <Text>{label}</Text>
            <GooglePlacesAutocomplete
                    styles={{textInput: styles.input}}
                    placeholder={placeholder||""}
                    fetchDetails
                    onPress={(data, details = null) => {
                        if (label == 'Origin') {
                            dispatch({type: 'origin', payload: data.description});
                        }
                        else if (label == 'Destination') {
                            dispatch({type: 'destination', payload: data.description});
                        } 
                        onPlaceSelected(details);
                    }}
                    query={{
                        key: 'AIzaSyBSePaY3qzjJs0OewXv5KE_OmmSGfpt_nk',
                        language: 'en',
                    }}
                />
        </>
    );
}
const MapScreen = ({navigation}) => { 
    const dispatch = useDispatch();
    
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
    
    const [origin,setOrigin]=useState(null);
    const [destination,setDestination]=useState(null);
    const [seatNo, setSeatNo] = useState(null);

    const [showDirections,setShowDirections]=useState(false);

    const [distance,setDistance]=useState(0);
    const [duration,setDuration]=useState(0);

    if (!location) {
        return null;
    }

    const mapRef=useRef<MapView>(null)
    const moveTo=async(position:LatLng)=>{
        const camera= await mapRef.current?.getCamera()
        if (camera){
            camera.center=position;
            mapRef.current?.animateCamera(camera,{duration:1000})
        }
    };

    const edgePaddingValue=70;
    const edgePadding={
        top:edgePaddingValue,
        right:edgePaddingValue,
        buttom:edgePaddingValue,
        left:edgePaddingValue,
    };

    const traceRouteOnReady=(args)=>{
        if(args){
            setDistance(args.distance);
            setDuration(args.duration);
        }
    }
    const trackRoute=()=>{
        if(location&&destination){
            setShowDirections(true);
            mapRef.current?.fitToCoordinates([location,destination],{edgePadding});
        }
    }
    const onPlaceSelected=(
        details:GooglePlaceDetail|null,
        flag:"origin"|"destination"
    )=>{
        const set=flag==="origin"?setOrigin:setDestination
        const position={
            latitude:details?.geometry.location.lat || 0,
            longitude:details?.geometry.location.lng || 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }
        set(position);
        moveTo(position);


    };

    return(
        <View style={styles.container}>
            <MapView
                useRef={mapRef}
                style={styles.map}
                showsUserLocation={true}
                region={origin ? origin : location}
                followsUserLocation={true}
            >
                {origin ? <Marker coordinate={origin}/> : <Marker coordinate={location} />}
                {destination&&<Marker coordinate={destination}/>}
                {showDirections && (location&&destination || origin&&destination )&&
                (<MapViewDirections
                    origin={origin ? origin : location}
                    destination={destination}
                    apikey='AIzaSyAsB0o_NDhsStJEq1JBTEcAcrhiCgwMCh4'
                    strokeColor='#6644ff'
                    strokeWidth={4}
                    onReady={traceRouteOnReady}
                />)}
                {!origin && 
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
                }
            </MapView>
            <View style={styles.searchContainer}>
                <InputAutocomplete label='Origin' onPlaceSelected={(details)=>{
                    onPlaceSelected(details,"origin")
                }}/>
                <InputAutocomplete label='Destination' onPlaceSelected={(details)=>{
                    onPlaceSelected(details,"destination")
                }}/>
                <Text>Number of Seats: </Text>
                <TextInput
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={styles.inputStyle}
                    value={seatNo}
                    onChangeText={value => setSeatNo(value)}
                />
                <TouchableOpacity style={styles.button} onPress={trackRoute}>
                    <Text style={styles.buttonText}>Trace Route</Text>
                </TouchableOpacity>
                {distance&&duration?(
                    <View>
                        <Text>Distance: {distance.toFixed(2)}</Text>
                        <Text>Duration: {Math.ceil(duration)}mins</Text>
                    </View>
                ):null}
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {
                        dispatch({type: 'requiredSeat', payload: seatNo});
                        if (origin) {
                            dispatch({type: 'location', payload: origin});
                        }
                        else if (location) {
                            dispatch({type: 'location', payload: location});
                        }
                        navigation.navigate('Request');
                    }}
                >
                    
                    <Text style={styles.buttonText}>Request</Text>
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
    searchContainer: {
        position: "absolute",
        width:"90%",
        backgroundColor:"white",
        shadowColor:"black",
        shadowOffset:{width:2,height:2},
        shadowOpacity:0.5,
        shadowRadius:4,
        elevation:4,
        padding:8,
        borderRadius:8,
        top:40,
    },
    input: {
        borderColor:"#888",
        borderWidth:1,
    },
    button:{
        backgroundColor:"#bbb",
        paddingVertical:12,
        marginTop:16,
        borderRadius:4,
    },
    buttonText:{
        textAlign:"center",
    },
    inputStyle: {
        borderColor:"#888",
        borderWidth:1,
        padding:8,
        borderRadius:8,
    }

  });

export default MapScreen;
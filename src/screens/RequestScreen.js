import React from 'react';
import {Text,View, StyleSheet} from 'react-native';
import DriverDetail from '../components/DriverDetail';
import { useState, useEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { KNN } from '../KNN';
import store from '../store';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore'; 

export default function RequestScreen({navigation}){
    const requiredSeat = useSelector(state => state.requiredSeat);
    const location = useSelector(state => state.location);

    const [data, setData] = useState(null);
    const [locations, setLocations] = useState([]);
    const [snapSize, setSnapSize] = useState(0);

    useEffect(() => {
        async function getData() {
            const myArrary = [];
            try {
                const carSnapshot = await firestore().collection('car_db').get();
                carSnapshot.forEach(car => {
                    const carData = car.data();
                    if (carData.location && carData.location.latitude && carData.location.longitude) {
                        myArrary.push({
                            availableSeat: carData.seats || 0,
                            location: {
                                lat2: carData.location.latitude,
                                lon2: carData.location.longitude
                            },
                            name: carData.name || 'N/A',
                            num: carData.num || 'N/A',
                            phone: carData.phone || 'N/A',
                            token: carData.token || 'N/A',
                            distance: 0,
                        });
                    }
                });
            } catch (error) {
                console.error('Error fetching car data:', error);
            }
            return myArrary;
        }
        

        getData()
            .then(data => {
                const nearestNeighbors = KNN(data, {
                        requiredSeat: requiredSeat,
                        location: {
                            lat1: location.latitude,
                            lon1: location.longitude
                        }
                    }, 3);
                setData(nearestNeighbors);
            })
    }, []);

    const deleteItem = (index) => {
        const newData =[...data];
        newData.splice(index, 1);
        setData(newData);
    }
    

    return(
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={item => item.num}
                renderItem={({item, index}) => {
                    return (
                        <DriverDetail 
                            name={item.name}
                            num = {item.num}
                            distance = {item.distance}
                            availableSeat = {item.availableSeat}
                            deleteItem = {deleteItem}
                            index={index}
                            navigation={navigation}
                            token={item.token}
                            phone={item.phone}
                        />
                    )
                }}
                showsVerticalScrollIndicator={false}
            />
            {data != null && data?.length == 0 ? <Text>You are out of options</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 20
    }
})
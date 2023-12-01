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
            const carSnapshot = await firestore().collection('car_db').get();
            carSnapshot.forEach(car => {
                myArrary.push({
                    availableSeat: car.data().seats,
                    location: {
                        lat2: car.data().location.latitude,
                        lon2: car.data().location.longitude
                    },
                    name: car.data().name,
                    num: car.data().num,
                    phone: car.data().phone,
                    token: car.data().token,
                    distance: 0,
                });
            });
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
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const DriverDetail = ({ name, num, distance, availableSeat, deleteItem, index, navigation, token, phone }) => {
    const dispatch = useDispatch();
    const pToken = useSelector(state => state.token);
    const origin = useSelector(state => state.origin);
    const myName = useSelector(state => state.name);
    const myPhone = useSelector(state => state.phone);
    const destination = useSelector(state => state.destination);

    const sendNoti = ()=>{
        fetch('https://8a33-110-44-116-42.ngrok.io/send-noti',{
                method:'post',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    name: myName,
                    phone: myPhone,
                    origin: origin,
                    destination: destination,
                    dToken: token,
                    dName: name,
                    dPhone: phone,
                    dNum: num,
                    pToken: pToken
                })
            })
    }

    return(
        <View style={styles.cardStyle}>
            <View style={styles.container}>
                <Image style={styles.imageStyle} source={require('../../assets/Car2.jpg')} />
                <View style={{justifyContent: 'center'}}>
                    <Text>Name: {name}</Text>
                    <Text>Car Plate: {num}</Text>
                    <Text>Distance: {distance} Km</Text>
                    <Text>Available Seats: {availableSeat}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {
                        dispatch({type: 'info', payload: {
                            name: name,
                            car_num: num,
                            phone: phone
                        }})
                        navigation.navigate('Accept')
                        sendNoti();
                    }}

                >
                    <Text style={styles.buttonText}>REQUEST</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={{color: 'white', backgroundColor: 'rgb(227, 57, 62)', borderRadius: 17,
                    padding: 7, marginBottom: 10, width: '45%'}}
                    onPress={() => deleteItem(index)}
                >
                    <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 15,}}>REJECT</Text>
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
        backgroundColor: '#bbb'
    },
    button: {
        color: 'white',
        backgroundColor: 'rgb(95, 232, 120)',
        borderRadius: 17,
        padding: 7,
        marginBottom: 10,
        width: '45%'
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
})

export default DriverDetail;

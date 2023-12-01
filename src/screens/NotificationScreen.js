import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const NotificationScreen = ({handleNotification, remoteMessage}) => {

    const [visible, setVisible] = useState(false);

    const twoWayNoti = () =>{
        fetch('https://8a33-110-44-116-42.ngrok.io/two-way-noti',{
                method:'post',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    name: remoteMessage.data.dName,
                    num: remoteMessage.data.dNum,
                    phone: remoteMessage.data.dPhone,
                    token: remoteMessage.data.pToken
                })
            })
    }

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
            <Text style={styles.rating}><Text style={{color: 'black'}}>From: </Text>{remoteMessage.data.origin}</Text>
            <Text style={styles.rating}><Text style={{color: 'black'}}>To: </Text> {remoteMessage.data.destination}</Text>
            {visible && <Text style={styles.rating}><Text style={{color: 'black'}}>Phone: </Text> {remoteMessage.data.phone}</Text>}
            {visible && <Text style={{fontSize: 18,
        color: 'black',
        marginVertical: 20, alignSelf: 'center'}}>Have a safe journey!</Text>}
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '70%'}}>
                    {!visible && 
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => {
                                twoWayNoti();
                                setVisible(true);
                            }}
                        >
                            <Text style={styles.buttonText}>ACCEPT</Text>
                        </TouchableOpacity>
                    }
                    
                    {!visible && 
                    <TouchableOpacity 
                            style={{color: 'white', backgroundColor: 'rgb(227, 57, 62)', borderRadius: 17,
                            padding: 7, width: '35%', marginVertical: 20}}
                            onPress={() => handleNotification()}
                        >
                            <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 15,}}>REJECT</Text>
                        </TouchableOpacity> 
                    }

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
    marginVertical: 5
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

export default NotificationScreen;

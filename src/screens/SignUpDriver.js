import React,{useState} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons, AntDesign } from '@expo/vector-icons';
import RadioGroup from 'react-native-radio-buttons-group';
import { KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const SignUpDriver = ({ navigation }) => {
    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        num: '',
        password: '',
        confirmPassword: '',
    });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [nameError, setNameError] = useState('');
    const [cpasswordError, setCpasswordError] = useState('');
    const [numError, setnumError] = useState('');

    const validate = () => {
        
        let isError = false;
        const errors = {
            emailError: '',
            passwordError: '',
            phoneError:'',
            nameError:'',
            cpasswordError: '',
            numError: '',
        };
        const nameRegex = /^[a-zA-Z ]+$/;
        if (!nameRegex.test(data.name)) {
            isError = true;
            errors.nameError = 'Invalid name';
        }else{
            errors.nameError = '';
        }
        
        const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
        if (!phoneRegex.test(data.phone)) {
            isError = true;
            errors.phoneError = 'Invalid phone';
        }else{
            errors.phoneError = '';
        }

        if (!data.email.includes('@')) {
            isError = true;
            errors.emailError = 'Invalid email address';
        }else{
            errors.emailError = '';
        }
    
        if (data.password.length < 6) {
            isError = true;
            errors.passwordError = 'Password must be at least 6 characters';
        }else{
            errors.passwordError = '';
        }

        if (data.num.length < 4) {
            isError = true;
            errors.numError = 'Invalid car number';
        }else{
            errors.numError = '';
        }

        if(data.password != data.confirmPassword){
            isError = true;
            errors.cpasswordError = "Password doesn't match";
        }else{
            errors.cpasswordError = '';
        }
    
        if (isError) {
            setEmailError(errors.emailError);
            setPasswordError(errors.passwordError);
            setPhoneError(errors.phoneError);
            setNameError(errors.nameError);
            setnumError(errors.numError);
            setCpasswordError(errors.cpasswordError);
        }
    
        if (!isError) {
            handleSignUp();
        }
    }


    const handleSignUp = () => {
        auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User created with: ' + user.email);

                firestore()
                    .collection('car_db')
                    .doc(user.uid)
                    .set({
                        ...data,
                        uid: user.uid,
                        seats: 4,
                    })
                })
                navigation.navigate("Login");
    }

    return (
        <KeyboardAvoidingView>
            <ScrollView>
            <View style={styles.container}>
                <Text style={styles.heading}>Sign Up</Text>

                <Text style={{marginTop: 30}}>Full Name</Text>
                <View style={styles.inputContainer}>
                    <FontAwesome5 style={styles.icon} name="user" size={22} color="gray" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder='Type your full name'
                        value={data.name}
                        onChangeText={value => {setData(prev => ({...prev, name: value}))}}
                    />
                </View>
                {nameError ? <Text style={{color: 'red', fontSize: 13}}>{nameError}</Text> : null}

                <Text style={{marginTop: 10}}>Email</Text>
                <View style={styles.inputContainer}>
                    <MaterialIcons style={styles.icon} name="email" size={22} color="gray" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder='Type your email'
                        value={data.email}
                        onChangeText={value => {setData(prev => ({...prev, email: value}))}}

                    />
                </View>
                {emailError ? <Text style={{color: 'red', fontSize: 13}}>{emailError}</Text> : null}

                <Text style={{marginTop: 10}}>Phone</Text>
                <View style={styles.inputContainer}>
                    <AntDesign style={styles.icon} name="phone" size={22} color="gray" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder='Type your phone'
                        value={data.phone}
                        onChangeText={value => {setData(prev => ({...prev, phone: value}))}}
                    />
                </View>
                {phoneError ? <Text style={{color: 'red', fontSize: 13}}>{phoneError}</Text> : null}
                
                <Text style={{marginTop: 10}}>Car Number</Text>
                <View style={styles.inputContainer}>
                    <AntDesign style={styles.icon} name="car" size={22} color="gray" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder='Type your car number'
                        isPassword={true}
                        value={data.num}
                        onChangeText={value => {setData(prev => ({...prev, num: value}))}}
                    />
                </View>
                {numError ? <Text style={{color: 'red', fontSize: 13}}>{numError}</Text> : null}

                <Text style={{marginTop: 10}}>Password</Text>
                <View style={styles.inputContainer}>
                    <MaterialIcons style={styles.icon} name="lock-outline" size={22} color="gray" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder='Type your password'
                        isPassword={true}
                        value={data.password}
                        onChangeText={value => {setData(prev => ({...prev, password: value}))}}
                    />
                </View>
                {passwordError ? <Text style={{color: 'red', fontSize: 13}}>{passwordError}</Text> : null}

                <Text style={{marginTop: 10}}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                    <MaterialIcons style={styles.icon} name="lock-outline" size={22} color="gray" />
                    <TextInput
                        style={styles.inputStyle}
                        placeholder='Type your password'
                        value={data.confirmPassword}
                        isPassword={true}
                        onChangeText={value => {setData(prev => ({...prev, confirmPassword: value}))}}
                    />
                </View>
                {cpasswordError ? <Text style={{color: 'red', fontSize: 13}}>{cpasswordError}</Text> : null}

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {
                        validate();
                    }}>
                    <Text style={styles.buttonText}>SIGNUP</Text>
                    
                </TouchableOpacity>
                <View style={{alignItems: 'center', marginTop: 50}}>
                    <Text>Already a User?</Text>
                    <TouchableOpacity 
                        style={{marginTop: 10}}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.login}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
    </View>
            </ScrollView>
        </KeyboardAvoidingView>
        
    )
    
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        height: '75%',
        width: '80%',
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    inputStyle: {
        flex: 1,
    },
    icon: {
        marginHorizontal: 5,
        width: 25,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 10,
        alignItems: 'center',
        padding: 5
    },
    button: {
        color: 'white',
        backgroundColor: 'blue',
        borderRadius: 17,
        padding: 7,
        marginTop: 30,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
    login: {
        fontWeight: 'bold'
    }
});

export default SignUpDriver;
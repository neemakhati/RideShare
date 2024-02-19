import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useDispatch } from "react-redux";
import { Button } from "@rneui/themed";
const LoginDriver = ({ navigation }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = () => {
    let isValid = true;

    // Basic validation checks
    if (!email) {
      setEmailError("Please enter your email.");
      isValid = false;
    } else {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("Please enter your password.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // If isValid is false, return without attempting to log in
    if (!isValid) {
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(`Logged in with: ${user.email}`);

        const uid = user.uid;

        dispatch({ type: "uid", payload: uid });
        (async () => {
          const querySnapshot = await firestore()
            .collection("car_db")
            .doc(uid)
            .get();
          if (querySnapshot.exists) {
            messaging()
              .getToken()
              .then((token) => {
                firestore().collection("car_db").doc(uid).update({
                  fcmToken: token,
                });

                dispatch({
                  type: "token",
                  payload: querySnapshot.data().token,
                });
              });
            dispatch({ type: "name", payload: querySnapshot.data().name });
            dispatch({ type: "phone", payload: querySnapshot.data().phone });

            navigation.navigate("Home");
          }
          // else {
          //     messaging().getToken().then(token => {
          //         firestore()
          //             .collection('car_db')
          //             .doc(uid)
          //             .update({
          //                 token: token
          //             })
          //       });
          //       navigation.navigate('Home');
          // }
        })();
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <AntDesign
          name="login"
          size={45}
          color="#4b296b"
          style={styles.iconHead}
        />
        <Text style={styles.heading}>Login</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            style={styles.icon}
            name="email"
            size={22}
            color="#4b296b"
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Type your email"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
        </View>
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            style={styles.icon}
            name="lock-outline"
            size={22}
            color="#4b296b"
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Type your password"
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
        </View>
        {passwordError ? (
          <Text style={styles.error}>{passwordError}</Text>
        ) : null}
      </View>

      <Button
        onPress={handleLogin}
        buttonStyle={{ borderRadius: 10, marginTop: 10 }}
      >
        Login
      </Button>

      <Button
        onPress={() => navigation.navigate("SignUpDriver")}
        buttonStyle={{ borderRadius: 10, marginTop: 10 }}
      >
        SIGNUP
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    justifyContent: "center",
    height: "75%",
    width: "80%",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#4b296b",
    marginLeft: 10,
  },
  inputStyle: {
    flex: 1,
    color: "#4b296b",
  },
  icon: {
    marginHorizontal: 5,
    width: 25,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10,
    justifyContent: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    borderBottomWidth: 1,
    alignItems: "center",
    padding: 5,
  },
  error: {
    color: "#db5461",
  },
  label: {
    marginTop: 10,
    color: "#4b296b",
  },
  button: {
    color: "white",
    backgroundColor: "blue",
    borderRadius: 17,
    padding: 7,
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  signUp: {
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  iconHead: {
    marginRight: 3,
  },
});

export default LoginDriver;

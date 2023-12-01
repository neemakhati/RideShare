const admin = require('firebase-admin');

const express = require('express');

const app = express();

var serviceAccount = require("./carshare-f9266-firebase-adminsdk-ghw1t-bdef59f77d.json");

app.use(express.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.post('/send-noti', (req, res) => {
    const message={
        data:{
            name: req.body.name,
            origin: req.body.origin,
            destination: req.body.destination,
            phone: req.body.phone,
            dName: req.body.dName,
            dPhone: req.body.dPhone,
            dNum: req.body.dNum,
            pToken: req.body.pToken
        },
        token: req.body.dToken
    }
    
    admin.messaging().send(message).then(res=>{
        console.log("send success");
    }).catch(err=>{
        console.log(err)
    })
})

app.post('/two-way-noti', (req, res) => {
    const message={
        data:{
            name: req.body.name,
            num: req.body.num,
            phone: req.body.phone
        },
        token: req.body.token
    }
    
    admin.messaging().send(message).then(res=>{
        console.log("send success");
    }).catch(err=>{
        console.log(err)
    })
})


app.listen(3000, () => {
    console.log('Server Running')
})


const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const { RSA_NO_PADDING } = require('constants');

const app = express();
var PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

app.get('/*', (req, res, next) => {
    if (!req.url.includes("/api")) {
        res.sendFile(path.join(__dirname, '/public', req.url.substr(1) + '.html'), err => {
            if(err) res.status(404).send("File not found");
        });
    } else {
        next();
    }
});

app.get('/api/notes', (req, res) => {
    res.send(db);
});


app.post('/api/notes', (req, res) => {
    req.body.id = getNewID();
    db.push(req.body);
    fs.writeFile(path.join(__dirname, '/db', 'db.json'), JSON.stringify(db), err=>{
        err? res.status(500).send("Something went wrong, please try again later.") : res.json(req.body);
    });
});

app.listen(PORT, () => {
    console.log(`Now listening to port ${PORT}`);
});


function getNewID(){

    var newId = null;
    while(true){
        newId = Math.floor(Math.random()*999999999999);
        if(!db.find((e)=> e.id == newId)){
            return newId;
        }
    }
}
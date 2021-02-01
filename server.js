const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');

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
    console.log(req)
    req.body.id = getNewID();
    db.push(req.body);
    console.log(req.body)
    updateDb()? res.status(500).send("Something went wrong, please try again later.") : res.json(req.body);
});

app.delete('/api/notes/:id', (req, res)=>{
    var toDel = db.find((e)=> e.id == req.params.id);
    toDel? db.splice(db.indexOf(toDel),1) : null;
    updateDb()? res.status(500).send("Something went wrong, please try again later.") : res.send(`${toDel.id} was successfully deleted.`);
})



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


function updateDb(){
    fs.writeFile(path.join(__dirname, '/db', 'db.json'), JSON.stringify(db), err=>{
        return err;
    });
}
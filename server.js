const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');

const app = express();
var PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '/public'))); //Load public assets
app.use(express.json()); //interpret json body
app.use(express.urlencoded({extended: true})); //interprest url encoded post 

app.get('/*', (req, res, next) => { //for all requests
    if (!req.url.includes("/api")) {//if url does not contain 'api'
        res.sendFile(path.join(__dirname, '/public', req.url.substr(1) + '.html'), err => { //send html with the name of request if exists
            if(err) res.status(404).send("File not found"); //if not exists, send error message.
        });
    } else {
        next(); //if url does contain 'api', go to next middleware
    }
});

app.get('/api/notes', (req, res) => { //send all saved notes
    res.send(db);
});


app.post('/api/notes', (req, res) => { //save new note
    req.body.id = getNewID(); //assign random unique ID
    db.push(req.body); //add object to array
    updateDb()? res.status(500).send("Something went wrong, please try again later.") : res.json(req.body); //write array to db
});

app.delete('/api/notes/:id', (req, res)=>{ //delete note
    var toDel = db.find((e)=> e.id == req.params.id); //find object by id
    toDel? db.splice(db.indexOf(toDel),1) : null; //if found, remove from array, else do nothing
    updateDb()? res.status(500).send("Something went wrong, please try again later.") : res.send(`${toDel.id} was successfully deleted.`);// write array to db
})


app.listen(PORT, () => { //launch server
    console.log(`Now listening to port ${PORT}`);
});


function getNewID(){ //generate random unique ID

    var newId = null;
    while(true){
        newId = Math.floor(Math.random()*999999999999); //randomizer
        if(!db.find((e)=> e.id == newId)){ //if not exists return ID, else loop
            return newId;
        }
    }
}


function updateDb(){
    fs.writeFile(path.join(__dirname, '/db', 'db.json'), JSON.stringify(db), err=>{ //write array to file
        return err;
    });
}
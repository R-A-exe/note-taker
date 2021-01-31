const express = require('express');
const path = require('path');
const fs = require('fs');
const { nextTick } = require('process');

const app = express();
var PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '/public')));

app.get('/*', (req, res, next) => {
    if (!req.url.includes("/api")) {
        res.sendFile(path.join(__dirname, '/public/', req.url.substr(1) + '.html'), err => {
            if(err) res.status(404).send("File not found");
        });
    } else {
        next();
    }
});


app.listen(PORT, () => {
    console.log(`Now listening to port ${PORT}`);
});
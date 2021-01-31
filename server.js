const express = require('express');
const path = require('path');

const app = express();
var PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '/public')));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'notes.html'));
});

app.get('/*', (req, res) => {
    if (!req.url.includes("/api")) {
        res.sendFile(path.join(__dirname, '/public', req.url.substr(1) + '.html'), function (err) {
            res.status(404);
            res.send("File not found")
        });
    }
});




app.listen(PORT, () => {
    console.log(`Now listening to port ${PORT}`);
})


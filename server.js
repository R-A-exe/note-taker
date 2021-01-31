const express = require ('express');
const path = require ('path');

const app = express();
var PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, '/public')));

// app.get('/notes', (req, res)=>{
//     res.sendFile(path.join(public,'notes.html'));
// });

app.get('/*', (req, res)=>{
    // res.render(path.join(__dirname, 'public/', 'index.html'));
    // res.sendFile(path.join(__dirname, 'public/'));
});1


app.listen(PORT, ()=>{
    console.log(`Now listening to port ${PORT}`);
})


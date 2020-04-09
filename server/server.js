require('./config/config.js');

const express = require('express')
const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.json('Hello World')
})

app.get('/usuario', function(req, res) {
    res.json('get Usuario')
})

app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.json({
            ok: false,
            mensaje: 'indique el nombre del usuario'
        })
    } else {
        res.json({
            persona: body
        });
    }
})

app.put('/usuario/:id', function(req, res) {
    let idU = req.params.id;
    res.json({
        idU
    })
})

app.delete('/usuario', function(req, res) {
    res.json('delete World')
})


app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
})
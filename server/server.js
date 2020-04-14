require('./config/config.js');

const express = require('express')
const mongoose = require('mongoose');
const app = express()

app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;

    console.log('Base de datos ONLINE!!!');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
})
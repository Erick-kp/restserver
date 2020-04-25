const express = require('express')
const fs = require('fs')
const path = require('path')
const { verificaTokenImg } = require('../middlewares/autenticacion')

let app = express()

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo
    let img = req.params.img
    let laImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)

    if (!fs.existsSync(laImage)) {
        let noImage = path.resolve(__dirname, '../assets/original.jpg')
        res.sendFile(noImage)
    } else {
        res.sendFile(laImage)
    }

})



module.exports = app
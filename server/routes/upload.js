const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

const fs = require('fs')
const path = require('path')

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

app.use(fileUpload())

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo
    let id = req.params.id

    let misTipos = ['productos', 'usuarios']

    if (misTipos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos válidos son ' + misTipos.join(', ')
            }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha encontrado el archivo especificado'
            }
        })
    }

    let archivo = req.files.archivo
    let partes = archivo.name.split('.')
    let laExtension = partes[partes.length - 1]

    let misExtensiones = ['png', 'jpg', 'jpeg']

    if (misExtensiones.indexOf(laExtension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones válidas para el archivo son ' + misExtensiones.join(', '),
                extension: laExtension
            }
        })
    }

    let miImagen = `${id}-${new Date().getMilliseconds()}.${laExtension}`

    archivo.mv(`uploads/${tipo}/${miImagen}`, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo guardar el archivo en la ruta especificada'
                }
            })
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, miImagen, tipo)
        } else {
            imagenProducto(id, res, miImagen, tipo)
        }
    })
})

function imagenUsuario(id, res, miImagen, tipo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            borraImg(miImagen, tipo)

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {

            borraImg(miImagen, tipo)

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el usuario especificado'
                }
            })
        }

        borraImg(miImagen, tipo)

        usuarioDB.img = miImagen

        usuarioDB.save((err, usuarioIMG) => {
            res.json({
                ok: true,
                usuario: usuarioIMG,
                img: miImagen
            })
        })
    })
}

function imagenProducto(id, res, miImagen, tipo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {

            borraImg(miImagen, tipo)

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {

            borraImg(miImagen, tipo)

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el Producto especificado'
                }
            })
        }

        borraImg(miImagen, tipo)

        productoDB.img = miImagen

        productoDB.save((err, productoIMG) => {
            res.json({
                ok: true,
                producto: productoIMG,
                img: miImagen
            })
        })
    })
}

function borraImg(nombreImg, tipo) {

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`)

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }
}

module.exports = app
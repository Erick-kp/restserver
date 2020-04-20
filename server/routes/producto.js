const express = require('express')
const app = express()
const Producto = require('../models/producto')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

app.get('/producto', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) - 1 || 0
    let pagina = Number(req.query.pagina) || 0

    Producto.find({ estado: true })
        .skip(desde)
        .limit(pagina)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron registros ... verifique su información'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
})

app.get('/producto/buscar/:buscar', verificaToken, (req, res) => {

    let desde = Number(req.query.desde) - 1 || 0
    let pagina = Number(req.query.pagina) || 0

    let buscar = req.params.buscar
    let regex = new RegExp(buscar, 'i')

    Producto.find({ estado: true, nombre: regex })
        .skip(desde)
        .limit(pagina)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron registros ... verifique su información'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
})
app.post('/producto', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        estado: body.estado,
        precio: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
})

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'id nombre email')
        .populate('categoria', 'id nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return resizeTo.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encotró el Producto, revise su información'
                    }

                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
})

app.put('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = {
            nombre: req.body.nombre,
            precio: req.body.precio,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
            estado: req.body.estado
        } //_.pick(req.body, ['nombre', 'estado'])

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })
})

app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, ProductoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

module.exports = app;
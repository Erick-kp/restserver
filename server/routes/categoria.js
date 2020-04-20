const express = require('express')
const app = express()
const Categoria = require('../models/categoria')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({ estado: true })
        .sort('nombre')
        .populate('usuario', 'id nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categoria
            })
        })
})

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        estado: body.estado,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id)
        .populate('usuario', 'id nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!categoriaDB) {
                return resizeTo.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encotró la categoría, revise su información'
                    }

                })
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })
})

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = {
            nombre: req.body.nombre
        } //_.pick(req.body, ['nombre', 'estado'])

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
})

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Categoria.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, CategoriaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: CategoriaBorrado
        })
    })
})

module.exports = app;
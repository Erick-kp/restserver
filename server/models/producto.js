const mongoose = require('mongoose')

let Schema = mongoose.Schema

let productoSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'En nombre es necesario']
    },
    precio: {
        type: Number,
        require: [true, 'El Precio es necesario']
    },
    Descripcion: {
        type: String,
        requiere: false
    },
    estado: {
        type: Boolean,
        require: true,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

module.exports = mongoose.model('Producto', productoSchema)
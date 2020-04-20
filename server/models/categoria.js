const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Digite el nombre la categoria']
    },
    estado: {
        type: Boolean,
        required: [true, 'defina el etatus del usario'],
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.methods.toJSON = function() {
    let categoria = this;
    let categoriaObject = categoria.toObject();

    return categoriaObject;
}

module.exports = mongoose.model('Categoria', categoriaSchema)
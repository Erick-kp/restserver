const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role válido'
}

let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Digite el nombre del usuario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Digite el correo']
    },
    password: {
        type: String,
        required: [true, 'El password es requerido']
    },
    img: {
        type: String,
        required: [false]
    },
    role: {
        type: String,
        required: [true, 'El rol es requerido'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        required: [true, 'defina el etatus del usario'],
        default: true
    },
    google: {
        type: Boolean,
        required: [false, 'Puede logearse con su cuenta de google'],
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

module.exports = mongoose.model('Usuario', usuarioSchema)
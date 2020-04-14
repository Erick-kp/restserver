const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {
    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decode.usuario

        return next();
    })
}

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        return next()
    } else {
        return res.json({
            ok: false,
            message: 'El usuario no tiene los permisos par realizar esta operación'
        })
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}
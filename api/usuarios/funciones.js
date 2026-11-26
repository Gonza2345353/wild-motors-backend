const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SALT_ROUNDS, TOKEN_SECRET } = process.env;

async function hashPass(passNueva) {
    const hash = await bcrypt.hash(passNueva, parseInt(SALT_ROUNDS));
    return hash;
}

async function verificarPass(passNueva, passHash) {
    const coincide = await bcrypt.compare(passNueva, passHash);
    console.log({ coincide });
    return coincide;
}

function crearToken(usuario) {
    const payLoad = {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        acceso: Number(usuario.acceso)
    };

    const token = jwt.sign(payLoad, TOKEN_SECRET, { expiresIn: '2h' });
    return token;
}

module.exports = { hashPass, verificarPass, crearToken };

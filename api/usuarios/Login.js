const router = require('express').Router();
const db = require('../../db/index.js');
const { verificarPass, crearToken } = require('./funciones');

router.post('/', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const sql = `
            SELECT usuario_id, correo, nombre, rol, contrasena, acceso
            FROM usuarios
            WHERE correo = ?
        `;

        const [resultado] = await db.query(sql, [correo]);

        if (resultado.length === 0) {
            return res.status(401).send('Usuario no encontrado');
        }

        const usuario = resultado[0];
        const coincide = await verificarPass(contrasena, usuario.contrasena);

        if (!coincide) {
            return res.status(401).send('Contraseña incorrecta');
        }

        if (Number(usuario.acceso) !== 1) {
            return res.status(403).send('Tu cuenta no tiene acceso');
        }

        const token = crearToken(usuario);
        console.log('4. Token creado');

        res.status(200).json({
            usuario_id: usuario.usuario_id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
            acceso: usuario.acceso,
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
});

module.exports = router;

const router = require('express').Router();
const db = require('../../db/index.js');
const middlewareSeg = require('../middlewareSeg.js');

router.get('/', middlewareSeg({ rol: 'admin' }), async (req, res, next) => {
    try {
        const [disponibles] = await db.query('SELECT COUNT(*) AS cantidad FROM vehiculos WHERE estado_id = 1');
        const [reservados] = await db.query('SELECT COUNT(*) AS cantidad FROM vehiculos WHERE estado_id = 2');
        const [vehiculos] = await db.query('SELECT COUNT(*) AS cantidad FROM vehiculos');
        const [usuarios] = await db.query('SELECT COUNT(*) AS cantidad FROM usuarios');

        res.json({
            disponibles: disponibles[0].cantidad,
            reservados: reservados[0].cantidad,
            vehiculoscant: vehiculos[0].cantidad,
            usuarioscant: usuarios[0].cantidad
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al obtener las cantidades' });
    }
});

module.exports = router;

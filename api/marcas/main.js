const router = require('express').Router();
const db = require('../../db/index.js');
const middlewareSeg = require('../middlewareSeg.js');

router.get('/', async (req, res, next) => {
    try {
      const [marcas] = await db.query(`
      SELECT m.marca_id, m.nombre, m.descripcion, COUNT(v.vehiculo_id) AS cantidad_vehiculos
      FROM marca m
      LEFT JOIN vehiculos v ON v.marca_id = m.marca_id
      GROUP BY m.marca_id, m.nombre, m.descripcion
      ORDER BY m.nombre
    `);

        res.json({ marcas: marcas });
    } catch (err) {
        next(err);
    }
});

router.post('/', middlewareSeg({ rol: 'admin' }), async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;

        const [resultado] = await db.query('INSERT INTO marca SET ?', { nombre, descripcion });

        res.status(201).json({ marca_id: resultado.insertId, nombre, descripcion });
    } catch (err) {
        next(err);
    }
});

router.put('/:id', middlewareSeg({ rol: 'admin' }), async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const id = req.params.id;

        await db.query(
            'UPDATE marca SET nombre = ?, descripcion = ? WHERE marca_id = ?',
            [nombre, descripcion, id]
        );

        res.json({ marca_id: Number(id), nombre, descripcion });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', middlewareSeg({ rol: 'admin' }), async (req, res, next) => {
    try {
        const id = req.params.id;
        await db.query('DELETE FROM marca WHERE marca_id = ?', [id]);
        res.json({ marca_id: Number(id) });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
const router = require('express').Router();
const db = require('../../db.js');
const middlewareSeg = require('../middlewareSeg.js');

router.get('/',middlewareSeg({rol: 'admin'}), (req, res, next) => {
   db.query('SELECT * FROM consultas')
   .then(([consultas, campos]) => {
      res.status(200).json({consultas});
      if (consultas.length === 0) {
        res.status(404).json({ message: 'No se encontraron consultas' });
      }
    })
   .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener las consultas' });
    })
});

router.get('/:usuario_id',middlewareSeg({rol: 'cliente'}), (req, res, next) => {
   db.query('SELECT * FROM consultas WHERE usuario_id = ?', [req.params.usuario_id])
   .then(([consultas, campos]) => {
      res.status(200).json({consultas});
      if (consultas.length === 0) {
        res.status(404).json({ message: 'No se encontraron consultas' });
      }
    })
   .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Error al obtener las consultas' });
    })
});

router.post('/', (req, res, next) => {
    const {usuario_id, nombre, telefono, correo_electronico, asunto, mensaje} = req.body;
    const sql = ('INSERT INTO consultas (usuario_id, nombre, telefono, correo_electronico, asunto, mensaje) VALUES (?, ?, ?, ?, ?, ?)')
    
    db.query(sql, [usuario_id, nombre, telefono, correo_electronico, asunto, mensaje])
    .then(([result]) => {
        res.status(201).json({ message: 'Consulta creada exitosamente', consulta_id: result.insertId });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: 'Error al crear la consulta' });
    })
});

router.put('/:consulta_id', (req, res, next) => {
    const {consulta_id} = req.params;
    const {usuario_id, nombre, telefono, correo_electronico, asunto, mensaje} = req.body;
    const sql = ('UPDATE consultas SET usuario_id = ?, nombre = ?, telefono = ?, correo_electronico = ?, asunto = ?, mensaje = ? WHERE consulta_id = ?')
    db.query(sql, [usuario_id, nombre, telefono, correo_electronico, asunto, mensaje, consulta_id])
    .then(([result]) => {
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Consulta no encontrada' });
        } else {
            res.status(200).json({ message: 'Consulta actualizada exitosamente' });
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar la consulta' });
    })
});

router.delete('/:consulta_id', (req, res, next) => {
    const {consulta_id} = req.params;
    const sql = ('DELETE FROM consultas WHERE consulta_id = ?')
    db.query(sql, [consulta_id])
    .then(([result]) => {
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Consulta no encontrada' });
        }
        else {
            res.status(200).json({ message: 'Consulta eliminada exitosamente' });
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar la consulta' });
    })
});

module.exports = router;
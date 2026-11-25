
const router = require('express').Router()
const db = require('../../db/index.js')
const middlewareSeg = require('../middlewareSeg.js')

// Obtener consultas según el rol

router.get('/', middlewareSeg(), (req, res) => {
    let sql
    let parametros = []

    if (req.usuario.rol === 'cliente') {
        sql = 'SELECT * FROM consulta WHERE usuario_id = ?'
        parametros = [req.usuario.usuario_id]
    } else if (req.usuario.rol === 'admin') {
        sql = 'SELECT * FROM consulta'
    }

    db.query(sql, parametros)
        .then(([consultas]) => {
            res.status(200).json({ consultas })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: 'Error al obtener las consultas' })
        })
})


// Crear consulta
router.post('/', middlewareSeg({ rol: 'cliente' }), (req, res) => {
    const { nombre, telefono, correo_electronico, asunto, mensaje } = req.body
    const usuario_id = req.usuario.usuario_id

    const sql = `
    INSERT INTO consulta
    (usuario_id, nombre, telefono, correo_electronico, asunto, mensaje)
    VALUES (?, ?, ?, ?, ?, ?)
  `

    db.query(sql, [usuario_id, nombre, telefono, correo_electronico, asunto, mensaje])
        .then(([result]) => {
            res.status(201).json({
                message: 'Consulta creada exitosamente',
                consulta_id: result.insertId
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: 'Error al crear la consulta' })
        })
})

// Editar consulta
router.put('/:consulta_id', middlewareSeg({ rol: 'cliente' }), (req, res) => {
    const { consulta_id } = req.params
    const { asunto, mensaje } = req.body
    const usuario_id = req.usuario.usuario_id

    const sql = `
    UPDATE consulta
    SET asunto = ?, mensaje = ?
    WHERE consulta_id = ? AND usuario_id = ?
  `

    db.query(sql, [asunto, mensaje, consulta_id, usuario_id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Consulta no encontrada' })
            }

            res.status(200).json({ message: 'Consulta actualizada exitosamente' })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: 'Error al actualizar la consulta' })
        })
})

// Eliminar consulta
router.delete('/:consulta_id', middlewareSeg({ rol: 'cliente' }), (req, res) => {
    const { consulta_id } = req.params
    const usuario_id = req.usuario.usuario_id

    const sql = `
    DELETE FROM consulta
    WHERE consulta_id = ? AND usuario_id = ?
  `

    db.query(sql, [consulta_id, usuario_id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Consulta no encontrada' })
            }

            res.status(200).json({ message: 'Consulta eliminada exitosamente' })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: 'Error al eliminar la consulta' })
        })
})

module.exports = router

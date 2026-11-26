const router = require('express').Router()
const db = require('../../db/index.js')
const { hashPass } = require('./funciones')
const middlewareSeg = require('../middlewareSeg.js')

router.get('/', middlewareSeg({ rol: 'admin' }), function (req, res) {

  const sql = 'SELECT usuario_id, nombre, correo, acceso FROM usuarios'

  db.query(sql)
    .then(([usuarios]) => {
      res.status(200).json({ usuarios: usuarios })
    })
    .catch((error) => {
      console.error('Error al obtener los usuarios:', error)
      res.status(500).send('Error al obtener los usuarios')
    })

})

// Crear usuario
router.post('/', function (req, res) {

  const { nombre, correo, contrasena } = req.body

  hashPass(contrasena)
    .then((hash) => {
      const sql = 'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)'
      return db.query(sql, [nombre, correo, hash])
    })
    .then(() => {
      res.status(201).json({ message: 'Usuario creado' })
    })
    .catch((error) => {
      console.error('Error al crear el usuario:', error)
      res.status(500).send('Error al crear el usuario')
    })

})

// Modificar acceso
router.put('/acceso/:usuario_id', middlewareSeg({ rol: 'admin' }), function (req, res) {

  const { usuario_id } = req.params
  const { acceso } = req.body

  if (typeof acceso !== 'boolean' && acceso !== 0 && acceso !== 1) {
    return res.status(400).json({ message: 'El acceso debe ser booleano' })
  }

  const sql = 'UPDATE usuarios SET acceso = ? WHERE usuario_id = ?'

  db.query(sql, [Number(acceso), usuario_id])
    .then(([resultado]) => {
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      res.status(200).json({ message: 'Acceso actualizado' })
    })
    .catch((error) => {
      console.error('Error al actualizar el acceso:', error)
      res.status(500).send('Error al actualizar el acceso')
    })

})

module.exports = router
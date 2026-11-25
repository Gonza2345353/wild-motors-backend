const router = require('express').Router();
const db = require('../../db/index.js');

router.get('/', function (req, res) {

    const sql = 'SELECT * FROM tipo_vehiculos';

    db.query(sql)
        .then(([tipos]) => {
            res.status(200).json({ tipo_vehiculos: tipos });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error al obtener los tipos de vehículos');
        });

});

module.exports = router;

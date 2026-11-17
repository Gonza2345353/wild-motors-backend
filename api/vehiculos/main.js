const router = require('express').Router();
const db = require('../../db/index.js');

router.get('/' , async (req, res , next) => {
  db.query('SELECT * FROM vehiculos')
  .then(async ([vheiculos, campos]) => {
    const [rows] = await db.query('SELECT * FROM vehiculos');
    res.json(rows);
  })
  .catch( (error) => {
    next(error);
  })
});

module.exports = router;
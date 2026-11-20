
const router = require("express").Router();

const usuariosLoginRouter = require("./usuarios/login.js");
const usuariosRouter = require("./usuarios/main.js");
const vehiculosRouter = require("./vehiculos/main.js");
const consultasRouter = require("./consultas/main.js");


router.use("/vehiculos", vehiculosRouter);
router.use("/consultas", consultasRouter);
router.use("/usuarios/login", usuariosLoginRouter);
router.use("/usuarios", usuariosRouter);

module.exports = router;

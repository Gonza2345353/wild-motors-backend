
const router = require("express").Router();

const usuariosLoginRouter = require("./usuarios/Login.js");
const usuariosRouter = require("./usuarios/main.js");
const vehiculosRouter = require("./vehiculos/main.js");
const textosRouter = require("./textos/main.js");
const consultasRouter = require("./consultas/main.js");
const imagenesVehiculosRouter = require("./imagenes_vehiculos/main.js");

const middlewareSeg = require("./middlewareSeg.js");

router.use("/vehiculos", vehiculosRouter);
router.use("/textos", textosRouter);
router.use("/consultas", consultasRouter);
router.use("/imagenes_vehiculos", imagenesVehiculosRouter);

router.use("/usuarios/login", usuariosLoginRouter);
router.use("/usuarios", usuariosRouter);

module.exports = router;

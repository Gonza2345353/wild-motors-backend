require('dotenv').config();
const express = require('express');
const app = express();
const apiRouter = require('./api/main.js')
const {PORT} = process.env;
const paht = require('path');

app.use(express.json());
app.use("/api", apiRouter);

app.use(function(req, res, next) {
  console.log(`El usuario intenta acceder a: ${req.path}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto...... ${PORT}`);
  
});
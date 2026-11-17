const router = require('express').Router();
const fileupload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const db = require('../../db/index.js');

const dirArchivos = path.join(__dirname, '..', '..', 'archivos');
const EXT_PERMITIDAS = ['.png', '.jpg', '.jpeg', '.webp'];
const MAX_IMAGENES = 9;

router.use(fileupload({
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB por imagen
}));

const moverArchivo = (file, ruta) =>
  new Promise((resolve, reject) => {
    file.mv(ruta, (error) => (error ? reject(error) : resolve()));
  });

// GET: todas las imágenes de un vehículo (antes de las rutas con /:algo)
router.get("/vehiculo/:vehiculo_id", async function (req, res) {
  try {
    const [filas] = await db.query(
      "SELECT imagen_vehiculo_id, url_imagen, tipo_vista, orden FROM imagenes_vehiculos WHERE vehiculo_id = ? ORDER BY orden",
      [req.params.vehiculo_id]
    );
    res.json(filas);
  } catch (error) {
    console.error(error);
    res.status(500).send("ocurrio un error");
  }
});

// GET: un archivo por nombre
router.get("/archivo/:nombre", function (req, res) {
  const nombre = path.basename(req.params.nombre); // evita ../
  const rutaCompleta = path.join(dirArchivos, nombre);

  if (fs.existsSync(rutaCompleta)) {
    res.sendFile(rutaCompleta);
  } else {
    res.status(404).send("no existe el archivo");
  }
});

// POST: guarda hasta 9 imágenes de un vehículo
router.post("/:vehiculo_id", async function (req, res) {
  const guardadosEnDisco = []; // para limpiar si algo falla

  try {
    const { vehiculo_id } = req.params;

    // 1) Que el vehículo exista
    const [veh] = await db.query("SELECT vehiculo_id FROM vehiculos WHERE vehiculo_id = ?", [vehiculo_id]);
    if (veh.length === 0) {
      return res.status(404).send("el vehículo no existe");
    }

    // 2) Que lleguen archivos
    if (!req.files || !req.files.imagenes) {
      return res.status(400).send("no hay archivos");
    }

    let archivos = req.files.imagenes;
    if (!Array.isArray(archivos)) archivos = [archivos];

    let tipos = req.body.tipos || [];
    if (!Array.isArray(tipos)) tipos = [tipos];

    if (archivos.length > MAX_IMAGENES) {
      return res.status(400).send(`máximo ${MAX_IMAGENES} imágenes`);
    }

    // 3) Validar TODAS antes de guardar ninguna
    for (const archivo of archivos) {
      const ext = path.extname(archivo.name).toLowerCase();
      if (!EXT_PERMITIDAS.includes(ext)) {
        return res.status(400).send("formato no permitido: " + archivo.name);
      }
      if (archivo.truncated) {
        return res.status(400).send("la imagen supera los 5 MB: " + archivo.name);
      }
    }

    // 4) Guardar en disco y en la BD
    const guardadas = [];

    for (const [i, archivo] of archivos.entries()) {
      const ext = path.extname(archivo.name).toLowerCase();
      const nombre = `${vehiculo_id}_${Date.now()}_${i}${ext}`;
      const rutaCompleta = path.join(dirArchivos, nombre);

      await moverArchivo(archivo, rutaCompleta);
      guardadosEnDisco.push(rutaCompleta);

      const imagen = {
        vehiculo_id,
        url_imagen: nombre,
        tipo_vista: tipos[i] || null,
        orden: i + 1,
      };

      await db.query("INSERT INTO imagenes_vehiculos SET ?", imagen);
      guardadas.push(imagen);
    }

    res.status(201).json({ ok: true, imagenes: guardadas });
  } catch (error) {
    console.error(error);
    // limpiar archivos que alcanzaron a guardarse
    guardadosEnDisco.forEach((ruta) => fs.existsSync(ruta) && fs.unlinkSync(ruta));
    res.status(500).send("ocurrio un error");
  }
});

// DELETE: borra todas las imágenes de un vehículo (BD + disco)
router.delete("/:vehiculo_id", async function (req, res) {
  try {
    const { vehiculo_id } = req.params;
    const [filas] = await db.query(
      "SELECT url_imagen FROM imagenes_vehiculos WHERE vehiculo_id = ?", [vehiculo_id]
    );

    filas.forEach(({ url_imagen }) => {
      const ruta = path.join(dirArchivos, path.basename(url_imagen));
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    });

    await db.query("DELETE FROM imagenes_vehiculos WHERE vehiculo_id = ?", [vehiculo_id]);
    res.send("ok");
  } catch (error) {
    console.error(error);
    res.status(500).send("ocurrio un error");
  }
});

module.exports = router;
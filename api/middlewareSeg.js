const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = process.env;

function middlewareSeg({ rol } = {}) {

    return function (req, res, next) {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).send("Token no proporcionado");
        }

        try {
            const usuario = jwt.verify(token, TOKEN_SECRET);

            if (rol && usuario.rol !== rol) {
                return res.status(403).send("No tenés permisos");
            }

            req.usuario = usuario;

            next();

        } catch (error) {
            return res.status(401).send("Token inválido o vencido");
        }
    };
}

module.exports = middlewareSeg;
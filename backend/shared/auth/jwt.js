const jwt = require("jsonwebtoken");

const SECRET = "super_secret_key";

function generarToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "8h" });
}

function verificarToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  generarToken,
  verificarToken
};
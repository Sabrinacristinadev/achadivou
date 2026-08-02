const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const COOKIE_NAME = "achadivou_session";
const SECRET = process.env.JWT_SECRET || "dev-secret-troque-em-producao";

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function signSession(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

function verifySessionToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// Lê e valida a sessão a partir de um objeto Request do App Router (usa a API de cookies do Next)
function getSessionFromRequest(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

module.exports = {
  COOKIE_NAME,
  hashPassword,
  comparePassword,
  signSession,
  verifySessionToken,
  getSessionFromRequest,
};

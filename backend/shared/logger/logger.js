function log(mensaje) {
  console.log(`[${new Date().toISOString()}] ${mensaje}`);
}

module.exports = {
  log
};
// ============================================================
//  middlewares/logger.js
//  Loggea cada request con método, path, IP y tiempo de respuesta
// ============================================================

const logger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const ms      = Date.now() - start;
    const status  = res.statusCode;
    const color   = status >= 500 ? '\x1b[31m'   // rojo
                  : status >= 400 ? '\x1b[33m'   // amarillo
                  : status >= 300 ? '\x1b[36m'   // cyan
                  :                 '\x1b[32m';  // verde
    const reset   = '\x1b[0m';
    const time    = new Date().toLocaleTimeString('es-AR');

    console.log(
      `${color}[${time}] ${method.padEnd(6)} ${originalUrl.padEnd(30)} ${status}  ${ms}ms  ${ip}${reset}`
    );
  });

  next();
};

module.exports = logger;

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith(4) ? 'fail' : 'error';
  }
}

module.exports = AppError;

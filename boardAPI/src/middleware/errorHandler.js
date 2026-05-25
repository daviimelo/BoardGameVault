export const errorHandler = (err, req, res, next) => {
  console.error("Erro capturado:", err);

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: "Erro de validação",
      error: err.message
    });
  }

  // Erro de autenticação
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: "Não autorizado",
      error: err.message
    });
  }

  // Erro genérico
  return res.status(err.status || 500).json({
    message: err.message || "Erro interno do servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
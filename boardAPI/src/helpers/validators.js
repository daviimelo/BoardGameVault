export const validators = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  hasRequiredFields: (data, requiredFields) => {
    return requiredFields.every(field => data[field] && data[field].toString().trim() !== '');
  },

  isValidPlayerRange: (players) => {
    return /^\d+(-\d+)?$/.test(players.trim());
  },

  isValidNumber: (value) => {
    return !isNaN(value) && value !== null && value !== '';
  }
};

/* Respostas de erro padrão */

export const errorMessages = {
  MISSING_FIELDS: "Preencha todos os campos obrigatórios.",
  INVALID_EMAIL: "Formato de email inválido.",
  INVALID_PASSWORD: "A senha deve ter no mínimo 6 caracteres.",
  PASSWORD_MISMATCH: "As senhas não coincidem.",
  EMAIL_EXISTS: "Este email já está registrado.",
  USER_NOT_FOUND: "Usuário não encontrado.",
  GAME_NOT_FOUND: "Jogo não encontrado.",
  UNAUTHORIZED: "Você não tem permissão para realizar essa ação.",
  INVALID_STATUS: "Status inválido.",
  INVALID_PLAYERS: "Número de jogadores deve ser um valor ou intervalo.",
  INVALID_PLAYTIME: "Tempo de partida deve ser um número.",
  TOKEN_NOT_PROVIDED: "Token não informado.",
  INVALID_TOKEN: "Token inválido ou expirado."
};
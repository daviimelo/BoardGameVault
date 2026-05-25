import { gameService } from '../services/gameService.js';
import { validators, errorMessages } from '../helpers/validators.js';
import { VALID_STATUSES } from '../constants/gameStatus.js';

const validateGameData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push("Nome do jogo é obrigatório.");
  }
  if (!data.category || data.category.trim() === '') {
    errors.push("Categoria é obrigatória.");
  }
  if (!data.players || data.players.trim() === '') {
    errors.push("Número de jogadores é obrigatório.");
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status inválido. Valores aceitos: ${VALID_STATUSES.join(', ')}`);
  }

  if (data.players && !validators.isValidPlayerRange(data.players)) {
    errors.push(errorMessages.INVALID_PLAYERS);
  }

  if (data.playTime && !validators.isValidNumber(data.playTime)) {
    errors.push(errorMessages.INVALID_PLAYTIME);
  }

  return errors;
};

export const listGames = async (req, res) => {
  try {
    const userId = req.user.id;

    const games = await gameService.getByUserId(userId);

    return res.status(200).json({
      message: "Jogos listados com sucesso!",
      count: games.length,
      games
    });

  } catch (error) {
    console.error("Erro ao listar jogos:", error);
    return res.status(500).json({
      message: "Erro ao listar jogos.",
      error: error.message
    });
  }
};

export const getGameDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const game = await gameService.getById(id);

    if (!game) {
      return res.status(404).json({ message: errorMessages.GAME_NOT_FOUND });
    }

    if (game.userId !== userId) {
      return res.status(403).json({ message: errorMessages.UNAUTHORIZED });
    }

    return res.status(200).json({
      message: "Jogo encontrado!",
      game
    });

  } catch (error) {
    console.error("Erro ao obter detalhes do jogo:", error);
    return res.status(500).json({
      message: "Erro ao obter detalhes do jogo.",
      error: error.message
    });
  }
};

export const createGame = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, category, players, playTime, status, notes } = req.body;

    const errors = validateGameData({ name, category, players, playTime, status });
    if (errors.length > 0) {
      return res.status(400).json({ message: "Erros de validação.", errors });
    }

    const newGame = await gameService.create({
      userId,
      name: name.trim(),
      category: category.trim(),
      players: players.trim(),
      playTime: playTime ? parseInt(playTime) : null,
      status: status || 'quero jogar',
      notes: notes ? notes.trim() : ''
    });

    return res.status(201).json({
      message: "Jogo criado com sucesso!",
      game: newGame
    });

  } catch (error) {
    console.error("Erro ao criar jogo:", error);
    return res.status(500).json({
      message: "Erro ao criar jogo.",
      error: error.message
    });
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, category, players, playTime, status, notes } = req.body;

    const errors = validateGameData({ name, category, players, playTime, status });
    if (errors.length > 0) {
      return res.status(400).json({ message: "Erros de validação.", errors });
    }

    const game = await gameService.getById(id);

    if (!game) {
      return res.status(404).json({ message: errorMessages.GAME_NOT_FOUND });
    }

    if (game.userId !== userId) {
      return res.status(403).json({ message: errorMessages.UNAUTHORIZED });
    }

    const updatedGame = await gameService.update(id, {
      name: name.trim(),
      category: category.trim(),
      players: players.trim(),
      playTime: playTime ? parseInt(playTime) : null,
      status: status || game.status,
      notes: notes ? notes.trim() : ''
    });

    return res.status(200).json({
      message: "Jogo atualizado com sucesso!",
      game: updatedGame
    });

  } catch (error) {
    console.error("Erro ao atualizar jogo:", error);
    return res.status(500).json({
      message: "Erro ao atualizar jogo.",
      error: error.message
    });
  }
};

export const updateGameStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: errorMessages.INVALID_STATUS });
    }

    const game = await gameService.getById(id);

    if (!game) {
      return res.status(404).json({ message: errorMessages.GAME_NOT_FOUND });
    }

    if (game.userId !== userId) {
      return res.status(403).json({ message: errorMessages.UNAUTHORIZED });
    }

    const updatedGame = await gameService.update(id, { status });

    return res.status(200).json({
      message: "Status atualizado com sucesso!",
      game: updatedGame
    });

  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return res.status(500).json({
      message: "Erro ao atualizar status.",
      error: error.message
    });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const game = await gameService.getById(id);

    if (!game) {
      return res.status(404).json({ message: errorMessages.GAME_NOT_FOUND });
    }

    if (game.userId !== userId) {
      return res.status(403).json({ message: errorMessages.UNAUTHORIZED });
    }

    const deletedGame = await gameService.delete(id);

    return res.status(200).json({
      message: "Jogo deletado com sucesso!",
      game: deletedGame
    });

  } catch (error) {
    console.error("Erro ao deletar jogo:", error);
    return res.status(500).json({
      message: "Erro ao deletar jogo.",
      error: error.message
    });
  }
};

export const searchGames = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, category, players, playTime, status } = req.query;

    const games = await gameService.search(userId, {
      name,
      category,
      players,
      playTime,
      status
    });

    return res.status(200).json({
      message: "Busca realizada com sucesso!",
      count: games.length,
      games
    });

  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return res.status(500).json({
      message: "Erro ao buscar jogos.",
      error: error.message
    });
  }
};

export const getGameStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await gameService.getStats(userId);

    return res.status(200).json({
      message: "Estatísticas obtidas com sucesso!",
      ...stats
    });

  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return res.status(500).json({
      message: "Erro ao obter estatísticas.",
      error: error.message
    });
  }
};
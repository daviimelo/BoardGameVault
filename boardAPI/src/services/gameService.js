import { readJSON, writeJSON } from '../utils/jsonSalvar.js';
import { paths } from '../config/paths.js';

// Função auxiliar para verificar o intervalor de jogadores
const verificaIntervaloJogadores = (jogadoresDoJogo, buscaJogadores) => {
    if (!jogadoresDoJogo || !buscaJogadores) return false;

    const numeroBuscado = parseInt(buscaJogadores);
    if (isNaN(numeroBuscado)) return false;

    const strJogadores = jogadoresDoJogo.toString().replace(/\s/g, '');
    
    let min = 0;
    let max = Infinity;

    if (strJogadores.includes('-')) {
        const partes = strJogadores.split('-');
        min = parseInt(partes[0]) || 0;
        max = parseInt(partes[1]) || Infinity;
    } else if (strJogadores.includes('+')) {
        min = parseInt(strJogadores.replace('+', '')) || 0;
    } else {
        min = parseInt(strJogadores) || 0;
        max = min; 
    }

    // Logica para pesquisar o intervalo de jogadores -> Se o usuário digitar 7 ele retorna true se o intervalo for 1-10
    return numeroBuscado >= min && numeroBuscado <= max;
};

export const gameService = {
  /* Obter todos os jogos */
  getAll: async () => {
    return await readJSON(paths.games);
  },

  /* Obter jogos de um usuário específico */
  getByUserId: async (userId) => {
    const games = await readJSON(paths.games);
    return games.filter(game => game.userId === userId);
  },

  /* Obter jogo por ID */
  getById: async (id) => {
    const games = await readJSON(paths.games);
    return games.find(g => g.id === id);
  },

  /* Criar novo jogo */
  create: async (gameData) => {
    const games = await readJSON(paths.games);

    const newGame = {
      id: (Math.max(...games.map(g => parseInt(g.id) || 0), 0) + 1).toString(),
      ...gameData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    games.push(newGame);
    await writeJSON(paths.games, games);

    return newGame;
  },

  /* Atualizar jogo */
  update: async (id, updates) => {
    const games = await readJSON(paths.games);
    const index = games.findIndex(g => g.id === id);

    if (index === -1) return null;

    games[index] = {
      ...games[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await writeJSON(paths.games, games);
    return games[index];
  },

  /* Deletar jogo */
  delete: async (id) => {
    const games = await readJSON(paths.games);
    const index = games.findIndex(g => g.id === id);

    if (index === -1) return null;

    const [deletedGame] = games.splice(index, 1);
    await writeJSON(paths.games, games);

    return deletedGame;
  },

  /* Buscar jogos com filtros */
  search: async (userId, filters = {}) => {

    let games = await gameService.getByUserId(userId);

    if (filters.name) {
      games = games.filter(g =>
        g.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.category) {
      games = games.filter(g =>
        g.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.players) {
      games = games.filter(g => verificaIntervaloJogadores(g.players, filters.players));
    }

    if (filters.status) {
      games = games.filter(g =>
        g.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.playTime) {
      const timeStr = filters.playTime.toString();
      if (timeStr.startsWith('<')) {
        const time = parseInt(timeStr.substring(1));
        games = games.filter(g => g.playTime < time);
      } else if (timeStr.startsWith('>')) {
        const time = parseInt(timeStr.substring(1));
        games = games.filter(g => g.playTime > time);
      } else {
        const time = parseInt(timeStr);
        games = games.filter(g => g.playTime === time);
      }
    }

    return games;
  },

  /* Obter estatísticas dos jogos de um usuário */
  getStats: async (userId) => {
    const games = await gameService.getByUserId(userId);

    const stats = {
      total: games.length,
      byStatus: {
        'quero jogar': 0,
        'jogando': 0,
        'zerado': 0,
        'vendido': 0,
        'emprestado': 0
      }
    };

    games.forEach(game => {
      if (stats.byStatus.hasOwnProperty(game.status)) {
        stats.byStatus[game.status]++;
      }
    });

    return stats;
  }
};
import { api } from '../api.js';

export async function getGames() {
  return api('/games', { method: 'GET' });
}

export async function getStats() {
  return api('/games/stats', { method: 'GET' });
}

export async function createGame(gameData) {
  return api('/games', {
    method: 'POST',
    body: JSON.stringify(gameData)
  });
}

export async function updateGame(id, gameData) {
  return api(`/games/${id}`, {
    method: 'PUT',
    body: JSON.stringify(gameData)
  });
}

export async function updateGameStatus(id, status) {
  return api(`/games/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function deleteGame(id) {
  return api(`/games/${id}`, { method: 'DELETE' });
}

export async function searchGames(query) {
  return api(`/games/search?q=${query}`, { method: 'GET' });
}

export async function getGameDetail(id) {
  return api(`/games/${id}`, { method: 'GET' });
}
/* Status válidos */

export const GAME_STATUSES = {
  WANT_TO_PLAY: 'quero jogar',
  PLAYING: 'jogando',
  COMPLETED: 'zerado',
  SOLD: 'vendido',
  BORROWED: 'emprestado'
};

export const VALID_STATUSES = Object.values(GAME_STATUSES);

/* Mapeamento de cores para status */

export const STATUS_COLORS = {
  [GAME_STATUSES.WANT_TO_PLAY]: { class: 'danger', icon: 'heart-fill' },
  [GAME_STATUSES.PLAYING]: { class: 'success', icon: 'controller' },
  [GAME_STATUSES.COMPLETED]: { class: 'warning', icon: 'trophy-fill' },
  [GAME_STATUSES.SOLD]: { class: 'info', icon: 'bag-check-fill' },
  [GAME_STATUSES.BORROWED]: { class: 'info', icon: 'share-fill' }
};
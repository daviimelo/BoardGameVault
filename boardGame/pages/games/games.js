import { getGameDetail, updateGameStatus, deleteGame } from '../../shared/services/games.js';

const token = localStorage.getItem('token');
if (!token) window.location.href = '../login/index.html';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
        window.location.href = '../home/index.html';
        return;
    }

    try {
        const response = await getGameDetail(gameId);
        const jogo = response.game;

        // Dados básicos
        document.getElementById('detail-name').textContent = jogo.name;
        document.getElementById('detail-category').textContent = jogo.category;
        document.getElementById('detail-players').textContent = jogo.players;
        document.getElementById('detail-time').textContent = jogo.playTime || '--';
        document.getElementById('detail-notes').textContent = jogo.notes ? `"${jogo.notes}"` : 'Nenhuma observação registrada para este jogo.';

        // Data formatada
        if (jogo.createdAt) {
            const dataObj = new Date(jogo.createdAt);
            document.getElementById('detail-date').textContent = dataObj.toLocaleDateString('pt-BR');
        }

        // Badge de status com cores
        const statusElement = document.getElementById('detail-status');
        statusElement.textContent = jogo.status;
        
        const statusColors = {
            'jogando': 'text-success border-success bg-success bg-opacity-10',
            'quero jogar': 'text-danger border-danger bg-danger bg-opacity-10',
            'zerado': 'text-warning border-warning bg-warning bg-opacity-10',
            'vendido': 'text-info border-info bg-info bg-opacity-10',
            'emprestado': 'text-info border-info bg-info bg-opacity-10'
        };

        statusElement.className = `badge px-3 py-2 rounded-pill border text-uppercase ${statusColors[jogo.status] || 'text-secondary border-secondary'}`;

        // Mostrar conteúdo
        document.getElementById('loading-container').classList.add('d-none');
        document.getElementById('detalhes-container').classList.remove('d-none');

        // Guardar ID para ações
        window.currentGameId = gameId;
        window.currentGame = jogo;

    } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        document.getElementById('loading-container').innerHTML = `
            <div class="text-center">
                <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                <p class="mt-3 text-danger fw-bold">Erro ao carregar o jogo</p>
                <p class="text-secondary small">Verifique se ele ainda existe.</p>
                <a href="../home/index.html" class="btn btn-outline-secondary mt-3">Voltar</a>
            </div>
        `;
    }
});

// Editar jogo
document.getElementById('btn-edit-game').addEventListener('click', () => {
    const gameId = window.currentGameId;
    window.location.href = `../home/index.html?edit=${gameId}`;
});
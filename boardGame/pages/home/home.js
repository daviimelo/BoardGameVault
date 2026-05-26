import { getGames, getStats, createGame, updateGame, deleteGame, updateGameStatus, searchGames } from '../../shared/services/games.js';
import { verificarAutenticacao, saudarUsuario, realizarLogout } from '../../shared/utils/auth.js';
import { criarGameCard } from '../../shared/components/GameCard.js';
import { criarStatCard } from '../../shared/components/StatCard.js';
import { validarDadosDoJogo } from '../../shared/utils/validators.js';

// Estados globais
let jogosAtuais = []; 
let jogoEmEdicaoId = null; 

// Verificar autenticação e saudar usuário
verificarAutenticacao();
saudarUsuario('saudacao-nome');

document.getElementById('btn-logout').addEventListener('click', realizarLogout);

// Estatísticas
async function carregarEstatisticas() {
    const statsContainer = document.getElementById('stats-container');
    try {
        const data = await getStats();
        
        const cardsConfig = [
            { label: 'TOTAL', value: data.total || 0, icon: 'box-seam-fill', type: 'total' },
            { label: 'LISTA DE DESEJOS', value: data.byStatus['quero jogar'] || 0, icon: 'heart-fill', type: 'wishlist' },
            { label: 'JOGANDO', value: data.byStatus['jogando'] || 0, icon: 'controller', type: 'jogando' },
            { label: 'FINALIZADOS', value: data.byStatus['zerado'] || 0, icon: 'trophy-fill', type: 'zerado' },
            { label: 'EMPRESTADOS', value: data.byStatus['emprestado'] || 0, icon: 'share-fill', type: 'emprestado' },
            { label: 'VENDIDOS', value: data.byStatus['vendido'] || 0, icon: 'bag-check-fill', type: 'vendido' }
        ];

        statsContainer.innerHTML = cardsConfig.map(config => 
            criarStatCard(config.label, config.value, config.icon, config.type)
        ).join('');

    } catch (error) {
        console.error("Erro nas estatísticas:", error);
    }
}

// Renderização dos cards de jogos
function renderizarCards(jogos) {
    const gamesContainer = document.getElementById('games-container');
    gamesContainer.innerHTML = ''; 

    if (jogos.length === 0) {
        gamesContainer.innerHTML = `
            <div class="col-12 empty-state">
                <i class="bi bi-inboxes empty-state-icon"></i>
                <p class="empty-state-text mb-4">Nenhum jogo encontrado.</p>
            </div>
        `;
        gamesContainer.style.display = "block";
        return;
    }
    
    gamesContainer.style.display = "grid";

    jogos.forEach((jogo, index) => {
        const cardElement = criarGameCard(jogo, index);
        gamesContainer.appendChild(cardElement);
    });
}

async function carregarJogos() {
    try {
        const data = await getGames();
        jogosAtuais = data.games; 
        renderizarCards(jogosAtuais);
    } catch (error) {
        console.error("Erro nos jogos:", error);
    }
}

const alternarStatus = async (id, statusAtual) => {
    const ordemStatus = ['quero jogar', 'jogando', 'zerado', 'vendido', 'emprestado'];
    const indexAtual = ordemStatus.indexOf(statusAtual);
    const proximoStatus = ordemStatus[(indexAtual + 1) % ordemStatus.length];

    try {
        await updateGameStatus(id, proximoStatus);
        carregarEstatisticas();
        carregarJogos();
    } catch (error) {
        alert("Erro ao alterar status: " + error.message);
    }
};

const abrirEdicao = (id) => {
    const jogo = jogosAtuais.find(g => g.id === id);
    if (!jogo) return;

    jogoEmEdicaoId = id;
    document.querySelector('.modal-title').textContent = 'Editar jogo';

    document.getElementById('game-name').value = jogo.name;
    document.getElementById('game-category').value = jogo.category;
    document.getElementById('game-status').value = jogo.status;
    document.getElementById('game-players').value = jogo.players;
    document.getElementById('game-time').value = jogo.playTime || '';
    document.getElementById('game-notes').value = jogo.notes || '';
    
    const modalElement = document.getElementById('modalNovoJogo');
    let modal = bootstrap.Modal.getInstance(modalElement);
    if (!modal) modal = new bootstrap.Modal(modalElement);
    modal.show();
};

const deletarJogo = async (id) => {
    if (confirm('Tem certeza que deseja remover este jogo do seu cofre?')) {
        try {
            await deleteGame(id);
            carregarEstatisticas();
            carregarJogos();
        } catch (error) {
            alert('Erro ao excluir jogo: ' + error.message);
        }
    }
};

document.getElementById('games-container').addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return; 

    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');

    if (action === 'status') {
        const statusAtual = target.getAttribute('data-status');
        alternarStatus(id, statusAtual);
    } else if (action === 'edit') {
        abrirEdicao(id);
    } else if (action === 'delete') {
        deletarJogo(id);
    }
});

// Controle de formulário de criação/edição e sistema de busca
document.querySelector('[data-bs-target="#modalNovoJogo"]').addEventListener('click', () => {
    jogoEmEdicaoId = null;
    document.querySelector('.modal-title').textContent = 'Adicionar novo jogo';
    document.getElementById('form-novo-jogo').reset();
    document.getElementById('modal-mensagem').innerHTML = '';
});

document.getElementById('form-novo-jogo').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmit = document.querySelector('button[form="form-novo-jogo"]');
    const msgContainer = document.getElementById('modal-mensagem');
    
    const gameData = {
        name: document.getElementById('game-name').value.trim(),
        category: document.getElementById('game-category').value.trim(),
        status: document.getElementById('game-status').value,
        players: document.getElementById('game-players').value.trim(), 
        playTime: document.getElementById('game-time').value || null,
        notes: document.getElementById('game-notes').value.trim()
    };

    const erros = validarDadosDoJogo(gameData);
    
    if (erros.length > 0) {
        msgContainer.innerHTML = `
            <div class="alert alert-warning p-3 small mb-0" style="border-left: 4px solid var(--warning);">
                <strong>Atenção! Faltam algumas informações:</strong><br>
                ${erros.join('<br>')}
            </div>
        `;
        return; 
    }

    try {
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Salvando...';
        btnSubmit.disabled = true;
        msgContainer.innerHTML = ''; 

        if (jogoEmEdicaoId) {
            await updateGame(jogoEmEdicaoId, gameData);
        } else {
            await createGame(gameData);
        }
        
        const modalElement = document.getElementById('modalNovoJogo');
        bootstrap.Modal.getInstance(modalElement).hide();
        
        e.target.reset();
        jogoEmEdicaoId = null; 
        
        carregarEstatisticas();
        carregarJogos();

    } catch (error) {
        msgContainer.innerHTML = `
            <div class="alert alert-danger p-2 small mb-0">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> ${error.message}
            </div>
        `;
    } finally {
        btnSubmit.innerHTML = 'Salvar Jogo';
        btnSubmit.disabled = false;
    }
});

// Sistema de busca e filtros
document.getElementById('form-busca').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    ['name', 'category', 'status', 'players', 'playTime'].forEach(id => {
        const val = document.getElementById(`search-${id}`).value.trim();
        if (val) params.append(id, val);
    });

    const gamesContainer = document.getElementById('games-container');
    
    try {
        gamesContainer.innerHTML = `<div class="col-12 text-center mt-5"><div class="spinner-border text-primary" role="status"></div></div>`;
        const query = params.toString();
        const data = query ? await searchGames(query) : await getGames();
        
        jogosAtuais = data.games;
        renderizarCards(jogosAtuais);
    } catch (error) {
        gamesContainer.innerHTML = `<p class="text-danger ps-3 fade-in-up">Erro ao buscar jogos: ${error.message}</p>`;
    }
});

document.getElementById('btn-limpar-busca').addEventListener('click', () => {
    document.getElementById('form-busca').reset();
    carregarJogos();
});

document.addEventListener('DOMContentLoaded', () => {
    carregarEstatisticas();
    carregarJogos();
});
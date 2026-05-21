import { getGames, getStats, createGame, updateGame, deleteGame, updateGameStatus } from '../../shared/services/games.js';

let jogosAtuais = []; 
let jogoEmEdicaoId = null; 

const token = localStorage.getItem('token');
if (!token) window.location.href = '../login/index.html';

try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
        const user = JSON.parse(userStr);
        if (user && user.name) {
            document.getElementById('saudacao-nome').textContent = `Olá, ${user.name.split(' ')[0]}`;
        }
    }
} catch (error) {
    console.warn("Aviso: Não foi possível carregar o nome do usuário.", error);
}

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../login/index.html';
});

async function carregarEstatisticas() {
    const statsContainer = document.getElementById('stats-container');
    try {
        const data = await getStats();
        
        statsContainer.innerHTML = `
            <div class="stat-card stat-card-total">
                <i class="bi bi-box-seam-fill stat-card-icon"></i>
                <div class="stat-card-label">TOTAL</div>
                <h3 class="stat-card-value">${data.total || 0}</h3>
            </div>
            
            <div class="stat-card stat-card-jogando">
                <i class="bi bi-controller stat-card-icon"></i>
                <div class="stat-card-label">JOGANDO</div>
                <h3 class="stat-card-value">${data.byStatus['jogando'] || 0}</h3>
            </div>
            
            <div class="stat-card stat-card-zerado">
                <i class="bi bi-trophy-fill stat-card-icon"></i>
                <div class="stat-card-label">FINALIZADOS</div>
                <h3 class="stat-card-value">${data.byStatus['zerado'] || 0}</h3>
            </div>
            
            <div class="stat-card stat-card-wishlist">
                <i class="bi bi-heart-fill stat-card-icon"></i>
                <div class="stat-card-label">LISTA DE DESEJOS</div>
                <h3 class="stat-card-value">${data.byStatus['quero jogar'] || 0}</h3>
            </div>
        `;
    } catch (error) {
        console.error("Erro nas estatísticas:", error);
    }
}

async function carregarJogos() {
    const gamesContainer = document.getElementById('games-container');
    try {
        const data = await getGames();
        jogosAtuais = data.games; 

        gamesContainer.innerHTML = ''; 

        if (jogosAtuais.length === 0) {
            gamesContainer.innerHTML = `
                <div class="col-12 empty-state">
                    <i class="bi bi-inboxes empty-state-icon"></i>
                    <p class="empty-state-text mb-4">Sua estante está vazia.</p>
                </div>
            `;
            gamesContainer.style.display = "block";
            return;
        }
        
        gamesContainer.style.display = "grid";

        jogosAtuais.forEach((jogo, index) => {
            const statusBadgeClass = jogo.status.split(' ')[0]; 

            const card = document.createElement('div');
            card.className = 'game-card';
            card.style.animationDelay = `${index * 0.08}s`; 

            card.innerHTML = `
                <div class="game-card-header">
                    <a href="../games/index.html?id=${jogo.id}" class="text-decoration-none text-white hover-primary">
                        <h4 class="game-card-title text-truncate" title="${jogo.name}">${jogo.name}</h4>
                    </a>
                    <span class="game-card-badge game-card-badge-${statusBadgeClass}" 
                          style="cursor: pointer;" title="Clique para alterar o status" 
                          onclick="alternarStatus('${jogo.id}', '${jogo.status}')">
                          ${jogo.status} <i class="bi bi-arrow-repeat ms-1"></i>
                    </span>
                </div>
                
                <p class="game-card-category">${jogo.category}</p>
                
                <div class="game-card-meta">
                    <div class="game-card-meta-item">
                        <i class="bi bi-people-fill"></i> ${jogo.players} jog.
                    </div>
                    <div class="game-card-meta-item">
                        <i class="bi bi-stopwatch"></i> ${jogo.playTime ? jogo.playTime + ' min' : '--'}
                    </div>
                </div>

                ${jogo.notes ? `<p class="game-card-notes">"${jogo.notes}"</p>` : ''}

                <div class="game-card-actions">
                    <button class="btn-action" onclick="abrirEdicao('${jogo.id}')"><i class="bi bi-pencil-square"></i> Editar</button>
                    <button class="btn-action btn-action-delete" onclick="deletarJogo('${jogo.id}')"><i class="bi bi-trash3"></i></button>
                </div>
            `;
            gamesContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Erro nos jogos:", error);
    }
}

window.alternarStatus = async (id, statusAtual) => {
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

window.abrirEdicao = (id) => {
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
        name: document.getElementById('game-name').value,
        category: document.getElementById('game-category').value,
        status: document.getElementById('game-status').value,
        players: document.getElementById('game-players').value, 
        playTime: document.getElementById('game-time').value || null,
        notes: document.getElementById('game-notes').value
    };

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
        let modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        
        e.target.reset();
        jogoEmEdicaoId = null; 
        
        carregarEstatisticas();
        carregarJogos();

    } catch (error) {
        msgContainer.innerHTML = `<div class="alert alert-danger p-2 small">${error.message}</div>`;
    } finally {
        btnSubmit.innerHTML = 'Salvar Jogo';
        btnSubmit.disabled = false;
    }
});

window.deletarJogo = async (id) => {
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

document.addEventListener('DOMContentLoaded', () => {
    carregarEstatisticas();
    carregarJogos();
});
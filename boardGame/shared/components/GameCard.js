export function criarGameCard(jogo, index) {
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
                  data-action="status" data-id="${jogo.id}" data-status="${jogo.status}">
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
            <button class="btn-action" data-action="edit" data-id="${jogo.id}">
                <i class="bi bi-pencil-square"></i> Editar
            </button>
            <button class="btn-action btn-action-delete" data-action="delete" data-id="${jogo.id}">
                <i class="bi bi-trash3"></i>
            </button>
        </div>
    `;
    
    return card;
}
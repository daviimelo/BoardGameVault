export function exibirMensagem(containerId, texto, tipo) {
    limparMensagens();
    const container = document.getElementById(containerId);
    
    if (!container) return; 

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show mt-3 custom-alert`;
    alertDiv.innerHTML = `
        <span>${texto}</span>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.appendChild(alertDiv);
}

export function limparMensagens() {
    const alertas = document.querySelectorAll('.custom-alert');
    alertas.forEach(alerta => alerta.remove());
}
export function criarStatCard(label, value, iconName, colorClass) {
    return `
        <div class="stat-card stat-card-${colorClass}">
            <i class="bi bi-${iconName} stat-card-icon"></i>
            <div class="stat-card-label">${label}</div>
            <h3 class="stat-card-value">${value}</h3>
        </div>
    `;
}
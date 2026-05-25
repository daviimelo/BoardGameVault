export function validarDadosDoJogo(gameData) {
    const erros = [];
    
    if (!gameData.name) {
        erros.push("• O nome do jogo é obrigatório.");
    }
    if (!gameData.category) {
        erros.push("• A categoria é obrigatória.");
    }
    if (!gameData.players) {
        erros.push("• O número de jogadores é obrigatório.");
    }
    
    return erros;
}
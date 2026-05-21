import { readJSON, writeJSON } from '../utils/jsonSalvar.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gamesFile = path.join(__dirname, '../data/games.json')

const VALID_STATUSES = ['quero jogar', 'jogando', 'zerado', 'vendido', 'emprestado']

function validateGameData(data) {
    const errors = []

    if (!data.name || data.name.trim() === '') { errors.push("Nome do jogo é obrigatório.") }
    if (!data.category || data.category.trim() === '') { errors.push("Categoria é obrigatória.") }
    if (!data.players || data.players.trim() === '') { errors.push("Número de jogadores é obrigatório.") }
    if (data.status && !VALID_STATUSES.includes(data.status)) { errors.push(`Status inválido. Valores aceitos: ${VALID_STATUSES.join(', ')}`) }
    if (data.players && !/^\d+(-\d+)?$/.test(data.players.trim())) { errors.push("Número de jogadores deve ser um valor ou intervalo.") }
    if (data.playTime && isNaN(data.playTime)) { errors.push("Tempo de partida deve ser um número.") }
    
    return errors
}

// GET /games - Lista os jogos do usuário

export const listGames = async (req, res) => {
    try {
        const userId = req.user.id

        const games = await readJSON(gamesFile)
        const userGames = games.filter(game => game.userId === userId)

        return res.status(200).json({
            message: "Jogos listados com sucesso!",
            count: userGames.length,
            games: userGames
        })

    } catch (error) {
        console.error("Erro ao listar jogos:", error)
        return res.status(500).json({
            message: "Erro ao listar jogos.",
            error: error.message
        })
    }
}

// GET /games/:id - Retorna os detalhes de um jogo específico

export const getGameDetail = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const games = await readJSON(gamesFile)
        const game = games.find(g => g.id === id)

        if (!game) {
            return res.status(404).json({
                message: "Jogo não encontrado."
            })
        }

        if (game.userId !== userId) {
            return res.status(403).json({
                message: "Você não tem permissão para acessar este jogo."
            })
        }

        return res.status(200).json({
            message: "Jogo encontrado!",
            game
        })

    } catch (error) {
        console.error("Erro ao obter detalhes do jogo:", error)
        return res.status(500).json({
            message: "Erro ao obter detalhes do jogo.",
            error: error.message
        })
    }
}

 // POST /games - Cria um novo jogo na coleção do usuário

export const createGame = async (req, res) => {
    try {
        const userId = req.user.id
        const { name, category, players, playTime, status, notes } = req.body

        const errors = validateGameData({ name, category, players, playTime, status })
        if (errors.length > 0) {
            return res.status(400).json({
                errors
            })
        }

        const games = await readJSON(gamesFile)

        const newGame = {
            id: (Math.max(...games.map(g => parseInt(g.id) || 0), 0) + 1).toString(),
            userId,
            name: name.trim(),
            category: category.trim(),
            players: players.trim(),
            playTime: playTime ? parseInt(playTime) : null,
            status: status || 'quero jogar',
            notes: notes ? notes.trim() : '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        games.push(newGame)
        await writeJSON(gamesFile, games)

        return res.status(201).json({
            message: "Jogo criado com sucesso!",
            game: newGame
        })

    } catch (error) {
        console.error("Erro ao criar jogo:", error)
        return res.status(500).json({
            message: "Erro ao criar jogo.",
            error: error.message
        })
    }
}

// PUT /games/:id - Atualiza TODOS os dados de um jogo

export const updateGame = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        const { name, category, players, playTime, status, notes } = req.body

        const errors = validateGameData({ name, category, players, playTime, status })
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Erros de validação encontrados.",
                errors
            })
        }

        const games = await readJSON(gamesFile)

        const gameIndex = games.findIndex(g => g.id === id)
        if (gameIndex === -1) {
            return res.status(404).json({
                message: "Jogo não encontrado."
            })
        }

        if (games[gameIndex].userId !== userId) {
            return res.status(403).json({
                message: "Você não tem permissão para atualizar este jogo."
            })
        }

        games[gameIndex] = {
            ...games[gameIndex],
            name: name.trim(),
            category: category.trim(),
            players: players.trim(),
            playTime: playTime ? parseInt(playTime) : null,
            status: status || games[gameIndex].status,
            notes: notes ? notes.trim() : '',
            updatedAt: new Date().toISOString()
        }

        await writeJSON(gamesFile, games)

        return res.status(200).json({
            message: "Jogo atualizado com sucesso!",
            game: games[gameIndex]
        })

    } catch (error) {
        console.error("Erro ao atualizar jogo:", error)
        return res.status(500).json({
            message: "Erro ao atualizar jogo.",
            error: error.message
        })
    }
}

// PATCH /games/:id/status - Atualiza o status do jogo

export const updateGameStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const userId = req.user.id

        if (!status || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                message: "Status inválido!"
            })
        }

        const games = await readJSON(gamesFile)

        const gameIndex = games.findIndex(g => g.id === id)
        if (gameIndex === -1) {
            return res.status(404).json({
                message: "Jogo não encontrado."
            })
        }

        if (games[gameIndex].userId !== userId) {
            return res.status(403).json({
                message: "Você não tem permissão para atualizar este jogo."
            })
        }

        games[gameIndex].status = status
        games[gameIndex].updatedAt = new Date().toISOString()

        await writeJSON(gamesFile, games)

        return res.status(200).json({
            message: "Status do jogo atualizado com sucesso!",
            game: games[gameIndex]
        })

    } catch (error) {
        console.error("Erro ao atualizar status do jogo:", error)
        return res.status(500).json({
            message: "Erro ao atualizar status do jogo.",
            error: error.message
        })
    }
}

//  DELETE /games/:id - Deleta um jogo da coleção do usuário

export const deleteGame = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const games = await readJSON(gamesFile)

        const gameIndex = games.findIndex(g => g.id === id)
        if (gameIndex === -1) {
            return res.status(404).json({
                message: "Jogo não encontrado."
            })
        }

        if (games[gameIndex].userId !== userId) {
            return res.status(403).json({
                message: "Você não tem permissão para deletar este jogo."
            })
        }

        const deletedGame = games.splice(gameIndex, 1)[0]

        await writeJSON(gamesFile, games)

        return res.status(200).json({
            message: "Jogo deletado com sucesso!",
            game: deletedGame
        })

    } catch (error) {
        console.error("Erro ao deletar jogo:", error)
        return res.status(500).json({
            message: "Erro ao deletar jogo.",
            error: error.message
        })
    }
}

// GET /games/search - Busca jogos por nome ou filtro
 
export const searchGames = async (req, res) => {
    try {
        const userId = req.user.id
        const { name, category, players, playTime, status } = req.query

        const games = await readJSON(gamesFile)

        let filtered = games.filter(g => g.userId === userId)

        if (name) {
            filtered = filtered.filter(g =>
                g.name.toLowerCase().includes(name.toLowerCase())
            )
        }

        if (category) {
            filtered = filtered.filter(g =>
                g.category.toLowerCase().includes(category.toLowerCase())
            )
        }

        if (players) {
            filtered = filtered.filter(g =>
                g.players.toLowerCase().includes(players.toLowerCase())
            )
        }

        if (playTime) {
            if (playTime.startsWith('<')) {
                const time = parseInt(playTime.substring(1))
                filtered = filtered.filter(g => g.playTime < time)
            } else if (playTime.startsWith('>')) {
                const time = parseInt(playTime.substring(1))
                filtered = filtered.filter(g => g.playTime > time)
            } else {
                const time = parseInt(playTime)
                filtered = filtered.filter(g => g.playTime === time)
            }
        }

        if (status) {
            filtered = filtered.filter(g =>
                g.status.toLowerCase() === status.toLowerCase()
            )
        }

        return res.status(200).json({
            message: "Busca realizada com sucesso!",
            count: filtered.length,
            games: filtered
        })

    } catch (error) {
        console.error("Erro ao buscar jogos:", error)
        return res.status(500).json({
            message: "Erro ao buscar jogos.",
            error: error.message
        })
    }
}

// GET /games/stats - Retorna estatísticas dos jogos do usuário

export const getGameStats = async (req, res) => {
    try {
        const userId = req.user.id

        const games = await readJSON(gamesFile)
        const userGames = games.filter(g => g.userId === userId)

        const byStatus = {
            'quero jogar': 0,
            'jogando': 0,
            'zerado': 0,
            'vendido': 0,
            'emprestado': 0
        }

        userGames.forEach(game => {
            if (byStatus.hasOwnProperty(game.status)) {
                byStatus[game.status]++
            }
        })

        return res.status(200).json({
            message: "Estatísticas obtidas com sucesso!",
            total: userGames.length,
            byStatus
        })

    } catch (error) {
        console.error("Erro ao obter estatísticas:", error)
        return res.status(500).json({
            message: "Erro ao obter estatísticas.",
            error: error.message
        })
    }
}
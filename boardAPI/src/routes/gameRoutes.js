import express from 'express';
import { listGames, getGameDetail, createGame, updateGame, updateGameStatus, deleteGame, searchGames, getGameStats } from '../controllers/gamesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas as rotas abaixo exigem um JWT válido
router.use(authMiddleware);

// GET /stats
router.get("/stats", getGameStats);

// GET /games/search
router.get("/search", searchGames);

// GET /games
router.get("/", listGames);

// GET /games/:id
router.get("/:id", getGameDetail);

// POST /games
router.post("/", createGame);

// PUT /games/:id
router.put("/:id", updateGame);

// PATCH /games/:id/status
router.patch("/:id/status", updateGameStatus);

// DELETE /games/:id
router.delete("/:id", deleteGame);

export default router;
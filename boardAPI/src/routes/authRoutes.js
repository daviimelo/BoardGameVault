import express from 'express';
import { register, login } from '../controllers/authController.js';
import { getMe } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// PPOST /auth/register
router.post("/register", register);

// POST /auth/login
router.post("/login", login);

// GET /auth/me
router.get("/me", authMiddleware, getMe)

export default router;
import express from 'express';
import { login } from '../controllers/authController.js';
import { register, getMe } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// PPOST /auth/register
router.post("/register", register);

// POST /auth/login
router.post("/login", login);

// POST /auth/me
router.get("/me", authMiddleware, getMe)

export default router;
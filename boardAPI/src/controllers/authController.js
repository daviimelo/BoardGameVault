import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userService } from '../services/userService.js';
import { validators, errorMessages } from '../helpers/validators.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validações
        const requiredFields = ['name', 'email', 'password', 'confirmPassword'];
        if (!validators.hasRequiredFields(req.body, requiredFields)) {
            return res.status(400).json({ message: errorMessages.MISSING_FIELDS });
        }

        if (!validators.isValidEmail(email)) {
            return res.status(400).json({ message: errorMessages.INVALID_EMAIL });
        }

        if (!validators.isValidPassword(password)) {
            return res.status(400).json({ message: errorMessages.INVALID_PASSWORD });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: errorMessages.PASSWORD_MISMATCH });
        }

        // Verificar se email já existe
        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: errorMessages.EMAIL_EXISTS });
        }

        // Hash da senha
        const passwordHash = await bcryptjs.hash(password, 10);

        // Criar usuário
        const newUser = await userService.create({
            name: name.trim(),
            email: email.trim(),
            passwordHash
        });

        return res.status(201).json({
            message: "Usuário registrado com sucesso!",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Erro no register:", error);
        return res.status(500).json({
            message: "Erro ao registrar usuário.",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: errorMessages.MISSING_FIELDS });
        }

        // Buscar usuário
        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }

        // Comparar senha
        const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }

        // Gerar token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET || "raimudoviski_melhorprofessor",
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login efetuado com sucesso!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({
            message: "Erro ao fazer login.",
            error: error.message
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await userService.findById(userId);
        if (!user) {
            return res.status(404).json({ message: errorMessages.USER_NOT_FOUND });
        }

        return res.status(200).json({
            message: "Usuário encontrado!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error("Erro no getMe:", error);
        return res.status(500).json({
            message: "Erro ao obter dados do usuário.",
            error: error.message
        });
    }
};
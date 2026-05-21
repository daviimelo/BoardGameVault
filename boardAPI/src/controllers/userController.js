import bcryptjs from 'bcryptjs';
import { readJSON, writeJSON } from '../utils/jsonSalvar.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFile = path.join(__dirname, '../data/usuarios.json');

const validarDadosRegistro = (body) => {
    const { name, email, password, confirmPassword } = body;
    if (!name || !email || !password || !confirmPassword) return "Nome, email, senha e confirmação são obrigatórios.";
    if (password !== confirmPassword) return "As senhas não coincidem.";
    if (password.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Formato de email inválido.";
    
    return null;
};

export const register = async (req, res) => {
    try {
        const erroValidacao = validarDadosRegistro(req.body);
        if (erroValidacao) {
            return res.status(400).json({ message: erroValidacao });
        }

        const { name, email, password } = req.body;
        const users = await readJSON(usersFile);

        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            return res.status(409).json({ message: "Este email já está registrado." });
        }

        const passwordHash = await bcryptjs.hash(password, 10);

        const newUser = {
            id: (Math.max(...users.map(u => parseInt(u.id) || 0), 0) + 1).toString(),
            name,
            email,
            passwordHash
        };

        users.push(newUser);
        await writeJSON(usersFile, users);

        return res.status(201).json({ 
            message: "Usuário registrado com sucesso!",
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        });

    } catch (error) {
        console.error("Erro no registro:", error);
        return res.status(500).json({ message: "Erro ao registrar usuário.", error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const users = await readJSON(usersFile);
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        return res.status(200).json({
            message: "Usuário encontrado!",
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("Erro no getMe:", error);
        return res.status(500).json({ message: "Erro ao obter dados do usuário.", error: error.message });
    }
};
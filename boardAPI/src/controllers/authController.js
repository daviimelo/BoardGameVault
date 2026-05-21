import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readJSON } from '../utils/jsonSalvar.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFile = path.join(__dirname, '../data/usuarios.json');

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email e senha são obrigatórios." });
        }

        const users = await readJSON(usersFile);
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }

        const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET || "raimudoviski_melhorprofessor",
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login efetuado com sucesso!",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ message: "Erro ao fazer login.", error: error.message });
    }
};
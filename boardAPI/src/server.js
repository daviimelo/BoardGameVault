import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

// Carrega variáveis de ambiente
dotenv.config();

// Criando o objeto servidor
const app = express();

// Carregando os middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurações das rotas
app.use("/auth", authRoutes);
app.use("/games", gameRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
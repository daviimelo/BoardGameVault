import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Rotas
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Log de requisições */

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.use('/auth', authRoutes);
app.use('/games', gameRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor está rodando' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});
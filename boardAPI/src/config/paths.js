import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const paths = {
    root: path.resolve(__dirname, '../../'),
    src: path.resolve(__dirname, '../'),
    data: path.resolve(__dirname, '../data'),

    users: path.resolve(__dirname, '../data/usuarios.json'),
    games: path.resolve(__dirname, '../data/games.json')
};


try {
    await fs.mkdir(paths.data, { recursive: true });
} catch (error) {
    console.warn('Pasta data já existe');
}
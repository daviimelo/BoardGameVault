import { readJSON, writeJSON } from '../utils/jsonSalvar.js';
import { paths } from '../config/paths.js';

export const userService = {
  /* Obter todos os usuários */

  getAllUsers: async () => {
    return await readJSON(paths.users);
  },

  /* Encontrar usuário por email */

  findByEmail: async (email) => {
    const users = await readJSON(paths.users);
    return users.find(u => u.email === email);
  },

  /* Encontrar usuário por ID */

  findById: async (id) => {
    const users = await readJSON(paths.users);
    return users.find(u => u.id === id);
  },

  /* Verificar se email já existe */

  emailExists: async (email) => {
    const user = await userService.findByEmail(email);
    return !!user;
  },

  /* Criar novo usuário */

  create: async (userData) => {
    const users = await readJSON(paths.users);
    
    const newUser = {
      id: (Math.max(...users.map(u => parseInt(u.id) || 0), 0) + 1).toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeJSON(paths.users, users);

    return newUser;
  },

  /* Atualizar usuário */

  update: async (id, updates) => {
    const users = await readJSON(paths.users);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await writeJSON(paths.users, users);
    return users[index];
  },

  /* Deletar usuário */

  delete: async (id) => {
    const users = await readJSON(paths.users);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return null;

    const [deletedUser] = users.splice(index, 1);
    await writeJSON(paths.users, users);

    return deletedUser;
  }
};
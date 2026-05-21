import { api } from '../api.js'

export async function login(email, password) {
  return api('/auth/login', {
    method: 'POST',

    body: JSON.stringify({
      email,
      password
    })
  })
}

export async function register(data) {
  return api('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

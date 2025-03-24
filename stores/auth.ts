import { defineStore } from 'pinia'
import type { AuthState, User } from '~/types'
import md5 from 'md5'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    error: null,
  }),

  getters: {
    getUser: (state) => state.user,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getError: (state) => state.error,
  },

  actions: {
    async login(username: string, password: string) {
      this.error = null

      try {
        const response = await fetch('/users.json')
        const users: User[] = await response.json()

        // Хешируем введенный пароль
        const hashedPassword = md5(password)

        // Ищем пользователя с совпадающим логином и паролем
        const user = users.find(
          (u) =>
            u.credentials.username === username &&
            u.credentials.passphrase === hashedPassword &&
            u.active
        )

        if (user) {
          this.user = user
          this.isAuthenticated = true

          useCookie<{ user: User; isAuthenticated: boolean }>('auth').value = {
            user,
            isAuthenticated: true,
          }

          return true
        } else {
          this.error =
            'Введены неверные данные авторизации. Попробуйте ещё раз.'
          return false
        }
      } catch (error) {
        console.error('Error during login:', error)
        this.error = 'Произошла ошибка при входе. Пожалуйста, попробуйте позже.'
        return false
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      useCookie('auth').value = null
    },

    checkAuth() {
      const savedAuth = useCookie<{ user: User; isAuthenticated: boolean }>(
        'auth'
      )

      if (savedAuth.value) {
        const parsed = savedAuth.value
        this.user = parsed.user
        this.isAuthenticated = parsed.isAuthenticated
      }
    },
  },
})

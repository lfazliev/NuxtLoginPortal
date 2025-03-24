<template>
  <div class="login-page">
    <div class="login-container">
      <h1>Вход в систему</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Логин:</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            autocomplete="username"
            placeholder="Введите логин"
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="Введите пароль"
          />
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? 'Выполняется вход...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// Защита страницы с middleware
definePageMeta({
  middleware: ['auth'],
})

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true

  try {
    const success = await authStore.login(username.value, password.value)

    if (success) {
      router.push('/account')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.login-container {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
}

.login-form {
  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }
    }
  }

  .error-message {
    color: #dc3545;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background-color: rgba(220, 53, 69, 0.1);
    border-radius: 4px;
  }

  .login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #0069d9;
    }

    &:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  }
}
</style>

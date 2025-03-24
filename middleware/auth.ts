export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Проверяем состояние аутентификации
  authStore.checkAuth()

  // Если пользователь не аутентифицирован и пытается зайти на защищенную страницу
  if (!authStore.isAuthenticated && to.path !== '/') {
    return navigateTo('/')
  }

  // Если пользователь аутентифицирован и пытается зайти на страницу логина
  if (authStore.isAuthenticated && to.path === '/') {
    return navigateTo('/account')
  }
})

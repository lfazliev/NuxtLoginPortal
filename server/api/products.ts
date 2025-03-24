export default defineEventHandler(async (event) => {
  try {
    return await $fetch('/products.json')
  } catch (error) {
    console.error('Ошибка при чтении products.json:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось загрузить данные о продуктах',
    })
  }
})

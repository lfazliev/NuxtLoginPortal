import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductsState } from '~/types'

export const useProductsStore = defineStore('products', () => {
  // state
  const products = ref<Product[]>([])
  const filteredProducts = ref<Product[]>([])
  const categories = ref<string[]>([])
  const dateRange = ref({
    start: null as string | null,
    end: null as string | null,
  })
  const selectedCategories = ref<string[]>([])

  // getters
  const getProducts = computed(() => products.value)
  const getFilteredProducts = computed(() => filteredProducts.value)
  const getCategories = computed(() => categories.value)

  // actions
  // Новый метод для инициализации продуктов данными с сервера
  function initProducts(productData: Product[]) {
    products.value = productData
    filteredProducts.value = [...productData]

    // Извлекаем уникальные категории
    const uniqueCategories = new Set<string>()
    products.value.forEach((product) => uniqueCategories.add(product.category))
    categories.value = Array.from(uniqueCategories)
  }

  async function fetchProducts() {
    try {
      const response = await fetch('/products.json')
      const data = await response.json()
      initProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  function filterProducts() {
    let filtered = [...products.value]

    // Фильтр по категориям
    if (selectedCategories.value.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.value.includes(product.category)
      )
    }

    // Фильтр по диапазону дат
    if (dateRange.value.start) {
      filtered = filtered.filter(
        (product) =>
          new Date(product.date_created) >= new Date(dateRange.value.start!)
      )
    }

    if (dateRange.value.end) {
      filtered = filtered.filter(
        (product) =>
          new Date(product.date_created) <= new Date(dateRange.value.end!)
      )
    }

    filteredProducts.value = filtered
  }

  function setDateRange(start: string | null, end: string | null) {
    dateRange.value.start = start
    dateRange.value.end = end
    filterProducts()
  }

  function toggleCategory(category: string) {
    const index = selectedCategories.value.indexOf(category)
    if (index === -1) {
      selectedCategories.value.push(category)
    } else {
      selectedCategories.value.splice(index, 1)
    }
    filterProducts()
  }

  function clearFilters() {
    selectedCategories.value = []
    dateRange.value = { start: null, end: null }
    filteredProducts.value = [...products.value]
  }

  return {
    // state
    products,
    filteredProducts,
    categories,
    dateRange,
    selectedCategories,
    // getters
    getProducts,
    getFilteredProducts,
    getCategories,
    // actions
    initProducts,
    fetchProducts,
    filterProducts,
    setDateRange,
    toggleCategory,
    clearFilters,
  }
})

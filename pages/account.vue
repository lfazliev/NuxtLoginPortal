<template>
  <div class="account-page">
    <header class="header">
      <h1>Панель управления</h1>
      <div class="user-info">
        <span v-if="authStore.user"
          >{{ authStore.user.name }} {{ authStore.user.surname }}</span
        >
        <button @click="handleLogout" class="logout-button">Выход</button>
      </div>
    </header>

    <main class="main-content">
      <h2>Каталог товаров</h2>

      <div class="filters-container">
        <h3>Фильтры</h3>

        <div class="filter-group">
          <label>Дата создания:</label>
          <div class="date-filters">
            <div class="date-input">
              <label for="date-start">От:</label>
              <input
                id="date-start"
                v-model="dateStart"
                type="date"
                @change="handleDateFilterChange"
              />
            </div>
            <div class="date-input">
              <label for="date-end">До:</label>
              <input
                id="date-end"
                v-model="dateEnd"
                type="date"
                @change="handleDateFilterChange"
              />
            </div>
          </div>
        </div>

        <div class="filter-group">
          <label>Категории:</label>
          <div class="category-filters">
            <div
              v-for="category in productsStore.categories"
              :key="category"
              class="category-checkbox"
            >
              <input
                :id="'cat-' + category"
                type="checkbox"
                :checked="productsStore.selectedCategories.includes(category)"
                @change="toggleCategory(category)"
              />
              <label :for="'cat-' + category">{{ category }}</label>
            </div>
          </div>
        </div>

        <button @click="clearFilters" class="clear-filters-button">
          Очистить фильтры
        </button>
      </div>

      <div class="table-container">
        <table class="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Статус</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in productsStore.filteredProducts"
              :key="product.id"
            >
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.price.toLocaleString('ru-RU') }} ₽</td>
              <td>{{ product.quantity }}</td>
              <td>
                <span :class="getStatusClass(product.status)">{{
                  product.status
                }}</span>
              </td>
              <td>{{ formatDate(product.date_created) }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="productsStore.filteredProducts.length === 0" class="no-data">
          Нет данных, соответствующих выбранным фильтрам
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useProductsStore } from '~/stores/products'
import type { Product } from '~/types'

// Защита страницы с middleware
definePageMeta({
  middleware: ['auth'],
})

const router = useRouter()
const authStore = useAuthStore()
const productsStore = useProductsStore()
const dateStart = ref('')
const dateEnd = ref('')

await useAsyncData('products', async () => {
  try {
    const response = await $fetch<Product[]>('/products.json', {
      baseURL: useRuntimeConfig().public.apiBase || undefined,
    })
    const data = response
    productsStore.initProducts(data)
  } catch (error) {
    console.error('Error fetching products:', error)
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const handleDateFilterChange = () => {
  productsStore.setDateRange(dateStart.value || null, dateEnd.value || null)
}

const toggleCategory = (category: string) => {
  productsStore.toggleCategory(category)
}

const clearFilters = () => {
  dateStart.value = ''
  dateEnd.value = ''
  productsStore.clearFilters()
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'В наличии':
      return 'status-available'
    case 'Заканчивается':
      return 'status-low'
    case 'Нет в наличии':
      return 'status-unavailable'
    default:
      return ''
  }
}
</script>

<style lang="scss" scoped>
.account-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    .logout-button {
      padding: 0.5rem 1rem;
      border: none;
      background-color: #dc3545;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #c82333;
      }
    }
  }
}

.main-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
  }
}

.filters-container {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .filter-group {
    margin-bottom: 1rem;

    > label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
  }

  .date-filters {
    display: flex;
    gap: 1rem;

    .date-input {
      flex: 1;

      label {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
      }

      input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    }
  }

  .category-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;

    .category-checkbox {
      display: flex;
      align-items: center;

      input {
        margin-right: 0.5rem;
      }
    }
  }

  .clear-filters-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #5a6268;
    }
  }
}

.table-container {
  overflow-x: auto;

  .products-table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 0.75rem;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }

    tr:hover {
      background-color: #f8f9fa;
    }
  }

  .status-available {
    color: #28a745;
  }

  .status-low {
    color: #ffc107;
  }

  .status-unavailable {
    color: #dc3545;
  }

  .no-data {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .date-filters {
    flex-direction: column;
  }
}
</style>

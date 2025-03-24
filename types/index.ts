export interface User {
  name: string
  surname: string
  credentials: {
    username: string
    passphrase: string
  }
  active: boolean
  created: string
  _comment?: string
}

export interface Product {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  status: string
  date_created: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  error: string | null
}

export interface ProductsState {
  products: Product[]
  filteredProducts: Product[]
  categories: string[]
  dateRange: {
    start: string | null
    end: string | null
  }
  selectedCategories: string[]
}

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Inventory Management</h1>

    <!-- Search and Sort -->
    <div class="flex gap-4 mb-4">
      <input
        v-model="search"
        placeholder="Search products..."
        class="p-2 border rounded flex-grow"
      />
      <select v-model="sortBy" class="p-2 border rounded">
        <option value="name">Sort by Name</option>
        <option value="stock">Sort by Stock</option>
      </select>
    </div>

    <!-- Products Table -->
    <table class="w-full bg-white border border-gray-300 rounded shadow table-fixed">
      <thead>
        <tr class="bg-gray-200 border-b border-gray-300">
          <th class="p-2 text-left border-r border-gray-300">Image</th>
          <th class="p-2 text-left border-r border-gray-300 cursor-pointer" @click="toggleSort('name')">
            Product
            <span v-if="sortBy === 'name'">▲</span>
          </th>
          <th class="p-2 text-left border-r border-gray-300">Price</th>
          <th class="p-2 text-left border-r border-gray-300 cursor-pointer" @click="toggleSort('stock')">
            Stock
            <span v-if="sortBy === 'stock'">▲</span>
          </th>
          <th class="p-2 text-left border-r border-gray-300">Update Stock</th>
          <th class="p-2 text-left">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in sortedProducts"
          :key="product._id"
          :class="{'bg-red-100': product.stock <= lowStockThreshold}"
          class="border-b border-gray-200"
        >
          <td class="p-2 border-r border-gray-200">
            <img
              v-if="product.image"
              :src="`http://localhost:5000/uploads/${product.image}`"
              alt="Product Image"
              class="h-16 w-16 object-cover rounded"
            />
            <div v-else class="h-16 w-16 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
              No Image
            </div>
          </td>
          <td class="p-2 border-r border-gray-200">{{ product.name }}</td>
          <td class="p-2 border-r border-gray-200">${{ product.price.toFixed(2) }}</td>
          <td class="p-2 border-r border-gray-200">{{ product.stock }}</td>


          <!-- Update Stock Input -->
          <td class="p-2 border-r border-gray-200">
            <input
              type="number"
              min="0"
              v-model.number="stockUpdates[product._id]"
              class="w-20 p-1 border rounded"
            />
            <button
              class="ml-2 px-3 py-1 bg-green-600 text-white rounded"
              @click="updateStock(product._id)"
            >
              Update
            </button>
          </td>

          <!-- Delete Button -->
          <td class="p-2">
            <button
              class="px-3 py-1 bg-red-600 text-white rounded"
              @click="deleteProduct(product._id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Low stock alert -->
    <div v-if="lowStockProducts.length" class="mt-6 bg-yellow-100 border-l-4 border-yellow-400 p-4 text-yellow-800 rounded">
      <h2 class="font-semibold mb-2">Low Stock Alert</h2>
      <ul class="list-disc pl-5">
        <li v-for="product in lowStockProducts" :key="product._id">
          {{ product.name }} is low on stock ({{ product.stock }} left). Please restock soon!
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const search = ref('')
const sortBy = ref('name') // default sort by name
const products = ref([])
const stockUpdates = ref({})

const lowStockThreshold = 5

// Fetch products from backend
async function fetchProducts() {
  try {
    const res = await axios.get('http://localhost:5000/api/products')
    products.value = res.data

    // Initialize stockUpdates to current stock values
    res.data.forEach(p => {
      stockUpdates.value[p._id] = p.stock
    })
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

onMounted(() => {
  fetchProducts()
})

// Filtered products by search term
const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

// Sort products by selected field
const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value]
  if (sortBy.value === 'name') {
    return sorted.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'stock') {
    return sorted.sort((a, b) => a.stock - b.stock)
  }
  return sorted
})

// Toggle sorting order if needed
function toggleSort(field) {
  if (sortBy.value === field) return
  sortBy.value = field
}

// Low stock products list
const lowStockProducts = computed(() =>
  products.value.filter(p => p.stock <= lowStockThreshold)
)

// Update stock API call
async function updateStock(productId) {
  try {
    const newStock = stockUpdates.value[productId]
    if (newStock < 0) {
      alert('Stock cannot be negative')
      return
    }
    await axios.put(`http://localhost:5000/api/products/${productId}`, { stock: newStock })
    const product = products.value.find(p => p._id === productId)
    if (product) product.stock = newStock
    alert('Stock updated successfully')
  } catch (error) {
    console.error('Error updating stock:', error)
    alert('Failed to update stock')
  }
}

// Delete product API call
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await axios.delete(`http://localhost:5000/api/products/${productId}`)
    products.value = products.value.filter(p => p._id !== productId)
    alert('Product deleted successfully')
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Failed to delete product')
  }
}
</script>

<template>
  <div class="bg-white min-h-screen p-4 sm:p-6 text-gray-900">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-green-600">Inventory Management</h1>

    <!-- Search and Sort -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        v-model="search"
        placeholder="Search products..."
        class="p-2 rounded bg-gray-100 text-gray-900 border border-gray-400 w-full sm:flex-grow"
      />
      <select v-model="sortBy" class="p-2 rounded bg-gray-100 text-gray-900 border border-gray-400 w-full sm:w-auto">
        <option value="name">Sort by Name</option>
        <option value="stock">Sort by Stock</option>
      </select>
    </div>

    <!-- Products Table -->
    <div class="overflow-x-auto rounded shadow border border-gray-300">
      <transition-group name="fade" tag="table" class="w-full min-w-[640px] table-fixed">
        <thead>
          <tr class="bg-gray-200 text-green-700 text-sm sm:text-base">
            <th class="p-3 text-left border-b border-gray-300">Image</th>
            <th class="p-3 text-left border-b border-gray-300 cursor-pointer" @click="toggleSort('name')">
              Product <span v-if="sortBy === 'name'">▲</span>
            </th>
            <th class="p-3 text-left border-b border-gray-300">Price</th>
            <th class="p-3 text-left border-b border-gray-300 cursor-pointer" @click="toggleSort('stock')">
              Stock <span v-if="sortBy === 'stock'">▲</span>
            </th>
            <th class="p-3 text-left border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in sortedProducts"
            :key="product._id"
            :class="{
              'bg-red-100': product.stock <= lowStockThreshold,
              'bg-white': product.stock > lowStockThreshold
            }"
            class="transition-all duration-300 border-b border-gray-200 text-sm sm:text-base"
          >
            <td class="p-3">
              <img
                v-if="product.image"
                :src="`http://localhost:5000/uploads/${product.image}`"
                alt="Product Image"
                class="h-16 w-16 object-cover rounded"
              />
              <div v-else class="h-16 w-16 bg-gray-300 flex items-center justify-center text-gray-600 rounded">
                No Image
              </div>
            </td>

            <td class="p-3">
              <input
                v-if="editMode[product._id]"
                v-model="editableProducts[product._id].name"
                class="bg-gray-100 border border-gray-400 text-gray-900 p-1 rounded w-full"
              />
              <span v-else>{{ product.name }}</span>
            </td>

            <td class="p-3">
              <input
                v-if="editMode[product._id]"
                v-model.number="editableProducts[product._id].price"
                type="number"
                step="0.01"
                class="bg-gray-100 border border-gray-400 text-gray-900 p-1 rounded w-24"
              />
              <span v-else>${{ product.price.toFixed(2) }}</span>
            </td>

            <td class="p-3">
              <input
                v-if="editMode[product._id]"
                v-model.number="editableProducts[product._id].stock"
                type="number"
                min="0"
                class="bg-gray-100 border border-gray-400 text-gray-900 p-1 rounded w-20"
              />
              <span v-else>{{ product.stock }}</span>
            </td>

            <td class="p-3 flex flex-col sm:flex-row gap-2">
              <button
                @click="toggleEdit(product)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition duration-300 w-full sm:w-auto"
              >
                {{ editMode[product._id] ? 'Save' : 'Update' }}
              </button>
              <button
                @click="deleteProduct(product._id)"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition duration-300 w-full sm:w-auto"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </transition-group>
    </div>

    <!-- Low stock alert -->
    <transition name="fade">
      <div
        v-if="lowStockProducts.length"
        class="mt-6 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-500 p-4 rounded text-sm sm:text-base"
      >
        <h2 class="font-semibold mb-2">Low Stock Alert</h2>
        <ul class="list-disc pl-5">
          <li v-for="product in lowStockProducts" :key="product._id">
            {{ product.name }} is low on stock ({{ product.stock }} left). Please restock soon!
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const search = ref('')
const sortBy = ref('name')
const products = ref([])
const lowStockThreshold = 5

const editMode = ref({})
const editableProducts = ref({})

async function fetchProducts() {
  try {
    const res = await axios.get('http://localhost:5000/api/products')
    products.value = res.data
    res.data.forEach(p => {
      editMode.value[p._id] = false
      editableProducts.value[p._id] = { ...p }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

onMounted(() => {
  fetchProducts()
})

const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value]
  if (sortBy.value === 'name') {
    return sorted.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'stock') {
    return sorted.sort((a, b) => a.stock - b.stock)
  }
  return sorted
})

function toggleSort(field) {
  if (sortBy.value === field) return
  sortBy.value = field
}

const lowStockProducts = computed(() =>
  products.value.filter(p => p.stock <= lowStockThreshold)
)

async function toggleEdit(product) {
  const id = product._id
  if (!editMode.value[id]) {
    editMode.value[id] = true
    editableProducts.value[id] = { ...product }
  } else {
    const updated = editableProducts.value[id]
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, {
        name: updated.name,
        price: updated.price,
        stock: updated.stock
      })
      const index = products.value.findIndex(p => p._id === id)
      if (index !== -1) products.value[index] = { ...updated }
      editMode.value[id] = false
      alert('Product updated successfully')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    }
  }
}

async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await axios.delete(`http://localhost:5000/api/products/${productId}`)
    products.value = products.value.filter(p => p._id !== productId)
    delete editMode.value[productId]
    delete editableProducts.value[productId]
    alert('Product deleted successfully')
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Failed to delete product')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

input,
select {
  transition: all 0.3s ease;
}
button {
  transition: background-color 0.3s ease, transform 0.2s ease;
}
button:hover {
  transform: scale(1.05);
}
</style>

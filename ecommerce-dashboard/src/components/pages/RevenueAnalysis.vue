<template>
  <div class="min-h-screen bg-gray-100 py-10 px-6">
    <transition name="fade" appear>
      <div>
        <h1 class="text-3xl font-bold mb-6 text-gray-800">📊 Revenue Analysis</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <p class="text-lg font-medium text-gray-700">Total Orders</p>
            <p class="text-2xl font-bold text-indigo-600 mt-2">{{ totalOrders }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <p class="text-lg font-medium text-gray-700">Total Revenue</p>
            <p class="text-2xl font-bold text-green-600 mt-2">${{ totalRevenue.toFixed(2) }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow transition duration-300">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Revenue Chart</h2>
          <div class="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg">
            [Chart Placeholder]
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const totalOrders = ref(0)
const totalRevenue = ref(0)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/products')
    totalOrders.value = res.data.length
    totalRevenue.value = res.data.reduce((acc, p) => acc + p.price * p.stock, 0)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

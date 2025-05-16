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
          <div class="h-64">
            <RevenueChart :chart-data="chartData" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import RevenueChart from '../pages/RevenueChart.vue'

const totalOrders = ref(0)
const totalRevenue = ref(0)
const chartData = ref({
  labels: [],
  datasets: []
})

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/products')
    const products = res.data

    totalOrders.value = products.length
    totalRevenue.value = products.reduce((acc, p) => acc + p.price * p.stock, 0)

  
    chartData.value = {
      labels: products.map(p => p.name),
      datasets: [
        {
          label: 'Revenue',
          data: products.map(p => p.price * p.stock),
          backgroundColor: 'rgba(99, 102, 241, 0.2)', 
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    }
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

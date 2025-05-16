<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Revenue Analysis</h1>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-white p-4 rounded shadow">Total Orders: {{ totalOrders }}</div>
      <div class="bg-white p-4 rounded shadow">Total Revenue: ${{ totalRevenue }}</div>
    </div>
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-2">Revenue Chart</h2>
      <div class="h-64 bg-gray-100 flex items-center justify-center">[Chart Placeholder]</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const totalOrders = ref(0)
const totalRevenue = ref(0)

onMounted(async () => {
  const res = await axios.get('http://localhost:5000/api/products')
  totalOrders.value = res.data.length
  totalRevenue.value = res.data.reduce((acc, p) => acc + p.price * p.stock, 0)
})
</script>

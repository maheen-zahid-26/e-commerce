<template>
  <div>
    <Line :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler)

const props = defineProps({
  chartData: Object
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Products'
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Revenue ($)'
      }
    }
  }
}
</script>

<style scoped>
div {
  height: 100%;
}
</style>

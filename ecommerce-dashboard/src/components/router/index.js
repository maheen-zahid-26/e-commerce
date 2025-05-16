import { createRouter, createWebHistory } from 'vue-router'
import RevenueAnalysis from '../pages/RevenueAnalysis.vue'
import InventoryManagement from '../pages/InventoryManagement.vue'
import ProductRegistration from '../pages/ProductRegistration.vue'

const routes = [
  { path: '/', redirect: '/revenue' },
  { path: '/revenue', component: RevenueAnalysis },
  { path: '/inventory', component: InventoryManagement },
  { path: '/register', component: ProductRegistration }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

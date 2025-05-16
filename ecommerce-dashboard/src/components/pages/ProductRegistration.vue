<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div
      class="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-2xl transform transition-all duration-500 animate-fadeIn"
    >
      <h1
        class="text-4xl font-extrabold text-indigo-600 mb-8 text-center flex items-center justify-center gap-2"
      >
        🛍️ Register New Product
      </h1>

      <form @submit.prevent="submitProduct" class="space-y-6">
        <div>
          <label class="block mb-2 font-semibold text-gray-800">Product Name</label>
          <input
            v-model="name"
            class="w-full p-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label class="block mb-2 font-semibold text-gray-800">Description</label>
          <input
            v-model="description"
            class="w-full p-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter product description"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 font-semibold text-gray-800">Price</label>
            <input
              v-model.number="price"
              type="number"
              class="w-full p-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-800">Initial Stock</label>
            <input
              v-model.number="stock"
              type="number"
              class="w-full p-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div>
          <label class="block mb-2 font-semibold text-gray-800">Product Image</label>
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="w-full p-2 bg-white text-gray-700 border border-gray-300 rounded-lg"
          />
        </div>

        <div v-if="previewUrl" class="mt-4">
          <p class="text-gray-600 mb-2 font-medium">Image Preview:</p>
          <img
            :src="previewUrl"
            alt="Preview"
            class="w-full max-w-xs h-60 object-cover rounded-lg border border-gray-300 shadow-md mx-auto transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div>
          <button
            type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>

      <div
        v-if="submitted"
        class="mt-6 text-center text-green-600 font-semibold animate-bounce"
      >
        ✅ Product registered successfully!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const name = ref('')
const description = ref('')
const price = ref(0)
const stock = ref(0)
const image = ref(null)
const previewUrl = ref(null)
const submitted = ref(false)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    image.value = file
    previewUrl.value = URL.createObjectURL(file)
  } else {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    image.value = null
    previewUrl.value = null
  }
}

const submitProduct = async () => {
  if (!name.value || !price.value || !stock.value) {
    alert('Please fill in all required fields.')
    return
  }

  const formData = new FormData()
  formData.append('name', name.value.trim())
  formData.append('description', description.value?.trim() || '')
  formData.append('price', price.value)
  formData.append('stock', stock.value)

  if (image.value) {
    formData.append('image', image.value)
  }

  try {
    await axios.post('http://localhost:5000/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    submitted.value = true

    name.value = ''
    description.value = ''
    price.value = 0
    stock.value = 0
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    image.value = null
    previewUrl.value = null

    setTimeout(() => {
      submitted.value = false
    }, 3000)

    alert('Product registered successfully!')
  } catch (error) {
    console.error('Product registration failed:', error)
    alert('Failed to register product. Please try again.')
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out;
}
</style>

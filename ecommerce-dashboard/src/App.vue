<template>
  <div>
    <nav class="bg-gray-800 p-4 flex gap-4">
      <router-link
        to="/revenue"
        class="text-gray-200 font-bold no-underline"
        active-class="text-green-500"
      >
        Revenue Analysis
      </router-link>
      <router-link
        to="/inventory"
        class="text-gray-200 font-bold no-underline"
        active-class="text-green-500"
      >
        Inventory Management
      </router-link>
      <router-link
        to="/register"
        class="text-gray-200 font-bold no-underline"
        active-class="text-green-500"
      >
        Product Registration
      </router-link>
    </nav>

    <main class="p-8">
      <router-view />
    </main>
  </div>
</template>

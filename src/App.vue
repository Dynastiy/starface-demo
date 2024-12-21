<template>
  <main :class="theme">
    <div class="dark:bg-black2 bg-gray-100 min-h-screen">
      <component :is="layout">
        <RouterView />
      </component>
    </div>
  </main>
</template>

<script setup>
import Default from '../src/layouts/default.vue'
import Auth from '../src/layouts/auth.vue'
import Dashboard from '../src/layouts/dashboard.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
// import { sortUserPlugins } from 'vite'
// import store from './store'
const route = useRoute()
// const theme = ref('light')
const store = useStore()

const layout = computed(() => {
  if (route.meta.layout == 'Auth') {
    return Auth
  } else if (route.meta.layout == 'Dashboard') {
    return Dashboard
  } else {
    return Default
  }
})

// Detect system preference and set the theme
const detectTheme = () => {
  const savedTheme = theme.value;
  if (savedTheme) {
    store.commit('setTheme', savedTheme)
  }
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    let theme = 'dark'
    store.commit('setTheme', theme)
  } else {
    let theme = 'light'
    store.commit('setTheme', theme)
  }
}

onMounted(() => {
  detectTheme()
  document.documentElement.className = theme // Apply on load
})

const theme = computed (()=> {
  return store.getters['getTheme']
})
</script>

<style scoped></style>

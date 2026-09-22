<script setup>
import { ref, onMounted } from 'vue'
import { loadTheme, saveTheme } from '../utils/storage.js'

const isDark = ref(false)

function applyTheme(dark) {
  isDark.value = dark
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function toggle() {
  applyTheme(!isDark.value)
  saveTheme(isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = loadTheme()
  if (saved) {
    applyTheme(saved === 'dark')
  } else {
    // 首次访问跟随系统设置
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark)
  }
})
</script>

<template>
  <button
    class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    :aria-label="isDark ? '切换到亮色模式' : '切换到深色模式'"
    @click="toggle"
  >
    <!-- 太阳图标（深色模式下显示，点击切回亮色） -->
    <svg v-if="isDark" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    <!-- 月亮图标（亮色模式下显示，点击切到深色） -->
    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

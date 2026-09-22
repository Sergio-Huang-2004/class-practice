<script setup>
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import { STATUS_OPTIONS } from '../types/task.js'

const props = defineProps({
  tasks: { type: Array, required: true },
})

const emit = defineEmits(['toggle', 'delete', 'edit'])

const activeFilter = ref('all')

const filteredTasks = computed(() => {
  const sorted = [...props.tasks].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  )
  if (activeFilter.value === 'all') return sorted
  return sorted.filter((t) => t.status === activeFilter.value)
})

const filterOptions = [
  { value: 'all', label: '全部' },
  ...STATUS_OPTIONS,
]
</script>

<template>
  <div>
    <!-- 筛选按钮 -->
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
        :class="
          activeFilter === opt.value
            ? 'bg-indigo-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        "
        @click="activeFilter = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- 任务列表 -->
    <div v-if="filteredTasks.length > 0" class="grid gap-3">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="(id) => emit('toggle', id)"
        @delete="(id) => emit('delete', id)"
        @edit="(id) => emit('edit', id)"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <svg class="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-sm text-gray-400 dark:text-gray-500">还没有任务，点击上方按钮创建第一个吧</p>
    </div>
  </div>
</template>

<script setup>
import { PRIORITY_STYLES, STATUS_OPTIONS } from '../types/task.js'

const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['toggle', 'delete', 'edit'])

function getStatusLabel(value) {
  return STATUS_OPTIONS.find((s) => s.value === value)?.label || value
}
</script>

<template>
  <div
    class="group relative rounded-lg border border-l-4 bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
    :class="PRIORITY_STYLES[task.priority]?.border || 'border-l-gray-400'"
  >
    <div class="flex items-start gap-3">
      <button
        class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors"
        :class="
          task.status === 'done'
            ? 'border-indigo-500 bg-indigo-500 text-white'
            : 'border-gray-300 dark:border-gray-600'
        "
        :aria-label="task.status === 'done' ? '标记为待办' : '标记为完成'"
        @click="emit('toggle', task.id)"
      >
        <svg v-if="task.status === 'done'" class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <div class="min-w-0 flex-1 cursor-pointer" @click="emit('edit', task.id)">
        <h3
          class="text-sm font-medium text-gray-900 dark:text-gray-100"
          :class="task.status === 'done' ? 'line-through text-gray-400 dark:text-gray-500' : ''"
        >
          {{ task.title }}
        </h3>
        <p v-if="task.description" class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {{ task.description }}
        </p>
      </div>

      <div class="flex flex-shrink-0 items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
        <!-- 编辑按钮 -->
        <button
          class="rounded p-1 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-500 dark:hover:bg-indigo-900/30"
          aria-label="编辑任务"
          @click="emit('edit', task.id)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <!-- 删除按钮 -->
        <button
          class="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
          aria-label="删除任务"
          @click="emit('delete', task.id)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 底部标签 -->
    <div class="mt-3 flex items-center gap-2 pl-8">
      <!-- 优先级标签 -->
      <span
        class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
        :class="PRIORITY_STYLES[task.priority]?.badge"
      >
        <span class="h-1.5 w-1.5 rounded-full" :class="PRIORITY_STYLES[task.priority]?.dot"></span>
        {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}
      </span>

      <!-- 状态标签 -->
      <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
        {{ getStatusLabel(task.status) }}
      </span>
    </div>
  </div>
</template>

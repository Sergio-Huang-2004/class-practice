<script setup>
import { computed, ref } from 'vue'
import { STATUS_OPTIONS, PRIORITY_STYLES } from '../types/task.js'

const props = defineProps({
  tasks: { type: Array, required: true },
})

const emit = defineEmits(['changeStatus', 'toggle', 'delete'])

const dragTaskId = ref(null)
const dragOverStatus = ref(null)

const columns = STATUS_OPTIONS

const tasksByStatus = computed(() => {
  const map = {}
  for (const col of columns) {
    map[col.value] = props.tasks
      .filter((t) => t.status === col.value)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return map
})

function onDragStart(e, id) {
  dragTaskId.value = id
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', id)
}

function onDragOver(e, status) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  dragOverStatus.value = status
}

function onDragLeave(status) {
  if (dragOverStatus.value === status) {
    dragOverStatus.value = null
  }
}

function onDrop(e, status) {
  e.preventDefault()
  const id = dragTaskId.value || e.dataTransfer.getData('text/plain')
  if (id) {
    emit('changeStatus', id, status)
  }
  dragTaskId.value = null
  dragOverStatus.value = null
}

function onDragEnd() {
  dragTaskId.value = null
  dragOverStatus.value = null
}
</script>

<template>
  <!-- 桌面端：三列横向布局 -->
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div
      v-for="col in columns"
      :key="col.value"
      class="flex flex-col rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
      :class="dragOverStatus === col.value ? 'ring-2 ring-indigo-400' : ''"
      @dragover="onDragOver($event, col.value)"
      @dragleave="onDragLeave(col.value)"
      @drop="onDrop($event, col.value)"
    >
      <!-- 列头 -->
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <span
            class="h-2.5 w-2.5 rounded-full"
            :class="{
              'bg-gray-400': col.value === 'todo',
              'bg-blue-500': col.value === 'in-progress',
              'bg-green-500': col.value === 'done',
            }"
          ></span>
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ col.label }}</h3>
        </div>
        <span class="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {{ tasksByStatus[col.value]?.length || 0 }}
        </span>
      </div>

      <!-- 卡片区 -->
      <div class="flex-1 space-y-2 p-3 min-h-[200px]">
        <div
          v-for="task in tasksByStatus[col.value]"
          :key="task.id"
          draggable="true"
          class="cursor-move rounded-lg border border-l-4 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
          :class="[
            PRIORITY_STYLES[task.priority]?.border || 'border-l-gray-400',
            dragTaskId === task.id ? 'opacity-40' : '',
          ]"
          @dragstart="onDragStart($event, task.id)"
          @dragend="onDragEnd"
        >
          <div class="flex items-start justify-between gap-2">
            <h4
              class="text-sm font-medium text-gray-900 dark:text-gray-100"
              :class="task.status === 'done' ? 'line-through text-gray-400' : ''"
            >
              {{ task.title }}
            </h4>
            <button
              class="flex-shrink-0 rounded p-0.5 text-gray-400 hover:text-red-500"
              aria-label="删除"
              @click="emit('delete', task.id)"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p v-if="task.description" class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {{ task.description }}
          </p>
          <div class="mt-2 flex items-center gap-1.5">
            <span
              class="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs"
              :class="PRIORITY_STYLES[task.priority]?.badge"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="PRIORITY_STYLES[task.priority]?.dot"></span>
              {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}
            </span>
          </div>
        </div>

        <!-- 空列提示 -->
        <div
          v-if="!tasksByStatus[col.value]?.length"
          class="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400 dark:border-gray-700"
        >
          拖拽任务到这里
        </div>
      </div>
    </div>
  </div>
</template>

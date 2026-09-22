<script setup>
import { ref } from 'vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import KanbanBoard from './components/KanbanBoard.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { taskStore, addTask, deleteTask, toggleDone, changeStatus, editTask } from './stores/taskStore.js'

const showModal = ref(false)
const editingTask = ref(null)
const viewMode = ref('list') // 'list' | 'kanban'

function openCreate() {
  editingTask.value = null
  showModal.value = true
}

function openEdit(task) {
  editingTask.value = task
  showModal.value = true
}

function handleSubmit(data) {
  if (editingTask.value) {
    editTask(editingTask.value.id, data)
  } else {
    addTask(data)
  }
  showModal.value = false
  editingTask.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- 导航栏 -->
    <header class="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
      <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span class="text-lg font-bold text-gray-900 dark:text-gray-100">任务管理</span>
        </div>

        <div class="flex items-center gap-3">
          <!-- 视图切换 -->
          <div class="flex rounded-lg bg-gray-100 p-0.5 dark:bg-gray-700">
            <button
              class="rounded-md px-3 py-1.5 text-sm font-medium transition-all"
              :class="viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'"
              @click="viewMode = 'list'"
            >
              列表
            </button>
            <button
              class="rounded-md px-3 py-1.5 text-sm font-medium transition-all"
              :class="viewMode === 'kanban' ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'"
              @click="viewMode = 'kanban'"
            >
              看板
            </button>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- 主体 -->
    <main class="mx-auto max-w-5xl px-4 py-6">
      <!-- 工具栏 -->
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ viewMode === 'list' ? '任务列表' : '看板视图' }}
        </h1>
        <button
          class="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          @click="openCreate"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新建任务
        </button>
      </div>

      <!-- 列表视图 -->
      <TaskList
        v-if="viewMode === 'list'"
        :tasks="taskStore.tasks"
        @toggle="toggleDone"
        @delete="deleteTask"
        @edit="openEdit"
      />

      <!-- 看板视图 -->
      <KanbanBoard
        v-else
        :tasks="taskStore.tasks"
        @change-status="changeStatus"
        @toggle="toggleDone"
        @delete="deleteTask"
      />
    </main>

    <!-- 新建/编辑弹窗 -->
    <TaskModal
      :show="showModal"
      :task="editingTask"
      @close="showModal = false; editingTask = null"
      @submit="handleSubmit"
    />
  </div>
</template>

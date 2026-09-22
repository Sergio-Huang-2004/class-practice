import { reactive, watch } from 'vue'
import { saveTasks, loadTasks } from '../utils/storage.js'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../types/task.js'

/** 创建新任务 ID */
function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/** 默认示例数据 */
function createSampleTasks() {
  const now = Date.now()
  return [
    {
      id: createId(),
      title: '学习 Vue 3 Composition API',
      description: '了解 ref、reactive、computed、watch 的用法',
      status: 'todo',
      priority: 'high',
      createdAt: new Date(now - 86400000).toISOString(),
    },
    {
      id: createId(),
      title: '搭建项目骨架',
      description: 'Vite + Vue 3 + Tailwind CSS',
      status: 'done',
      priority: 'medium',
      createdAt: new Date(now - 172800000).toISOString(),
    },
    {
      id: createId(),
      title: '实现看板视图',
      description: '三列拖拽，拖入即改状态',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date(now - 43200000).toISOString(),
    },
  ]
}

// 初始化 store
const stored = loadTasks()
const initialTasks = stored && stored.length > 0 ? stored : createSampleTasks()

const store = reactive({
  tasks: initialTasks,
})

// 自动持久化 —— 监听变化并保存
watch(
  () => store.tasks,
  (newTasks) => {
    saveTasks(newTasks)
  },
  { deep: true }
)

/** 添加任务 */
function addTask({ title, description, priority }) {
  const task = {
    id: createId(),
    title: title.trim(),
    description: (description || '').trim(),
    status: 'todo',
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
  }
  store.tasks.unshift(task)
  return task
}

/** 更新任务 */
function updateTask(id, updates) {
  const idx = store.tasks.findIndex((t) => t.id === id)
  if (idx !== -1) {
    store.tasks[idx] = { ...store.tasks[idx], ...updates }
  }
}

/** 删除任务 */
function deleteTask(id) {
  const idx = store.tasks.findIndex((t) => t.id === id)
  if (idx !== -1) {
    store.tasks.splice(idx, 1)
  }
}

/** 切换完成状态 */
function toggleDone(id) {
  const task = store.tasks.find((t) => t.id === id)
  if (task) {
    task.status = task.status === 'done' ? 'todo' : 'done'
  }
}

/** 更改任务状态（用于看板拖拽） */
function changeStatus(id, status) {
  updateTask(id, { status })
}

/** 编辑任务 */
function editTask(id, { title, description, priority }) {
  updateTask(id, {
    title: title.trim(),
    description: (description || '').trim(),
    priority: priority || 'medium',
  })
}

export const taskStore = store
export { addTask, updateTask, deleteTask, toggleDone, changeStatus, editTask }
export { STATUS_OPTIONS, PRIORITY_OPTIONS }

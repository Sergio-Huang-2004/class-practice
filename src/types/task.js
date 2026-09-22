/**
 * Task 类型定义
 * @typedef {Object} Task
 * @property {string} id          - 唯一标识
 * @property {string} title       - 标题（必填）
 * @property {string} description - 描述（选填）
 * @property {'todo'|'in-progress'|'done'} status    - 状态
 * @property {'low'|'medium'|'high'} priority        - 优先级
 * @property {string} createdAt    - 创建时间 ISO 字符串
 */

/** 状态选项 */
export const STATUS_OPTIONS = [
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'done', label: '完成' },
]

/** 优先级选项 */
export const PRIORITY_OPTIONS = [
  { value: 'low', label: '低', color: 'green' },
  { value: 'medium', label: '中', color: 'yellow' },
  { value: 'high', label: '高', color: 'red' },
]

/** 优先级对应的 Tailwind 样式 */
export const PRIORITY_STYLES = {
  low: {
    border: 'border-l-green-500',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    dot: 'bg-green-500',
  },
  medium: {
    border: 'border-l-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    dot: 'bg-yellow-500',
  },
  high: {
    border: 'border-l-red-500',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    dot: 'bg-red-500',
  },
}

/** 状态对应的 Tailwind 样式 */
export const STATUS_STYLES = {
  todo: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  done: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
}

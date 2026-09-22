const STORAGE_KEY = 'vibe-coding-tasks'
const THEME_KEY = 'vibe-coding-theme'

/** 保存任务列表到 localStorage */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (e) {
    console.error('保存任务失败:', e)
  }
}

/** 从 localStorage 加载任务列表 */
export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.error('加载任务失败:', e)
    return null
  }
}

/** 保存主题到 localStorage */
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (e) {
    console.error('保存主题失败:', e)
  }
}

/** 从 localStorage 加载主题 */
export function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY)
  } catch (e) {
    return null
  }
}

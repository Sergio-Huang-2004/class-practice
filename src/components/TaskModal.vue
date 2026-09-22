<script setup>
import { ref, watch, nextTick } from 'vue'
import { PRIORITY_OPTIONS } from '../types/task.js'

const props = defineProps({
  show: { type: Boolean, default: false },
  task: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

const title = ref('')
const description = ref('')
const priority = ref('medium')
const titleError = ref('')
const titleInputRef = ref(null)

// 打开弹窗时初始化
watch(
  () => props.show,
  async (visible) => {
    if (visible) {
      if (props.task) {
        title.value = props.task.title
        description.value = props.task.description
        priority.value = props.task.priority
      } else {
        title.value = ''
        description.value = ''
        priority.value = 'medium'
      }
      titleError.value = ''
      await nextTick()
      titleInputRef.value?.focus()
    }
  }
)

function handleSubmit() {
  if (!title.value.trim()) {
    titleError.value = '标题不能为空'
    titleInputRef.value?.focus()
    return
  }
  titleError.value = ''
  emit('submit', {
    title: title.value,
    description: description.value,
    priority: priority.value,
  })
}

function handleOverlayClick() {
  emit('close')
}

function handleKeydown(e) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown="handleKeydown">
      <!-- 遮罩 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="handleOverlayClick"></div>

      <!-- 弹窗主体 -->
      <div
        class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800"
        @click.stop
      >
        <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ task ? '编辑任务' : '新建任务' }}
        </h2>

        <!-- 标题 -->
        <div class="mb-4">
          <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            标题 <span class="text-red-500">*</span>
          </label>
          <input
            ref="titleInputRef"
            v-model="title"
            type="text"
            class="w-full rounded-lg border px-3 py-2 text-base text-gray-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-gray-100"
            :class="titleError ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'"
            placeholder="输入任务标题"
            @keydown.enter="handleSubmit"
          />
          <p v-if="titleError" class="mt-1 text-xs text-red-500">{{ titleError }}</p>
        </div>

        <!-- 描述 -->
        <div class="mb-4">
          <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">描述</label>
          <textarea
            v-model="description"
            rows="3"
            class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder="输入任务描述（选填）"
          ></textarea>
        </div>

        <!-- 优先级 -->
        <div class="mb-6">
          <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">优先级</label>
          <div class="flex gap-2">
            <button
              v-for="opt in PRIORITY_OPTIONS"
              :key="opt.value"
              type="button"
              class="flex-1 rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all"
              :class="
                priority === opt.value
                  ? opt.color === 'red'
                    ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                    : opt.color === 'yellow'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'border-green-500 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-600 dark:text-gray-400'
              "
              @click="priority = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- 按钮 -->
        <div class="flex justify-end gap-3">
          <button
            class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="emit('close')"
          >
            取消
          </button>
          <button
            class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
            @click="handleSubmit"
          >
            {{ task ? '保存' : '创建' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

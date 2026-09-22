# 📋 任务管理应用 — Vibe Coding 课堂实践

> 基于 **Vue 3 + Vite + Tailwind CSS** 的任务管理 Web App，通过 Agentic 开发模式（计划→执行→确认）分五轮迭代完成。

📎 **GitHub 仓库**：https://github.com/Sergio-Huang-2004/class-practice.git

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 📝 任务增删改查 | 标题必填、描述选填，弹窗表单创建与编辑 |
| 🚦 三种状态 | 待办 / 进行中 / 完成，点击复选框快速切换 |
| 🎨 优先级三档 | 高（红色）/ 中（黄色）/ 低（绿色），卡片左边框颜色区分 |
| 📌 看板视图 | 三列卡片布局，HTML5 原生拖拽 API，拖拽即改状态 |
| 🌙 深色模式 | 一键切换亮/暗主题，localStorage 记住用户选择 |
| 💾 数据持久化 | localStorage 存储，刷新页面数据不丢失 |
| 📱 响应式布局 | 适配桌面与移动端屏幕 |

---

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 | 前端框架（`<script setup>` 语法） |
| Vite | 构建工具与开发服务器 |
| Tailwind CSS v4 | 原子化 CSS 框架 |
| localStorage | 浏览器端数据持久化 |
| HTML5 Drag & Drop API | 原生拖拽，无第三方库 |

---

## 📁 项目结构

```
课程实践1/
├── index.html               # 入口 HTML
├── vite.config.js           # Vite + Tailwind CSS 插件配置
├── package.json             # 项目依赖
├── src/
│   ├── main.js              # 应用入口
│   ├── style.css            # Tailwind 导入 + 深色模式 class 策略
│   ├── App.vue              # 主页面：导航栏 + 视图切换 + 任务管理
│   ├── types/
│   │   └── task.js          # Task 类型定义、状态/优先级常量
│   ├── utils/
│   │   └── storage.js       # localStorage 读写封装
│   ├── stores/
│   │   └── taskStore.js     # 响应式状态管理 + 自动持久化
│   └── components/
│       ├── TaskCard.vue     # 任务卡片（复选框/编辑/删除/优先级色标）
│       ├── TaskList.vue     # 列表视图 + 状态筛选
│       ├── TaskModal.vue    # 新建/编辑弹窗（标题校验/ESC关闭）
│       ├── KanbanBoard.vue  # 看板视图（三列拖拽改状态）
│       └── ThemeToggle.vue  # 深色模式切换（localStorage 记忆）
└── public/
    └── favicon.svg          # 站点图标
```

---

## 🚀 本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/Sergio-Huang-2004/class-practice.git
cd class-practice

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器打开 http://localhost:5173

# 5. 构建生产版本
npm run build
```

> 环境要求：Node.js v20+ / npm v10+

---

## 🔄 开发过程（五轮迭代）

每轮遵循 **计划 → 执行 → 确认** 的 Agentic 开发流程：

| 轮次 | 目标 | 产出文件 |
|------|------|----------|
| 第一轮 | 项目骨架 — Tailwind CSS 配置、Task 类型定义、App.vue 导航栏 | `vite.config.js` `style.css` `task.js` `App.vue` |
| 第二轮 | 核心功能 — 任务增删改查、优先级颜色、状态筛选 | `TaskCard.vue` `TaskList.vue` `TaskModal.vue` |
| 第三轮 | 数据持久化 — localStorage 存储，刷新不丢失 | `storage.js` `taskStore.js` |
| 第四轮 | 看板视图 — 三列拖拽改状态，列表/看板 Tab 切换 | `KanbanBoard.vue` |
| 第五轮 | 深色模式 — 一键切换，全组件 dark: 样式 | `ThemeToggle.vue` |

---

## 💡 提示词设计

开发过程中使用的核心提示词（Prompt）：

```text
我在开发一个任务管理 Web App，技术栈：Vue 3 + Vite + Tailwind CSS + localStorage。

功能需求：
1. 任务增删改查：标题必填、描述选填
2. 三种状态：待办 / 进行中 / 完成
3. 优先级三档：高（红）、中（黄）、低（绿）
4. 看板视图：三列卡片，拖拽即改状态（HTML5 原生拖拽 API）
5. 深色模式：一键切换，localStorage 记住选择
6. 数据存在浏览器：刷新不丢失

请按以下顺序分轮开发，每轮完成后 git commit：
- 第一轮：项目骨架（Tailwind 配置 + Task 类型 + App.vue 导航栏）
- 第二轮：TaskCard / TaskList / TaskModal 组件（增删改查）
- 第三轮：storage.js + taskStore.js（localStorage 持久化）
- 第四轮：KanbanBoard.vue（三列拖拽看板）
- 第五轮：ThemeToggle.vue（深色模式）

约束：使用 Vue 3 script setup 语法，Tailwind CSS 做样式，不引入第三方 UI 库。
```

**提示词设计原则**：目标 + 约束 + 上下文，每轮只做一个功能，改完立刻验证。

---

## 📸 功能截图

> 以下为各功能运行截图（运行 `npm run dev` 后在浏览器中截取）：

### 列表视图 — 任务增删改查
![列表视图](docs/list-view.png)

### 看板视图 — 三列拖拽
![看板视图](docs/kanban-view.png)

### 新建任务弹窗
![新建任务](docs/task-modal.png)

### 深色模式
![深色模式](docs/dark-mode.png)

---

## 📄 License

MIT

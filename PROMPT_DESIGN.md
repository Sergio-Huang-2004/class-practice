# 提示词设计文档 — 任务管理应用

> 本文档记录了「任务管理应用」Agentic 开发全过程中使用的提示词设计，包括需求描述、分轮开发提示、排错提示及设计原则总结。

---

## 一、项目背景

### 1.1 功能需求

- 任务增删改查：标题必填、描述选填
- 三种状态：待办 / 进行中 / 完成
- 优先级三档：高（红）、中（黄）、低（绿）
- 看板视图：三列卡片，拖拽即改状态
- 深色模式：一键切换，记住选择
- 数据存在浏览器：刷新不丢失

### 1.2 技术选型

| 项目 | 选型 | 理由 |
|------|------|------|
| 前端框架 | Vue 3 | 上手简单，社区活跃，`<script setup>` 语法 |
| 构建工具 | Vite | 启动快，Vue 官方推荐 |
| 样式方案 | Tailwind CSS v4 | 原子化 CSS，无需写 CSS 文件 |
| 数据存储 | localStorage | 浏览器自带，无需后端 |

### 1.3 开发方法论

采用 **Agentic 开发模式**，核心循环为：

```
计划（Plan）→ 执行（Execute）→ 确认（Verify）
```

- 每轮只做一个功能
- 每次修改立刻在浏览器验证
- 每个功能完成立刻 git commit

---

## 二、总体提示词（项目立项）

将完整需求一次性描述给 Agent，确立项目方向与技术约束：

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

**设计要点**：
- 明确技术栈，避免 Agent 自由发挥选型
- 列出全部功能需求，让 Agent 有全局视野
- 指定分轮顺序，控制开发节奏
- 加入约束条件（script setup、不引入第三方库）

---

## 三、分轮开发提示词

### 第一轮：项目骨架

**本轮目标**：配置 Tailwind CSS、定义 Task 类型、搭建 App.vue 导航栏与基础布局。

```text
我在开发一个任务管理 Web App，项目名 task-manager。
技术栈：Vue 3 + Vite + Tailwind CSS。

请帮我搭建项目骨架，创建以下文件：

1. src/types/task.js — 定义 Task 类型
   字段：id, title, description, status, priority, createdAt
   status 可选值：'todo' | 'in-progress' | 'done'
   priority 可选值：'low' | 'medium' | 'high'
   同时定义优先级样式映射（高=红色、中=黄色、低=绿色）

2. vite.config.js — 添加 @tailwindcss/vite 插件

3. src/style.css — 导入 Tailwind，配置 class 策略深色模式

4. src/App.vue — 应用主页面
   - 顶部导航栏（标题"任务管理" + 视图切换按钮 + 主题切换按钮）
   - 中间显示任务列表区域
   - "新建任务"按钮

要求：
- 使用 Vue 3 script setup 语法
- 使用 Tailwind CSS 做样式
- 主色调用 indigo（靛蓝色）
- 现在先用示例数据展示，后面再接真实功能
```

**验证方式**：`npm run dev`，浏览器打开 http://localhost:5173，看到导航栏和页面框架。

---

### 第二轮：任务列表与表单

**本轮目标**：创建 TaskCard、TaskList、TaskModal 三个组件，实现任务增删改查。

```text
创建以下三个组件：

1. src/components/TaskCard.vue 组件：
   - 展示单个任务信息：标题、描述、优先级标签、状态标签
   - 优先级用左边框颜色区分：high 红色、medium 黄色、low 绿色
   - 点击左侧复选框标记任务为完成（标题加删除线）
   - 右上角有编辑按钮和删除按钮（hover 时显示）
   - 点击卡片标题区域可编辑
   - 鼠标悬停时卡片微微放大（hover:scale-[1.02]）
   Props：task；Emit：toggle、delete、edit

2. src/components/TaskList.vue 组件：
   - 接收任务列表，用 TaskCard 展示每一项
   - 任务按创建时间倒序排列（最新的在上面）
   - 顶部有状态筛选按钮：全部 / 待办 / 进行中 / 完成
   - 没有任务时显示空状态提示

3. src/components/TaskModal.vue 组件：
   - 点击"新建任务"按钮打开弹窗
   - 表单字段：标题（必填）、描述（选填）、优先级（三档选择）
   - 标题为空时显示红色错误提示"标题不能为空"
   - 点击弹窗外的灰色遮罩关闭弹窗
   - 按 ESC 键关闭弹窗
   - 提交后用 emit 把数据传给父组件
   - 使用 v-model 绑定表单数据
   - 使用 Teleport 把弹窗渲染到 body 下
```

**验证方式**：新建任务 → 点复选框标记完成 → 编辑任务 → 删除任务，全部正常。

---

### 第三轮：数据持久化

**本轮目标**：将任务数据存到 localStorage，刷新页面不丢失。

```text
现在任务数据只存在内存里，刷新就没了。请把数据持久化到 localStorage：

1. 创建 src/utils/storage.js：
   - saveTasks(tasks)：把任务数组存为 JSON
   - loadTasks()：读取并解析 JSON，读取出错时返回 null
   - 存储键名：vibe-coding-tasks
   - 同时封装 saveTheme() / loadTheme() 用于深色模式

2. 创建 src/stores/taskStore.js：
   - 用 Vue reactive 管理状态
   - 初始化时从 localStorage 加载数据
   - 使用 watch 自动监听变化并保存（deep: true）
   - 导出 addTask、updateTask、deleteTask、toggleDone、changeStatus、editTask 函数
   - 首次使用时如果没有数据，自动创建 3 条示例任务

3. 更新 App.vue，改为从 taskStore 获取数据和方法
```

**验证方式**：添加任务 → 刷新页面 → 任务还在；F12 → Application → Local Storage 查看存储数据。

---

### 第四轮：看板视图

**本轮目标**：添加看板视图，三列拖拽改状态。

```text
创建 src/components/KanbanBoard.vue：

功能：
- 三列：待办 | 进行中 | 已完成
- 任务卡片显示在对应状态的列中
- 卡片可以拖拽到其他列（用 HTML5 原生拖拽 API）
- 拖入新列时自动更新任务的 status
- 列头显示该列任务数量
- 拖拽时原卡片半透明，目标列高亮边框
- 空列显示"拖拽任务到这里"提示

在 App.vue 顶部加两个 Tab 按钮："列表"和"看板"
切换时保持数据一致（共用同一个 taskStore）

注意：不需要引入任何拖拽库，用原生的 dragstart、dragover、dragleave、drop 事件即可。
响应式：手机上三列改为竖向单列布局（md:grid-cols-3）
```

**验证方式**：拖一张卡片从「待办」到「进行中」，确认任务状态更新；切换列表/看板 Tab 数据一致。

---

### 第五轮：深色模式

**本轮目标**：实现深色模式一键切换，记住用户选择。

```text
创建 src/components/ThemeToggle.vue：

功能：
- 点击按钮切换亮色/深色模式
- 在 html 标签上添加/移除 dark class
- 用 localStorage 记住用户选择（键名：vibe-coding-theme）
- 首次访问时跟随系统设置（prefers-color-scheme）
- 按钮放在导航栏右侧
- 亮色模式显示月亮图标（点击切到深色），深色模式显示太阳图标

同时在 style.css 中配置 Tailwind v4 的 class 策略深色模式：
@custom-variant dark (&:where(.dark, .dark *));

所有组件添加 dark: 前缀的深色样式。
```

**验证方式**：点击主题按钮切换 → 刷新页面 → 主题保持不变。

---

## 四、排错提示词

开发过程中遇到问题时，使用以下模板：

### 4.1 万能排错模板

```text
我遇到了一个问题，帮我修复：

【错误信息】
（粘贴终端或浏览器控制台的完整错误）

【我想实现的效果】
（描述期望发生什么）

【我已经尝试过的方法】
（列出试过但没解决的操作）
```

### 4.2 实际遇到的问题与修复

**问题：中文编码损坏**

```text
PowerShell 写入的文件中文字符变成乱码（如"任务管理"变成"浠诲姟绠＄悊"），
导致 Vue 模板编译报错：Unexpected token, expected ":"

原因：Windows PowerShell 5.1 默认以 ANSI 编码读取脚本文件，
而脚本以 UTF-8 保存，导致中文字符被错误解析。

解决方案：删除已损坏的文件，使用支持 UTF-8 的方式重新创建文件。
```

**问题：Git 推送连接被重置**

```text
git push 时报错：
fatal: unable to access 'https://github.com/...': Failed to connect to github.com port 443

原因：当前网络环境无法连接 GitHub。

解决方案：在网络恢复后重新执行 git push origin main。
```

---

## 五、代码审查提示词

每完成一个大功能后，进行代码审查：

```text
请审查我当前项目的代码，重点检查：
1. 有没有安全风险（如 XSS、localStorage 数据被篡改）
2. 有没有性能问题（如不必要的响应式、重复计算）
3. 错误处理是否完整（如 JSON 解析失败、localStorage 不可用）
4. 有没有可以简化的地方（冗余代码、重复逻辑）
5. 组件职责是否清晰（props/emit 设计是否合理）
```

---

## 六、提示词设计原则总结

### 6.1 核心公式

```
好的提示词 = 目标 + 约束 + 上下文
```

| 不推荐 | 推荐 |
|--------|------|
| 帮我做一个任务列表 | 创建 TaskList.vue 组件。接收任务数组用 TaskCard 展示，顶部有状态筛选按钮，按创建时间倒序。使用 Tailwind CSS，数据通过 props 传入。不要引入第三方 UI 库。 |

### 6.2 关键原则

1. **一次只做一件事**：每轮对话只实现一个功能，不一次性把所有需求丢给 Agent
2. **明确文件和路径**：指定要创建/修改的具体文件名和路径
3. **给出 Props/Emit 定义**：对 Vue 组件，明确数据接口
4. **指定技术约束**：如"不引入第三方拖拽库，用 HTML5 原生 API"
5. **描述验证方式**：每轮结束说明如何在浏览器中验证
6. **遇到 Bug 直接贴错误信息**：不要自己分析原因，把完整错误丢给 Agent

### 6.3 迭代节奏

```
每次对话 → 只做一个功能
每次修改 → 立刻在浏览器里验证
每个功能完成 → 立刻 git commit
全部完成 → push 到 GitHub
```

---

## 七、项目文件与提示词对应关系

| 提示词轮次 | 产出文件 | 功能 |
|-----------|----------|------|
| 第一轮 | `vite.config.js` `style.css` `task.js` `App.vue` | 项目骨架、Tailwind 配置、类型定义、导航栏 |
| 第二轮 | `TaskCard.vue` `TaskList.vue` `TaskModal.vue` | 任务卡片、列表视图、新建/编辑弹窗 |
| 第三轮 | `storage.js` `taskStore.js` | localStorage 读写、响应式状态管理 |
| 第四轮 | `KanbanBoard.vue` | 看板视图、三列拖拽改状态 |
| 第五轮 | `ThemeToggle.vue` | 深色模式切换、localStorage 记忆 |
| 排错 | — | 修复中文编码、Git 网络连接问题 |
| 文档 | `README.md` `PROMPT_DESIGN.md` | 项目说明、提示词设计文档 |

# 移动端开发规范 · 广州仲裁委智能管理平台（仲裁员端）

> 本文档系统规定了本项目移动端 H5（微信小程序版模拟）开发所遵循的全部规范，涵盖 UI 设计、交互行为、性能优化、兼容性、代码风格与安全标准，是项目后续移动端开发的唯一指导依据。所有 Token 定义见 [`src/index.css`](src/index.css) 的 `@theme` 块。

---

## 0. 项目总则

### 0.1 项目背景

- **产品名称**：广州仲裁委智能管理平台 · 仲裁员端
- **产品形态**：移动端 H5，以「微信小程序」视觉与交互模式为目标平台进行模拟与预览
- **运行方式**：通过 [`MiniProgramContainer`](src/components/MiniProgramContainer.tsx) 在桌面浏览器中模拟手机视口（默认 400×840），同时提供「全屏自适应」桌面预览模式，最终面向真实手机浏览器 / 微信内嵌 WebView 运行

### 0.2 技术栈

| 分类 | 技术 | 版本约束 |
|------|------|----------|
| 框架 | React | ^19.0.1（函数组件 + Hooks） |
| 语言 | TypeScript | ~5.8.2（`jsx: react-jsx`，`target: ES2022`） |
| 构建 | Vite | ^6.2.3，`base: '/newapp/'` |
| 样式 | Tailwind CSS | ^4.1.14（`@tailwindcss/vite` 插件，`@theme` 定义 Token） |
| 图标 | lucide-react + FontAwesome 6 | 优先 lucide-react；底部 Tab 等使用 `fa-solid` |
| 动画 | motion（Framer Motion）+ CSS keyframes | 复杂动效用 motion，轻量过渡用内置 `--animate-*` |
| 路由 | 无路由库 | 单页状态机：`activeTab` + `activeSubPage` |
| AI 能力 | `@google/genai` | 需配置 `GEMINI_API_KEY` |

### 0.3 适用范围

- 适用于项目内**所有新增 / 迁移 / 重构的移动端页面与组件**
- 桌面「全屏自适应」模式为辅助预览，**以手机视口（400×840 基准）为第一适配目标**
- 与现有约定冲突时，以本文档为准；本文档未覆盖处，以现有核心组件（[`Workbench`](src/components/Workbench.tsx)、[`CaseList`](src/components/CaseList.tsx)、[`CaseDetail`](src/components/CaseDetail.tsx)）的实现风格为准

---

## 1. UI 设计规范

### 1.1 语义化颜色系统

> 定义在 [`src/index.css`](src/index.css) 的 `@theme` 块中，**禁止使用硬编码颜色值**，必须使用语义 Token 对应的 Tailwind 类名。

#### 1.1.1 品牌色（Brand Colors）

| Token | 色值 | Tailwind 类 | 用途 |
|-------|------|-------------|------|
| `--color-brand-primary` | #4f46e5 | `bg-brand-primary` / `text-brand-primary` | 主品牌色，主按钮、主链接、激活态 |
| `--color-brand-secondary` | #4780FF | `bg-brand-secondary` | 品牌辅助色，图标、装饰、信息色 |
| `--color-brand-accent` | #f59e0b | `bg-brand-accent` | 品牌强调色，徽章、标签 |

> 注意：项目已覆盖 `--color-indigo-600: #1e62ec`、`--color-indigo-500: #4780FF`，因此既有代码中的 `text-indigo-600` / `bg-indigo-600` 等价于品牌色，**新代码统一使用 `brand-*` 语义类**。

#### 1.1.2 背景色（Background Colors）

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-bg-base` | #f8fafc | 页面背景（手机屏幕底色 `bg-slate-50`） |
| `--color-bg-surface` | #ffffff | 卡片 / 组件背景 |
| `--color-bg-muted` | #f1f5f9 | 次级背景，分隔区域 |
| `--color-bg-elevated` | #ffffff | 浮层 / 弹窗背景 |

#### 1.1.3 文字色（Text Colors）

| Token | 色值 | 对比度 | 用途 |
|-------|------|--------|------|
| `--color-text-primary` | #0f172a | 15.5:1 | 主要文字（标题、正文主体） |
| `--color-text-secondary` | #475569 | 4.6:1 | 次要文字（说明、副标题） |
| `--color-text-muted` | #64748b | 4.5:1 | 辅助文字（时间、备注、占位） |
| `--color-text-inverse` | #ffffff | — | 反色文字（深色 / 品牌色背景上） |

#### 1.1.4 边框色（Border Colors）

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-border-default` | #e2e8f0 | 默认边框（卡片、分隔线） |
| `--color-border-muted` | #f1f5f9 | 次级边框 |
| `--color-border-strong` | #cbd5e1 | 强边框（强调容器） |

#### 1.1.5 语义色（Semantic Colors）

| 语义 | Token（前景 / 背景 / 边框） | 色值 | 用途 |
|------|------------------------------|------|------|
| 成功 | `success` / `success-bg` / `success-border` | #10b981 / #d1fae5 / #a7f3d0 | 操作成功、已结案 |
| 警告 | `warning` / `warning-bg` / `warning-border` | #f59e0b / #fef3c7 / #fde68a | 警告、待开庭 |
| 错误 | `error` / `error-bg` / `error-border` | #ef4444 / #fee2e2 / #fecaca | 错误、校验失败、删除 |
| 信息 | `info` / `info-bg` / `info-border` | #4780FF / #e0e7ff / #c7d2fe | 信息提示、审理中 |

#### 1.1.6 案件状态色（Case Status Colors）

| 状态 | 前景 Token | 背景 Token | 用途 |
|------|-----------|-----------|------|
| 审理中 | `--color-status-active` #4780FF | `--color-status-active-bg` #e0e7ff | 进行中的案件 |
| 待开庭 | `--color-status-pending` #f59e0b | `--color-status-pending-bg` #fef3c7 | 等待开庭 |
| 待签名 | `--color-status-signing` #f43f5e | `--color-status-signing-bg` #ffe4e6 | 等待签署 |
| 已结案 | `--color-status-resolved` #10b981 | `--color-status-resolved-bg` #d1fae5 | 已完结 |

> 状态徽章统一采用「浅底 + 深字 + 圆角」样式（如 `bg-status-active-bg text-status-active`），禁止使用纯深底色块。

#### 1.1.7 交互色（Interaction Colors）

| Token | 色值 | 用途 |
|-------|------|------|
| `--color-hover` | #4f46e5 | Hover 状态 |
| `--color-active` | #4338ca | Active / Pressed 状态 |
| `--color-focus` | #4780FF | Focus 状态（聚焦环） |

### 1.2 字体系统

#### 1.2.1 字体族

- **正文**：`--font-sans` = `"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif`
- **等宽**：`--font-mono` = `"JetBrains Mono", ui-monospace, SFMono-Regular, monospace`（用于时间、编号、金额、代码）

#### 1.2.2 统一字号阶梯（CSS Variables）

| Token | 字号 | Tailwind | 用途 |
|-------|------|----------|------|
| `--text-2xs` | 8px | `text-2xs` | 角标数字、微标签 |
| `--text-xs` | 10px | `text-xs` | 小标签、说明 |
| `--text-sm` | 12px | `text-sm` | 次要文字、辅助说明 |
| `--text-base` | 14px | `text-base` | **正文默认** |
| `--text-lg` | 16px | `text-lg` | 强调正文、小标题 |
| `--text-xl` | 18px | `text-xl` | 子区块标题 |
| `--text-2xl` | 20px | `text-2xl` | 区块标题 |
| `--text-3xl` | 24px | `text-3xl` | 页面主标题 |

#### 1.2.3 字重与行高

- 字重：Regular 400 / Medium 500 / Semibold 600 / Bold 700（Tailwind `font-normal|medium|semibold|bold`）
- 行高：标题 `leading-tight`（1.2）；正文 `leading-normal`（1.5）；长文本 `leading-relaxed`（1.75）

### 1.3 间距系统

> 统一以 4px 为基础单位，**禁止使用任意像素值**，必须使用下表 Token / Tailwind 类。

| Token | 尺寸 | Tailwind | 用途 |
|-------|------|----------|------|
| `--space-1` | 4px | `p-1` `gap-1` `m-1` | 图标与文字间隙、徽章内边距 |
| `--space-2` | 8px | `p-2` `gap-2` | 相关元素间隙、小组件内边距 |
| `--space-3` | 12px | `p-3` `gap-3` | 组件内部间距、统计块 |
| `--space-4` | 16px | `p-4` `gap-4` | 组件内边距、区块分隔 |
| `--space-5` | 20px | `p-5` `gap-5` | 卡片内边距、弹窗内容 |
| `--space-6` | 24px | `p-6` `gap-6` | 区块外边距、卡片组 |
| `--space-8` | 32px | `p-8` `gap-8` | 页面区块、主要布局间隙 |

### 1.4 圆角与阴影

- **圆角**：小元素 `rounded-lg`（8px）；卡片 / 弹窗 `rounded-xl`（12px）/ `rounded-2xl`（16px）；胶囊标签 `rounded-full`；手机外壳 `rounded-[48px]`
- **阴影**：卡片 `shadow-sm`；浮层 / 弹窗 `shadow-xl` / `shadow-2xl`；品牌色按钮可加 `shadow-indigo-900/50` 增强品牌感

### 1.5 组件规范

#### 1.5.1 卡片（Card）

- 背景 `bg-white`，边框 `border border-slate-200`（或 `border-slate-200/80`），圆角 `rounded-xl`
- 内边距 `p-4`（紧凑）/ `p-5`（标准）
- 可点击卡片：追加 `cursor-pointer active:bg-slate-50 transition-colors`，整卡可点

#### 1.5.2 按钮（Button）

| 类型 | 样式 | 用途 |
|------|------|------|
| 主按钮 | `bg-indigo-600 text-white rounded-lg px-4 py-2 font-medium` | 主要操作（提交、确认） |
| 次按钮 | `bg-white border border-indigo-600 text-indigo-600` | 辅助操作 |
| 幽灵按钮 | `bg-transparent text-slate-600` | 弱化操作 |
| 危险按钮 | `bg-red-500 text-white` | 删除、驳回 |

- 所有按钮统一 `rounded-lg`，内边距 `px-4 py-2`，字重 `font-medium`
- 必须有 `transition-colors duration-200`；可点元素须加 `cursor-pointer`
- 移动端**可点热区不小于 44×44px**

#### 1.5.3 输入框（Input）

- 边框 `border border-slate-200`，圆角 `rounded-lg`，内边距 `px-4 py-2`
- 聚焦：`focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`
- 占位文字使用 `text-slate-400`

#### 1.5.4 列表 / 表格

- 列表项之间以 `divide-y divide-slate-100` 或 `border-b border-slate-100` 分隔
- 表头背景 `bg-slate-50`，行 Hover `hover:bg-slate-50`

#### 1.5.5 状态徽章（Badge）

- 统一「浅底深字」：`bg-*-bg text-* rounded-full px-2 py-0.5 text-xs font-medium`
- 例：审理中 → `bg-status-active-bg text-status-active`

#### 1.5.6 底部 Tab 栏

- 高度 `h-14`，背景 `bg-white`，顶部 `border-t border-slate-100`
- 4 个 Tab 等分（`flex-1`），激活态 `text-indigo-600 font-extrabold`
- 待办角标：`bg-red-500 text-white text-2xs rounded-full`，显示 `pending` 数量

#### 1.5.7 手机模拟外壳（MiniProgramContainer）

- 外壳尺寸：`w-[400px] h-[840px]`，圆角 `rounded-[48px]`，边框 `border-[12px] border-slate-900`
- 顶部状态栏：`h-9`，显示模拟时间 + 信号 / 5G / WiFi / 电池
- 底部 Home 指示条：`h-4`，白色底 + `w-32 h-1 bg-slate-200 rounded-full`
- 内容区：`flex-1 bg-slate-50 overflow-hidden`，纵向 flex 布局

### 1.6 移动端布局规范

- **视口基准**：以 400px 宽度为设计基准，使用 `flex` 纵向布局；内容区 `overflow-y-auto no-scrollbar`
- **安全区域**：顶部状态栏 `h-9`、底部 Tab 栏 `h-14`、底部 Home 条 `h-4` 须预留，内容不得遮挡
- **栅格**：手机端不使用 12 栅格，统一使用 flex + Tailwind 间距；卡片之间 `gap-3` / `gap-4`
- **横向滚动**：使用 `overflow-x-auto no-scrollbar`，并加 `snap-x` 提升体验
- **弹层定位**：弹窗 / 抽屉使用 `fixed inset-0 z-50` + 半透明遮罩 `bg-black/50`

---

## 2. 交互行为规范

### 2.1 导航模型

本项目采用**状态驱动的单页导航**（不引入路由库）：

- **一级页面**：`activeTab`（0 首页 / 1 案件 / 2 待办 / 3 我的），由底部 Tab 栏切换
- **二级子页面**：`activeSubPage`（如 `caseDetail`、`transcriptSignature`、`postponementApproval` 等），子页面激活时**隐藏底部 Tab 栏**
- **进入子页面**：通过 `onNavigateToSubPage(page)` / `onSelectCase(caseItem)` 回调自底向上传递至 [`App`](src/App.tsx) 统一调度
- **返回**：每个子页面顶部须有「返回」按钮，调用 `onBack` 回调，并清空对应 `selected*` 状态
- **导航深度**：原则上不超过两级（列表 → 详情）；如确需三级，须维护明确的返回链，禁止出现「返回目标不明确」的死循环

### 2.2 页面结构约定

每个标准页面须包含以下结构（自上而下）：

1. **顶部导航栏**（`h-12` 左右）：左侧返回箭头（子页面）、居中 / 左对齐标题、可选右侧操作
2. **内容主体**：`flex-1 overflow-y-auto no-scrollbar`，纵向排列卡片
3. **底部操作区**（可选）：`sticky bottom-0` 固定主操作按钮

### 2.3 触摸与手势

- **可点击区域**：所有可交互元素热区 ≥ 44×44px；图标按钮用 `p-2` 撑大热区
- **点击反馈**：可点元素必须提供视觉反馈——`active:` 状态变色或 `active:scale-95` 轻微缩放
- **滚动**：纵向滚动区域统一加 `no-scrollbar` 隐藏滚动条；避免横向溢出导致整页左右抖动
- **下拉刷新 / 上拉加载**：长列表须实现加载更多与骨架屏（参见 2.6）
- **禁止**：禁用浏览器原生右键菜单、文本选中（操作类按钮加 `select-none`）；表单输入框除外

### 2.4 反馈与提示

| 场景 | 形式 | 规范 |
|------|------|------|
| 操作成功 | 轻提示 Toast | 顶部 / 中部短暂出现，1.5–2s 自动消失，`animate-slide-down` |
| 操作失败 / 校验错误 | Toast 或行内错误 | 红色 `text-error`，明确说明原因 |
| 危险操作确认 | 居中确认弹窗 | `fixed inset-0 z-50` + 遮罩，主按钮用危险色 |
| 加载中 | 骨架屏 / Spinner | 优先骨架屏，保持布局稳定（参见 2.6） |
| 空状态 | 空态插图 + 文案 + 引导按钮 | 不得出现「白屏」 |

### 2.5 动效规范

#### 2.5.1 内置动画（`--animate-*`）

| 类名 | 用途 |
|------|------|
| `animate-slide-in` | 抽屉 / 侧滑面板从右滑入（0.28s） |
| `animate-slide-down` | Toast / 顶部提示从上滑入（0.24s） |
| `animate-fade-in` | 淡入（0.2s） |
| `animate-scale-up` | 弹窗 / 徽章弹出（0.4s，带回弹） |
| `animate-scan-line` | 扫描线等循环装饰（1.6s 循环） |

#### 2.5.2 动效原则

- **时长**：快 150ms / 常规 250ms / 慢 400ms
- **缓动**：优先 `cubic-bezier(0.16, 1, 0.3, 1)`（ease-out 系）与 `cubic-bezier(0.34, 1.56, 0.64, 1)`（回弹）
- **仅使用 `transform` 与 `opacity`**，禁止动画 `width/height/top/left` 等触发重排的属性
- **复杂序列动效**（如签署流程、扫描动效）使用 `motion` 库；简单过渡使用 CSS / Tailwind `transition-*`
- **必要性**：动效须服务于功能反馈，禁止纯装饰性动效干扰阅读

### 2.6 数据状态与加载

- **加载态**：首屏 / 列表使用骨架屏（与最终布局同构的灰色占位块）；按钮内提交使用 `Spinner + 禁用`
- **过渡类名**：骨架块 `animate-pulse bg-slate-200`
- **空状态**：展示插图 / 图标 + 文案（如「暂无案件」）+ 可选引导操作
- **错误态**：展示错误说明 + 「重新加载」按钮，不得直接白屏
- **乐观更新**：任务完成、签署等操作可乐观更新 UI，失败后回滚并提示

### 2.7 表单交互

- **实时校验**：失焦或输入时即时校验，错误信息显示在输入框下方 `text-error text-xs`
- **提交防重**：提交按钮在请求期间 `disabled`，避免重复提交
- **键盘适配**：金额 / 手机号输入使用 `inputMode="numeric|tel"`；搜索框使用 `enterKeyHint="search"`
- **长表单**：分组卡片 + 吸底提交按钮，输入区不被键盘遮挡

---

## 3. 性能优化规范

### 3.1 渲染性能

- **组件拆分**：单组件行数建议 ≤ 300 行；超大页面（如 [`Workbench`](src/components/Workbench.tsx)）须按区块拆分子组件
- **列表渲染**：所有 `.map()` 渲染必须提供稳定唯一的 `key`（优先业务 id，避免用数组 index）
- **避免内联对象 / 函数**：传给子组件的 props 函数与对象应 `useCallback` / `useMemo` 包裹，避免子组件无谓重渲染
- **派生计算**：过滤、排序、统计等派生数据使用 `useMemo`（参考 [`CaseList`](src/components/CaseList.tsx) 的过滤逻辑）
- **条件渲染**：弹窗 / 抽屉等重型 DOM 按需挂载（`{show && <Modal/>}`），避免长期占驻 DOM

### 3.2 状态管理

- **全局状态集中在 [`App`](src/App.tsx)**：数据（cases、tasks 等）与跨页共享状态提升至 App 层，通过 props 下发
- **就近原则**：仅单组件使用的状态保持在组件内部，不要全局化
- **不可变更新**：始终返回新引用（`prev => prev.map(...)`），禁止直接 mutate state
- **状态合并**：相关联的多个状态考虑合并为单一对象（如 `personalInfo`），减少多次 `setState`

### 3.3 资源与包体积

- **图标按需引入**：`lucide-react` 采用具名导入（`import { Search } from 'lucide-react'`），支持 tree-shaking
- **图片优化**：banner / logo 等静态资源置于 `public/`，按显示尺寸提供合适分辨率；列表缩略图须压缩
- **代码分割**：Vite 生产构建默认按动态 `import()` 分割；大尺寸第三方库按需加载
- **依赖审查**：新增依赖前评估体积，避免引入功能重复的库

### 3.4 网络与数据

- **请求合并**：进入页面时的多个独立请求并发执行，避免串行
- **缓存与防抖**：搜索输入使用防抖（300–500ms）后再发请求（参考 [`CaseList`](src/components/CaseList.tsx) 搜索）
- **分页 / 虚拟列表**：超长列表（>100 条）采用分页或虚拟滚动，首屏只渲染可视区
- **Mock 优先**：当前阶段数据来源于 [`mockData`](src/data/mockData.ts)，对接真实接口时须保持相同数据结构（见 [`types.ts`](src/types.ts)）

### 3.5 定时器与副作用

- 所有 `setInterval` / `setTimeout` **必须在 `useEffect` 清理函数中清除**（参考 [`MiniProgramContainer`](src/components/MiniProgramContainer.tsx) 的时间更新、[`Workbench`](src/components/Workbench.tsx) 的新闻轮播）
- 依赖外部变量的定时器，将其依赖写入 `useEffect` 依赖数组，避免闭包过期
- 轮播 / 滚动等动画在组件卸载时必须停止

---

## 4. 兼容性要求

### 4.1 设备与屏幕

- **设计基准**：宽度 400px（iPhone 系列主流逻辑宽度）；须在 360px–414px 区间良好显示
- **适配方式**：使用 `flex` + 相对单位 + Tailwind 响应式断点；关键固定尺寸（如手机外壳）允许使用 `w-[400px]` 字面量
- **桌面预览**：`MiniProgramContainer` 的「全屏自适应」模式（`max-w-6xl`）须保持可用，不得因仅适配手机而布局错乱

### 4.2 浏览器与平台

| 平台 | 要求 |
|------|------|
| 微信内置浏览器（iOS / Android） | **首要目标**，须完整通过 |
| iOS Safari ≥ 14 | 完整支持 |
| Android Chrome / 系统浏览器 ≥ 90 | 完整支持 |
| 桌面 Chrome / Edge（最新两版） | 用于开发预览，须可用 |

### 4.3 CSS / JS 兼容

- **CSS 目标**：`tsconfig` 的 `target: ES2022`；Tailwind 4 自动处理厂商前缀（配合 `autoprefixer`）
- **避免使用**：低兼容性 API（如 `backdrop-filter` 需加 `-webkit-` 前缀；`gap` 在旧 flex 上不支持时回退 margin）
- **1px 边框**：高清屏下使用 `border` + Tailwind 默认宽度，避免 `0.5px` 导致的兼容差异
- **安全区**：全面屏顶部 / 底部使用 `env(safe-area-inset-*)` 预留（真实手机运行时）

### 4.4 字体兼容

- 字体通过 [`src/css/googleapis.css`](src/css/googleapis.css) 引入 `Plus Jakarta Sans` / `JetBrains Mono`
- 字体加载失败时须平滑回退到 `system-ui` 等系统字体（已在 `--font-sans` 链中声明）
- 中文正文依赖系统默认中文字体，不强制引入中文字体（体积过大）

---

## 5. 代码风格规范

### 5.1 目录结构

```
src/
├── components/        # 页面与业务组件（每个组件一个 .tsx）
├── css/               # 字体等外部 CSS 引入
├── data/              # Mock 数据（mockData.ts）
├── App.tsx            # 顶层状态机与页面调度
├── index.css          # @theme Token 定义 + 全局样式
├── main.tsx           # 入口
└── types.ts           # 全局共享类型定义
```

### 5.2 命名约定

| 对象 | 约定 | 示例 |
|------|------|------|
| 组件文件 | 大驼峰 `.tsx` | `CaseList.tsx`、`MyProfile.tsx` |
| 组件 / 类型 | 大驼峰 | `CaseDetail`、`ArbitratorProfile` |
| 函数 / 变量 | 小驼峰 | `formatCNY`、`selectedStatusFilter` |
| 常量 | 大写下划线 | `MAX_RETRY` |
| Props 接口 | `组件名 + Props` | `interface CaseListProps` |
| 事件处理 | `on/handle + 动词` | `onSelectCase`、`handleSubmit` |
| 布尔状态 | `is/has/show + 名词` | `isLoggedIn`、`showFilterDrawer` |
| CSS Token | `kebab-case` | `--color-brand-primary` |

### 5.3 TypeScript 规范

- **组件签名**：函数组件 + `interface XxxProps` + `export default function Xxx(props: XxxProps)`
- **禁止 `any`**：特殊情况不可避免时须注释说明；共享类型集中在 [`types.ts`](src/types.ts)
- **字面量联合类型**：状态、角色等有限集合使用字面量联合（如 `type CaseStatus = '审理中' | '待开庭' | '已结案' | '待签名'`），**禁止用魔法字符串散落各处**
- **显式标注**：`useState` 标注泛型（`useState<boolean>(false)`），函数返回值复杂时标注
- **路径别名**：统一使用 `@/*`（已配置），或相对路径 `../types`，保持文件内一致

### 5.4 React 规范

- **仅使用函数组件 + Hooks**，禁止 class 组件
- **Hooks 顺序**：`useState` → `useMemo` → `useEffect` → 事件处理函数 → `return JSX`
- **副作用清理**：定时器、订阅、事件监听必须在 `useEffect` return 中清理
- **条件渲染优先三元 / `&&`**；复杂分支抽函数返回 JSX
- **列表 key**：必须使用稳定唯一 id

### 5.5 样式规范

- **首选 Tailwind 原子类**；仅在 Tailwind 无法表达时使用 `style={{}}`（如动态计算的尺寸 / 位置）
- **语义 Token 类**：颜色、字号、间距一律使用 1.x 节定义的语义类，禁止硬编码
- **类名顺序建议**：布局 → 尺寸 → 间距 → 边框 → 背景 → 文字 → 交互态（如 `flex items-center w-full p-4 rounded-xl bg-white text-slate-800 hover:bg-slate-50`）
- **自定义全局样式**：统一写入 [`index.css`](src/index.css)，禁止散落 `<style>` 标签

### 5.6 注释规范

- **文件 / 复杂逻辑**：用中文简明注释「为什么」，而非「做什么」
- **类型 / 接口**：字段含义用 `//` 行注释说明（参考 [`types.ts`](src/types.ts)）
- **临时屏蔽代码**：禁止保留无说明的注释代码；`Workbench copy.tsx` 等历史文件应及时清理

### 5.7 提交与质量控制

- **类型检查**：提交前须通过 `npm run lint`（即 `tsc --noEmit`），**零 TS 错误**
- **构建检查**：`npm run build` 须成功通过
- **命名提交**：遵循约定式提交（`feat: / fix: / style: / refactor: / docs: / chore:`），正文用中文描述变更目的
- **禁止提交**：`.env.local`、`dist/`、`node_modules/`、`server.js` 等产物与密钥文件（见 `.gitignore`）

---

## 6. 安全标准

### 6.1 凭据与密钥

- **API Key**：`GEMINI_API_KEY` 等密钥仅写入 `.env.local` / `.env.example`（示例用占位值），**严禁硬编码进源码或提交真实密钥**
- **前端不存放任何长期凭据**：敏感令牌须由后端通过 HttpOnly Cookie 或短时效机制下发
- **环境变量**：通过 `dotenv` 在构建期注入；运行期不得暴露服务端密钥

### 6.2 输入与输出安全

- **XSS 防护**：React 默认转义插值，**禁止使用 `dangerouslySetInnerHTML`**；确需渲染富文本时须先经过白名单过滤（如 DOMPurify）
- **输入校验**：所有用户输入（搜索、表单）在使用前必须校验类型与长度，拒绝非法值
- **URL 跳转**：涉及外部链接跳转时须校验协议白名单（仅允许 `https:` / `http:`），防止 `javascript:` 注入

### 6.3 数据安全

- **敏感信息脱敏**：身份证号、银行卡号、手机号在界面展示时须脱敏（如 `6223 8812 **** 0918`，参考 [`App`](src/App.tsx) 的 `bankInfo`）
- **最小暴露**：前端仅持有完成当前业务所需的最少数据；案件当事人完整证件号等不下发到前端
- **日志**：禁止在控制台打印敏感信息（`console.log` 不输出密钥、证件号、token）

### 6.4 网络与接口

- **HTTPS**：生产环境全站强制 HTTPS；`WebFetch` / 外部资源统一升级为 HTTPS
- **请求鉴权**：所有业务接口须携带鉴权头；token 过期须引导重新登录
- **防重放**：签署、审批等关键写操作须由后端做幂等控制，前端配合防重提交（参见 2.3 / 2.7）

### 6.5 依赖与供应链

- **依赖来源**：仅从官方 npm 仓库安装；新增依赖前评估维护状态与已知漏洞
- **漏洞扫描**：定期执行 `npm audit`，高危漏洞须立即升级修复
- **锁文件**：`package-lock.json` 须提交，保证依赖版本可复现

### 6.6 无障碍（Accessibility）

- 对比度满足 WCAG AA：正文 ≥ 4.5:1，大字（≥18px 或 ≥14px 加粗）≥ 3:1（当前 Token 已满足，见 1.1.3）
- 可交互元素提供 `aria-label`（如图标按钮）、`aria-current`（当前 Tab，参考底部导航实现）
- 所有动画尊重 `prefers-reduced-motion`（已在 [`index.css`](src/index.css) 全局处理）
- 触摸热区 ≥ 44×44px；聚焦环 `focus:ring-2`

---

## 7. 开发工作流（附录）

### 7.1 本地启动

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器（端口 3000，host 0.0.0.0）
npm run lint         # TypeScript 类型检查（tsc --noEmit）
npm run build        # 生产构建
npm run preview      # 预览构建产物
```

### 7.2 关键约定速查

| 项 | 约定 |
|----|------|
| 视口基准 | 400×840 手机模拟（[`MiniProgramContainer`](src/components/MiniProgramContainer.tsx)） |
| 导航 | 状态机：`activeTab` + `activeSubPage`，无路由库 |
| 样式 | Tailwind 4 + 语义 Token，禁止硬编码颜色 / 像素 |
| 图标 | `lucide-react` 具名导入优先 |
| 动画 | 内置 `--animate-*`；复杂用 `motion`；仅 transform/opacity |
| 类型 | 集中于 [`types.ts`](src/types.ts)，禁 `any` |
| 安全 | 密钥入 `.env`；敏感信息脱敏；禁 `dangerouslySetInnerHTML` |
| 质检 | 提交前 `npm run lint` + `npm run build` 双通过 |

---

*本规范随项目演进持续更新；新增 / 变更约定须同步修订本文档并标注日期。*

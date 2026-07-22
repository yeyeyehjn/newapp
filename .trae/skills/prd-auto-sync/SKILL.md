---
name: "prd-auto-sync"
description: "Auto-syncs the 穗仲云仲裁员 PRD docs (Markdown to HTML) after project source files change. Invoke when project files are updated/modified and PRD needs syncing, or when user requests a PRD update/sync."
---

# PRD 文档自动同步

当项目源文件发生更新后，自动同步更新 PRD 文档（Markdown 与 HTML 双版本），确保文档与代码保持一致。

## 触发条件

**必须在此技能被调用时立即执行以下完整流程：**

- 项目源文件（`src/` 目录下的组件、页面、服务等）发生更新后
- 用户明确要求"更新 PRD"、"同步 PRD 文档"、"刷新文档"时
- 用户完成功能开发或修改后，需要同步文档时

## 关键文件路径

| 文件 | 用途 |
|------|------|
| `穗仲云仲裁员_PRD_V1.0.md` | PRD Markdown 源文档（主文档） |
| `穗仲云仲裁员_PRD_V1.0.html` | PRD HTML 展示版（从 MD 同步生成） |
| `src/` | 项目源代码目录（变更检测范围） |

> **注意：** 以上文件均位于项目根目录 `d:\黄佳楠\桌面\小程序管理系统\` 下。

## 完整执行流程

### 步骤 1：检测与分析文件变更

1. **扫描项目源文件变更：**
   - 使用 `git status` 和 `git diff` 检测自上次 PRD 更新以来的源文件变更
   - 重点关注 `src/` 目录下的 `.tsx`、`.ts`、`.jsx`、`.js`、`.vue`、`.css`、`.scss` 文件
   - 记录所有新增、修改、删除的文件

2. **分析变更影响范围：**
   - 读取发生变更的源文件，理解功能层面的改动
   - 将代码变更映射到 PRD 文档中的对应章节
   - 形成变更摘要清单（哪些功能模块受影响、需要更新哪些 PRD 章节）

3. **若无实质性变更：**
   - 如果检测到的变更不影响 PRD 内容（如纯格式化、注释修改），则跳过后续步骤，直接生成"无需更新"的报告

### 步骤 2：更新 PRD Markdown 文档

根据步骤 1 的分析结果，更新 `穗仲云仲裁员_PRD_V1.0.md`：

1. **读取当前 MD 文档完整内容**
2. **针对性更新对应章节：**
   - 功能新增：在对应章节添加新的页面结构、字段规则、交互说明
   - 功能修改：更新已有章节中的组件描述、字段定义、业务规则
   - 功能删除：移除或标注废弃的相关章节内容
3. **保持文档格式一致性：**
   - 标题层级：`#` 一级标题、`##` 章节标题、`###` 子章节、`####` 字段级
   - 表格格式：标准 Markdown 表格语法（`| 列 | 列 |` + `|---|---|`）
   - 列表格式：有序列表用 `1.`，无序列表用 `-`
   - 代码标记：行内代码用反引号 `` ` `` 包裹
4. **写入更新后的 MD 文件**

### 步骤 3：检查 HTML 版本是否存在

检查 `穗仲云仲裁员_PRD_V1.0.html` 是否存在：

- **若不存在（首次创建）：**
  1. 读取更新后的 MD 文件完整内容
  2. 按照下方「Markdown 转 HTML 规范」生成完整 HTML 文件
  3. 写入 `穗仲云仲裁员_PRD_V1.0.html`
  4. 记录日志：「HTML 文件首次创建」

- **若已存在（增量同步）：**
  1. 读取现有 HTML 文件，提取 `<head>` 中的 `<style>` 样式模板
  2. 读取更新后的 MD 文件完整内容
  3. 将 MD 内容转换为 HTML body 片段
  4. 将转换后的 body 内容与原有样式模板重新组合
  5. 写入更新后的 HTML 文件
  6. 记录日志：「HTML 文件增量更新」

### 步骤 4：Markdown 转 HTML 转换（核心）

#### HTML 文件结构模板

HTML 文件必须保持以下结构：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>穗仲云仲裁员 PRD V1.0</title>
  <style>
    /* === 保留原有完整样式，不得删改 === */
    /* 包含亮色/暗色模式变量、排版、表格、代码块等全部样式 */
  </style>
</head>
<body>
  /* === Markdown 转换后的 HTML 内容 === */
</body>
</html>
```

#### 样式模板（必须保留，不可修改）

以下 `<style>` 内容是 HTML 文件的固定样式模板。增量更新时必须原样保留，仅替换 `<body>` 内的内容：

```css
:root {
  --fg: #1a1a1a;
  --bg: #ffffff;
  --muted: #666;
  --border: #e2e2e2;
  --accent: #2563eb;
  --code-bg: #f5f5f5;
  --th-bg: #f8f8f8;
}
@media (prefers-color-scheme: dark) {
  :root {
    --fg: #e0e0e0;
    --bg: #1a1a1a;
    --muted: #999;
    --border: #333;
    --accent: #60a5fa;
    --code-bg: #2a2a2a;
    --th-bg: #242424;
  }
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif;
  line-height: 1.8;
  color: var(--fg);
  background: var(--bg);
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}
h1 { font-size: 1.6rem; margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 2px solid var(--accent); }
h2 { font-size: 1.3rem; margin: 28px 0 12px; }
h3 { font-size: 1.1rem; margin: 20px 0 8px; }
h4 { font-size: 1rem; margin: 16px 0 8px; }
p { margin: 8px 0; }
ul, ol { margin: 8px 0 8px 24px; }
li { margin: 4px 0; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 0.9rem; }
th, td { border: 1px solid var(--border); padding: 6px 12px; text-align: left; }
th { background: var(--th-bg); font-weight: 600; }
tr:nth-child(even) { background: var(--code-bg); }
code { background: var(--code-bg); padding: 2px 6px; border-radius: 3px; font-size: 0.85em; }
pre { background: var(--code-bg); padding: 12px 16px; border-radius: 6px; overflow-x: auto; margin: 12px 0; }
pre code { background: none; padding: 0; }
blockquote { border-left: 4px solid var(--accent); padding-left: 16px; color: var(--muted); margin: 12px 0; }
hr { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
strong { font-weight: 600; }
```

#### Markdown 到 HTML 元素映射规则

| Markdown 语法 | HTML 输出 |
|--------------|-----------|
| `# 标题` | `<h1>标题</h1>` |
| `## 标题` | `<h2>标题</h2>` |
| `### 标题` | `<h3>标题</h3>` |
| `#### 标题` | `<h4>标题</h4>` |
| 普通段落 | `<p>段落内容</p>` |
| `- 列表项` | `<ul><li>列表项</li></ul>` |
| `1. 列表项` | `<ol><li>列表项</li></ol>` |
| `**粗体**` | `<strong>粗体</strong>` |
| `*斜体*` | `<em>斜体</em>` |
| `` `代码` `` | `<code>代码</code>` |
| `> 引用` | `<blockquote>引用</blockquote>` |
| `---` | `<hr>` |
| `[文本](url)` | `<a href="url">文本</a>` |
| `\| 表格 \|` | `<table>...<thead>...<tbody>...</table>` |

#### 表格转换规范

Markdown 表格必须按以下格式转换：

```html
<table>
<thead>
<tr>
<th>列名1</th>
<th>列名2</th>
</tr>
</thead>
<tbody>
<tr>
<td>值1</td>
<td>值2</td>
</tr>
</tbody>
</table>
```

**表格注意事项：**
- 空单元格用 `<td><br /></td>` 表示
- 表头行放入 `<thead><tr>` 中
- 数据行放入 `<tbody>` 中
- 单元格内的 `<br />` 换行需保留

### 步骤 5：增量更新策略

为提高效率，采用增量更新而非全量重建：

1. **MD 增量更新：** 只修改受影响的章节，保留未变更章节的原有内容
2. **HTML 增量更新：**
   - 提取并保留 HTML 文件中的 `<head>` 和 `<style>` 部分（样式模板固定不变）
   - 仅将更新后的 MD body 部分重新转换
   - 重组为完整 HTML 文件
3. **避免全量重写：** 如果只有个别章节变更，不要重写整个文档

### 步骤 6：错误处理机制

每个环节必须包含错误检测与处理：

| 错误场景 | 处理方式 |
|---------|---------|
| MD 文件不存在 | 终止流程，报告错误：「PRD Markdown 文件未找到」 |
| MD 文件读取失败 | 终止流程，报告错误：「Markdown 文件读取失败: {错误详情}」 |
| HTML 文件样式模板缺失 | 使用步骤 4 中的默认样式模板重新生成 |
| HTML 写入失败 | 终止流程，报告错误：「HTML 文件写入失败: {错误详情}」 |
| MD 内容格式异常 | 记录警告，尝试最佳 effort 转换，在报告中标注异常段落 |
| git 命令执行失败 | 降级为全量对比模式，扫描所有源文件 |

**错误处理原则：**
- 任何步骤失败时，立即停止并输出明确错误信息
- 已完成的步骤需回滚或保持原状（不写半成品文件）
- 错误信息需包含：失败步骤、错误原因、建议修复方案

### 步骤 7：生成操作报告

流程完成后，必须向用户输出操作报告：

```
═══════════════════════════════════
  PRD 文档同步报告
═══════════════════════════════════

【执行状态】 成功 / 部分成功 / 失败

【变更检测】
  - 检测到 N 个源文件变更
  - 变更文件列表：
    1. src/components/XXX.tsx (修改)
    2. src/pages/YYY.tsx (新增)
    ...

【PRD 更新摘要】
  - 更新章节：X 个
    · 第三章 登录 - 更新字段规则
    · 第五章 案件列表 - 新增筛选功能描述
    ...
  - 新增章节：X 个
  - 删除/废弃章节：X 个

【HTML 同步状态】
  - HTML 文件：穗仲云仲裁员_PRD_V1.0.html
  - 同步方式：增量更新 / 首次创建
  - 样式模板：保留原有 / 使用默认

【执行耗时】
  - 变更检测：Xs
  - MD 更新：Xs
  - HTML 同步：Xs
  - 总计：Xs

【警告/异常】
  - (如有异常则列出，无则显示"无")
═══════════════════════════════════
```

## 执行注意事项

1. **转换准确性：** MD 到 HTML 的转换必须严格保留文档结构，不得遗漏或篡改内容
2. **样式一致性：** HTML 样式模板是固定的，任何情况下都不得修改 `<style>` 内容（除非用户明确要求）
3. **中文支持：** 所有内容为中文，确保 HTML 的 `lang="zh-CN"` 和 `<meta charset="UTF-8">` 正确设置
4. **特殊字符处理：** MD 中的 `<`、`>`、`&` 等字符在 HTML 中需正确转义为 `&lt;`、`&gt;`、`&amp;`（代码块内除外）
5. **空行处理：** MD 中的空行在 HTML 中不生成额外标签，段落间间距由 CSS 控制

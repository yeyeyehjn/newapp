# 案件详情页 Tab 结构重构（7→5）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `src/components/CaseDetail.tsx` 从 7 个顶层 tab 重构为 5 个（基本信息 / 案情及当事人材料 / 证据和质证 / 仲裁文书 / 电子卷宗），同时把当前文件备份为 `CaseDetail2.tsx`。

**Architecture:** 原地重构单文件；顶层 tab 数组由 7 项改 5 项，`activeTab` 联合类型同步收缩；把原 `parties`/`requests`/`materials` 片段重组为 `casefile`，原 `signature`/`review` 合并为 `award`；`evidence` 原样保留；新增 `archive` 占位。App.tsx 的 `caseItem`/`onBack`/跳转回调不变。

**Tech Stack:** React + TypeScript + Tailwind; lucide-react 图标; 沿用现 IOSDialog。

## Global Constraints（承自 spec，verbatim）
- 备份策略：用 Shell `Copy-Item` 将 `src/components/CaseDetail.tsx` 复制为 `src/components/CaseDetail2.tsx`，`App.tsx` 不改 import。
- `activeTab` 新值：`'basic' | 'casefile' | 'evidence' | 'award' | 'archive'`。
- 语义色单一映射：取消请求/反请求独立 accent 色（indigo/amber 只留给附件/链接），同屏仅保留 `申请人=emerald / 被申请人=red`。
- 附件胶囊 chip 统一样式 `flex items-center gap-1 text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100/80 transition-colors`。
- 办案秘书若现有 mock 无电话/邮箱则补字段，且电话/邮箱做成可点击（`tel:`/`mailto:`）。
- 请假勿回退：P0 签名二次确认（IOSAlert）、P1 跳转回调/降级能力必须保留。
- 验收：`npm run lint` 零错误；桌面 1280 + 移动 400 渲染正常；5-tab 键盘导航通过。

---

### Task 1: 备份当前文件

**Files:**
- Archive: `src/components/CaseDetail2.tsx`

**Interfaces:**
- Consumes: 现有 `src/components/CaseDetail.tsx`
- Produces: `src/components/CaseDetail2.tsx`（内容与当前 CaseDetail 完全一致）

- [ ] **Step 1: 复制备份**

```powershell
cd "d:\黄佳楠\桌面\小程序管理系统"; Copy-Item "src\components\CaseDetail.tsx" "src\components\CaseDetail2.tsx"
```

- [ ] **Step 2: 验证复制成功**

Run: `git status`
Expected: `CaseDetail2.tsx` 出现在 untracked 列表。

- [ ] **Step 3: Commit**

```bash
git add src/components/CaseDetail2.tsx
git commit -m "chore: 备份案件详情页为 CaseDetail2.tsx 存档"
```

---

### Task 2: 收缩顶层 tab 与 activeTab 类型

**Files:**
- Modify: `src/components/CaseDetail.tsx`

**Interfaces:**
- Consumes: 现有 `CaseDetailTab` 类型（约 L6-13）、`activeTab` state（约 L259）
- Produces: 新 `CaseDetailTab = 'basic' | 'casefile' | 'evidence' | 'award' | 'archive'`；tab 数组与键盘导航对象改为 5 项

- [ ] **Step 1: 改 tab 类型与导航**

把 `CaseDetailTab` 联合类型与 `initialTab` 默认值、`TABS`/`TAB_KEY_MAP`（含 `DIRECTION_KEYS` 支持）改为 5 项：

```ts
// 类型
export type CaseDetailTab = 'basic' | 'casefile' | 'evidence' | 'award' | 'archive';
// 顶部 tab 标签映射（label + key），5 项：
['基本信息','basic'],['案情及当事人材料','casefile'],['证据和质证','evidence'],['仲裁文书','award'],['电子卷宗','archive']
```

对照现有 `TABS` 数组替换为上面 5 项；tab 键盘导航（方向键 + `scrollTo` 居中）沿用现有实现，只是条目数变 5。

- [ ] **Step 2: 不单独验收/提交** —— tab 类型与 tab 数组的定义在 Task 3 中作为首步落笔，并同步改写对应渲染分支；保证只有 Task 3 结束时 `npm run lint` 为真，避免中间态编译失败。本 Task 仅停留在「写出类型与数组定义」源码草稿，不提交。

---

### Task 3: 重组渲染分支为 5 tab（basic / casefile / award / archive）

**Files:**
- Modify: `src/components/CaseDetail.tsx`（渲染区约 L693-L1238 的 `{activeTab === 'basic' && ...}` 等分支）
- Read: `src/components/PartyGroup.tsx`（确认可复用 props）
- Read: `src/data/mockData.ts` 里案件字段（办案秘书是否含 phone/email）

**Interfaces:**
- Consumes: `caseItem`、原 parties/requests/materials/signature/review 区块的 JSX 与 const 数据
- Produces: 新的 4 个渲染区块（basic 精简、casefile、award、archive），`evidence` 原样保留

- [ ] **Step 1: basic 区块**：保留 banner + 案件要点 + 办案秘书（若无 phone/email 字段则在组件内 const 补充，并用 `href="tel:"`/`mailto:`）+ AI 摘要；删除待办卡渲染；awaitable 缺口用现有字段兜底。

- [ ] **Step 2: casefile 区块**：把原 `parties`（改为：申请人/申请人代理人/被申请人/被申请人代理人，默认「身份类型+名字」，点名字展开详情——默认展开主当事人身份，代理人收起）与 `requests`（请求和答辩 + 反请求和答辩，默认折叠，含计数）与「其他附件」兜底合并为长滚 + `aria-expanded` 折叠模块。材料 PDF 拆分挂段落（见 spec §3.2）。

- [ ] **Step 3: award 区块**：上部核阅区（原 review），下部签名区（原 signature 含签名二次确认 IOSAlert 与去签名/降级逻辑）；未签/待核阅红点徽章在此呈现。

- [ ] **Step 4: archive 区块**：空态「电子卷宗 · 后续实现」。

- [ ] **Step 5: evidence 区块**：原样保留不动（含附件胶囊 chip 统一样式不得回退）。

- [ ] **Step 6: 清理**：删除不再被引用的旧 tab key（parties/requests/materials/signature/review）遗留分支，保证 tsc 零错。

Run: `npm run lint`；`npm run dev` 手工验证 5 tab 切换 + 键盘导航。

- [ ] **Step 7: Commit**

```bash
git add src/components/CaseDetail.tsx
git commit -m "refactor: 案件详情重组为 5 tab 结构"
```

---

### Task 4: 语义色收敛 + 附件样式核对

**Files:**
- Modify: `src/components/CaseDetail.tsx`（请求/反请求 accent、附件 chip）
- Modify: `DESIGN.md`（补语义色映射一句）

**Interfaces:**
- Consumes: Task 3 的 casefile/award 渲染结果
- Produces: 同屏仅 `申请人=emerald / 被申请人=red` 的当事人语义；indigo/amber 只保留在附件/链接与系统交互元素

- [ ] **Step 1: 收敛色**：请求段标签由 indigo/amber 独立 accent 改为沿用当事人语义（本请求→被申请人 red 字段组协调；反请求→申请人 emerald 字段组协调），附件/链接保持 indigo。

- [ ] **Step 2: 核对附件 chip**：casefile 内所有附件（各段附件、其他附件、答辩附件）统一为 §Global-Constraint 的胶囊样式。

Run: `npm run lint`

- [ ] **Step 3: Commit**

```bash
git add src/components/CaseDetail.tsx DESIGN.md
git commit -m "refactor: 收敛语义色映射并统一附件胶囊样式"
```

---

### Task 5: 全量验收

**Files:**
- 无（仅验证）

**Interfaces:**
- Consumes: 全部前述任务输出

- [ ] **Step 1: 类型检查**

Run: `npm run lint`
Expected: 零错误。

- [ ] **Step 2: 浏览器验证**（Playwright，400px + 1280px）：
- 启动 `npm run dev`，进入案件详情，确认 5 个 tab 标签、键盘方向键切换、scrollTo 居中。
- 分别切到 basic/casefile/evidence/award/archive，确认各模块渲染、折叠默认态、签名单交互弹窗仍在。
- 截图留档。

- [ ] **Step 3: 复核备份未被 App import 切换**：`grep -n "CaseDetail" src/App.tsx` 应只引用 `CaseDetail`（非 CaseDetail2）。

- [ ] **Step 4: Commit（如有遗留修复）**

```bash
git add -A
git commit -m "test: 案件详情重构验收修复"
```
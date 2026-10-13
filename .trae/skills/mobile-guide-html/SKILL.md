---
name: "mobile-guide-html"
description: "Generate a screenshot-first HTML operation guide for a mobile H5 / mini-program project, using real Playwright screenshots and DESIGN.md-compliant styling. Invoke when the user asks for 图文操作指引 / 操作手册 / 使用手册 HTML for a mobile app or mini-program."
---

# 移动端图文操作指引生成器

为「移动端 H5 / 小程序」类项目产出**以真实运行截图为主、文字为辅**的图文操作指引，输出**单文件 HTML**。

核心原则：**图多字少**。每张截图配 ≤1 句说明；不做 HTML 示意图还原，只采集真实运行界面。

---

## 一、何时使用

满足以下任一条件时调用：

- 用户要求「图文操作指引 / 操作手册 / 使用手册」，且阅读对象是**业务角色**（仲裁员、审批人、律师、运营等）
- 明确要求「以截图或图形化内容展示」「少量文字辅助说明」
- 明确要求「输出 HTML」
- 为移动端 App / 小程序 / H5 编写新手指引、模块说明、培训材料

不适用：桌面端后台系统（改用现有文档模板）、纯文字需求文档（用 prd-writer）、需要交互演示的原型（用原型类 skill）。

---

## 二、产出物

```
<project>/docs/
├── <角色>操作指引.html        # 单文件指引，内联 CSS，无外部依赖
└── guide-assets/              # 截图资源目录
    ├── 01-<模块>-<页面>.png
    ├── 02-...
    └── NN-...
```

- HTML 用**相对路径** `guide-assets/xx.png` 引用图片，交付时需说明「HTML 与 guide-assets 必须同目录存放」。
- **不新建 README、不新建说明文档**，只交付这两项。

---

## 三、工作流

### 步骤 0：必读设计规范（不可跳过）

若项目根目录存在 `DESIGN.md`，**必须先完整阅读**，指引自身的视觉规范必须与其一致（色系、字号阶梯、圆角、阴影、字体、组件样式）。若不存在，按第四节默认规范执行。

同时建议扫一眼主容器组件（如 `MiniProgramContainer.tsx`）与状态机入口（如 `App.tsx`），确认：

- 页面切换方式（有路由库 / 纯状态机）
- 手机外壳选择器特征（用于截图裁剪）
- 全部子页清单与各自的入口按钮文案

### 步骤 1：启动项目并确认地址

用后台任务启动 dev server，不要阻塞：

```bash
npm run dev
```

确认端口可访问后再进入下一步。注意：**同一命令不要重复启动**。

### 步骤 2：用 Playwright 采集真实截图

> 优先使用已连接的 Playwright MCP（工具名通常为 `playwright_navigate` / `playwright_evaluate` / `playwright_resize` / `playwright_screenshot`）。
> 写前端代码时**不要**用浏览器做验证；但本技能产出的截图是**交付物本身**，属于允许且必需的操作。

#### 2.1 环境准备（每次 navigate 后都要重做）

用一次 `playwright_evaluate` 注入「截图模式」样式并打标记，隐藏桌面外壳，只保留手机屏：

```js
if(!document.getElementById('guide-style')){
  const s=document.createElement('style');
  s.id='guide-style';
  s.textContent='html{zoom:2}.min-h-screen{background:#fff!important;padding:0!important;min-height:0!important}.min-h-screen > .w-full.max-w-6xl{display:none!important}';
  document.head.appendChild(s);
}
document.querySelector('[class*="rounded-[48px]"]').setAttribute('data-shot','phone');
```

要点：
- `zoom:2` 让 400px 宽的手机壳渲染为 800px 高清截图
- 隐藏桌面标题栏（`max-w-6xl` 容器，含「小程序预览 / 全屏自适应」按钮）
- 用 `data-shot="phone"` 作为截图选择器

然后 resize 视口：`width: 960, height: 1840`。

#### 2.2 截图命令

```
playwright_screenshot
  args: {
    name: "<NN-模块-页面>",
    savePng: true,
    storeBase64: false,
    selector: "[data-shot=\"phone\"]",
    downloadsDir: "<project>/docs/guide-assets"
  }
```

产出 **800×1680 PNG**，仅手机屏，无桌面外壳。文件名会自动追加 ISO 时间戳，后续需批量重命名（见步骤 3）。

#### 2.3 页面切换 helper（复用同一段 JS）

**按文本点击最深层元素**（React onClick 会冒泡到父级，点叶子节点最稳）：

```js
(function(txt){
  const all=Array.from(document.querySelectorAll('*'));
  let best=null,bd=-1;
  for(const el of all){
    if(el.children.length===0&&el.textContent.trim()===txt){
      let d=0,p=el;while(p){d++;p=p.parentElement;}
      if(d>bd){bd=d;best=el;}
    }
  }
  if(!best)return 'notfound:'+txt;
  best.click();return 'clicked:'+txt;
})('目标文案')
```

**模糊匹配**（文案被拆成多个 span、或含动态编号时）：

```js
(function(sub){
  const all=Array.from(document.querySelectorAll('*'));
  let best=null,bd=-1;
  for(const el of all){
    if(el.textContent.includes(sub)){
      if(Array.from(el.children).some(c=>c.textContent.includes(sub)))continue;
      let d=0,p=el;while(p){d++;p=p.parentElement;}
      if(d>bd){bd=d;best=el;}
    }
  }
  if(!best)return 'notfound';
  best.click();return 'clicked';
})('关键字')
```

**滚动到顶/底**（自动找滚动容器）：

```js
(function(pos){
  const els=Array.from(document.querySelectorAll('*'));
  let best=null,mx=0;
  for(const el of els){
    const s=getComputedStyle(el);
    if((s.overflowY==='auto'||s.overflowY==='scroll')&&el.scrollHeight-el.clientHeight>mx){
      mx=el.scrollHeight-el.clientHeight;best=el;
    }
  }
  if(!best)return 'noscroll';
  best.scrollTop = pos==='bottom' ? best.scrollHeight : Number(pos);
  return 'scrolled:'+best.scrollTop+'/'+best.scrollHeight;
})('bottom')
```

**长页面**：至少采「首屏 + 滚到底」两张；同一页面若信息密度高可采 2~3 屏。

#### 2.4 关键注意事项（踩过的坑）

| 坑 | 正确做法 |
|---|---|
| 同一 tick 内连续 click 两次（如「返回」后再点 Tab） | React 未重渲染，第二次找不到元素。**分开成两次 evaluate 调用** |
| 子页无底部 Tab 栏 | 二级页靠顶部「返回」逐级回退；回到一级页后再点 Tab |
| 空列表页 | 若页面带默认筛选导致空态，先点「清空搜索与过滤」再截图 |
| 表单空态 | 用 React 兼容方式填值，再点提交 |
| 手写签名板截图空白 | 直接操作 2D context 绘制，再截图 |

**React 兼容填值**：

```js
(function(){
  const setV=(el,v)=>{
    const p=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    p.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));
  };
  const ins=Array.from(document.querySelectorAll('input')).filter(i=>i.offsetParent);
  ins.forEach((el,i)=>setV(el, i===0?'13800000000':'123456'));
  return 'filled '+ins.length;
})()
```

**签名板绘制**（多 canvas 页面要按尺寸定位，如 `width===400&&height===600`）：

```js
(function(){
  const c=Array.from(document.querySelectorAll('canvas')).find(x=>x.width===400&&x.height===600);
  if(!c)return 'nocanvas';
  const g=c.getContext('2d');
  g.save();g.clearRect(0,0,400,600);
  g.strokeStyle='#0f172a';g.lineWidth=3.2;g.lineCap='round';g.lineJoin='round';
  const pts=[[96,464],[112,436],[126,474],[142,428],[156,472],[170,432],[186,476],[202,440],[214,470],[228,452],[244,474],[262,456],[276,472],[292,458],[306,466]];
  g.beginPath();g.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++){g.lineTo(pts[i][0],pts[i][1]);}
  g.stroke();
  g.beginPath();g.moveTo(300,420);g.bezierCurveTo(332,446,302,494,268,482);g.stroke();
  g.restore();return 'ok';
})()
```

#### 2.5 每张截图都要读回校验

采集后**必须**用 Read 查看该 PNG，确认：画面不是空白/空态、目标区域在可视范围内、无遮挡弹窗、时间水印正常。发现不对就调整后重拍，**不要凭猜测写图注**。

### 步骤 3：重命名与清理

统一命名 `NN-模块-页面.png`（两位数序号，保证章节顺序稳定）。

```powershell
Get-ChildItem "<project>\docs\guide-assets\*.png" |
  Where-Object { $_.Name -match '-2026-' } |
  ForEach-Object {
    $new = ($_.Name -replace '-2026-\d\d-\d\dT.*\.png$', '.png')
    Rename-Item -Path $_.FullName -NewName $new
  }
```

同时**删除**：探针废件（`probe-*`、`z2-*`）、重复截图的中间版本（同名多时间戳只保留最后一张）、空态返工前的旧图。

### 步骤 4：生成单文件 HTML

见第四、五节规范与模板。要求：

- 内联 CSS，无外链、无 CDN、无 JS 依赖
- 左侧固定目录（`position: sticky`）+ 右侧章节内容
- 每个模块一张卡片（`section`），内部截图网格自适应
- 每张图 `figure` + `figcaption`，图注前带步骤序号胶囊
- 图注内可用语义色强调按钮/状态文案（与截图内徽章颜色对应）

### 步骤 5：交付自检

- [ ] 引用的图片数量 == `guide-assets` 内文件数量（无缺失、无冗余）
- [ ] 每张图的图注与画面内容一致（逐张核对，不臆测）
- [ ] 所有子页/关键交互均已覆盖（对照 App 的状态机入口清单逐一勾选）
- [ ] 样式遵循 DESIGN.md（或本节默认规范）
- [ ] 无外链依赖，离线可直接打开
- [ ] 未修改 `src/` 下任何业务源码

可用以下命令快速校验图片引用完整性：

```powershell
$h = Get-Content "<project>\docs\<角色>操作指引.html" -Raw
$m = [regex]::Matches($h, 'src="guide-assets/([^"]+)"')
$miss = @()
foreach($x in $m){ if(-not (Test-Path ("<project>\docs\guide-assets\" + $x.Groups[1].Value))){ $miss += $x.Groups[1].Value } }
"引用图片数: " + $m.Count
"缺失: " + ($miss -join ', ')
"目录图片数: " + (Get-ChildItem "<project>\docs\guide-assets\*.png").Count
```

---

## 四、样式规范

> 若项目存在 `DESIGN.md`，**以 DESIGN.md 为准**，本节作为默认值与兜底。

### 4.1 色系（Design Tokens）

```css
:root{
  /* 品牌 */
  --brand-primary:#0a1f8f;      /* 主品牌深蓝：主按钮、激活态、章节序号底 */
  --brand-secondary:#1d4ed8;    /* 辅助蓝：链接、步骤序号文字 */
  --brand-accent:#f59e0b;       /* 强调橙：徽章、标签 */
  --info:#4780FF;               /* 信息蓝：信息提示、审理中 */

  /* 品牌辅助色（暖棕）：文档 / 卷宗 / 知识类引用，与冷调蓝形成冷暖互补 */
  --brand-auxiliary:#8C5C2E;        /* 前景：图注 .ka 文字、chip-aux 文字 */
  --brand-auxiliary-bg:#faf3ed;     /* 浅底：chip-aux 背景 */
  --brand-auxiliary-border:#e8d5c4; /* 边框：chip-aux 描边 */

  /* 背景 */
  --bg-base:#f8fafc;            /* 页面背景 */
  --bg-surface:#ffffff;         /* 卡片 / 表面 */
  --bg-muted:#f1f5f9;           /* 次级填充、截图占位底 */

  /* 文字 */
  --text-primary:#0f172a;       /* 标题、正文主体 */
  --text-secondary:#475569;     /* 说明、图注 */
  --text-muted:#64748b;         /* 辅助、页脚 */

  /* 边框 */
  --border-default:#e2e8f0;     /* 卡片、分隔线 */
  --border-muted:#f1f5f9;       /* 章节标题下划线 */

  /* 状态（与业务截图内徽章一一对应，用于图注强调） */
  --status-active:#1d4ed8;      /* 审理中 / 进行中 */
  --status-pending:#f59e0b;     /* 待办 / 待开庭 */
  --status-signing:#f43f5e;     /* 待签名 / 驳回 */
  --status-resolved:#10b981;    /* 已结案 / 已完成 / 同意 */
}
```

图注语义类（与截图徽章同色，形成图文呼应）：

```css
.k {color:var(--text-primary);font-weight:600;}   /* 中性强调：可点按钮、链接 */
.kw{color:#b45309;}                                /* 待办/警示：去签名 */
.ks{color:#be123c;}                                /* 待签/危险：退回上一级、驳回 */
.ko{color:#047857;}                                /* 完成/通过：同意、已签署 */
.ka{color:var(--brand-auxiliary);font-weight:600;} /* 文档/卷宗/知识类引用 */
```

**五色分工原则**：`.k` 管「操作动作」，`.kw/.ks/.ko` 管「状态」，`.ka` 管「材料对象」。
`.ka` 只标注文档、卷宗、知识条目等**名词性对象**（如「电子卷宗」「声明承诺书」「裁决书核阅」「审理指引」），
不用于按钮文案——按钮一律用 `.k`，避免与操作语义混淆。

### 4.2 字体

- 字体族（系统栈，跨平台稳定，禁止外链字体）：
  `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
- 等宽（序号、编号、日期、金额）：
  `ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace`
- 字号阶梯：**24px 页面主标题 / 20px 区块标题 / 16px 卡片标题 / 14px 正文 / 12px 图注与辅助 / 10px 标签与页码**
- 行高：标题 1.2 / 正文 1.5 / 长文本 1.75

### 4.3 圆角、边框、阴影、间距

- 圆角：小元素 `8px`；卡片/截图框 `12px`；胶囊 `999px`
- 边框：卡片 `1px solid var(--border-default)`；章节标题下划线 `1px solid var(--border-muted)`
- 阴影：卡片与截图框统一极克制 `0 1px 2px rgba(15,23,42,.04~.05)`，**禁止发光、禁止大投影**
- 间距以 4px 为基数：`4 / 8 / 12 / 14 / 16 / 18 / 20 / 24 / 28`

### 4.4 设计风格约定

- **白底 + 细边框**为主，不用装饰性顶部彩色条、不用渐变背景
- 一张大卡承载一个模块，模块内**平铺**，不做多层嵌套卡片
- 视觉层次靠「字重 + 字号 + 边框」区分，不靠多套颜色
- 色系克制：主蓝（`--brand-primary` / `--brand-secondary`）为绝对主色，
  暖棕辅助色（`--brand-auxiliary`）**仅作点缀**——每屏出现不超过 1~2 处，
  用于区分「文档/卷宗类」名词，配合浅底 + 描边的胶囊形态，不与蓝色争主次
- 截图是主角：截图宽度 ≥ 网格列宽，图注字号小于截图内最小字号
- 中文标签优先，不出现英文装饰性文案（`mono` 编号除外）
- 响应式：`grid-template-columns: repeat(auto-fill, minmax(214px,1fr))`；
  窄屏（≤860px）降为 `minmax(150px,1fr)` 且目录取消 sticky

---

## 五、输出模板

单文件、零依赖，可直接复制改造。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><产品名> · <角色>操作指引</title>
<style>
  :root{
    --brand-primary:#0a1f8f; --brand-secondary:#1d4ed8; --brand-accent:#f59e0b; --info:#4780FF;
    --brand-auxiliary:#8C5C2E; --brand-auxiliary-bg:#faf3ed; --brand-auxiliary-border:#e8d5c4;
    --bg-base:#f8fafc; --bg-surface:#ffffff; --bg-muted:#f1f5f9;
    --text-primary:#0f172a; --text-secondary:#475569; --text-muted:#64748b;
    --border-default:#e2e8f0; --border-muted:#f1f5f9;
    --status-active:#1d4ed8; --status-pending:#f59e0b; --status-signing:#f43f5e; --status-resolved:#10b981;
    --font-sans:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-mono:ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace;
  }
  *{box-sizing:border-box;}
  html{-webkit-text-size-adjust:100%;}
  body{margin:0;background:var(--bg-base);color:var(--text-primary);
       font-family:var(--font-sans);font-size:14px;line-height:1.5;}

  /* 顶栏 */
  .topbar{background:var(--bg-surface);border-bottom:1px solid var(--border-default);
          position:sticky;top:0;z-index:20;}
  .topbar-inner{max-width:1180px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:12px;}
  .logo{width:34px;height:34px;border-radius:8px;background:var(--brand-primary);color:#fff;
        display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex:none;}
  .brand-title{font-size:16px;font-weight:700;line-height:1.2;}
  .brand-sub{font-size:12px;color:var(--text-muted);}
  .topbar-meta{margin-left:auto;font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:8px;}
  .meta-dot{width:6px;height:6px;border-radius:50%;background:var(--status-resolved);}

  /* 布局 */
  .layout{max-width:1180px;margin:0 auto;padding:24px;
          display:grid;grid-template-columns:196px 1fr;gap:28px;align-items:start;}
  .toc{position:sticky;top:86px;background:var(--bg-surface);border:1px solid var(--border-default);
       border-radius:12px;padding:14px 12px;box-shadow:0 1px 2px rgba(15,23,42,.04);}
  .toc-title{font-size:10px;letter-spacing:.08em;color:var(--text-muted);font-weight:700;
             padding:0 8px 8px;border-bottom:1px solid var(--border-muted);margin-bottom:6px;}
  .toc a{display:flex;gap:8px;align-items:center;font-size:12px;color:var(--text-secondary);
         text-decoration:none;padding:7px 8px;border-radius:8px;transition:background .15s,color .15s;}
  .toc a:hover{background:var(--bg-muted);color:var(--brand-primary);}
  .toc .idx{font-family:var(--font-mono);font-size:10px;color:var(--text-muted);flex:none;}

  /* 概览 */
  .intro{background:var(--bg-surface);border:1px solid var(--border-default);border-radius:12px;
         padding:16px 18px;margin-bottom:22px;box-shadow:0 1px 2px rgba(15,23,42,.04);}
  .intro h1{font-size:20px;margin:0 0 6px;line-height:1.25;}
  .intro .lead{font-size:12px;color:var(--text-secondary);margin:0;}
  .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
  .chip{display:inline-flex;align-items:center;gap:6px;font-size:10px;color:var(--brand-secondary);
        background:#e0e7ff;border:1px solid #c7d2fe;padding:3px 8px;border-radius:999px;}
  /* 辅助色胶囊：用于标注文档/卷宗/知识类模块，与蓝色胶囊形成冷暖对比 */
  .chip-aux{color:var(--brand-auxiliary);background:var(--brand-auxiliary-bg);
            border-color:var(--brand-auxiliary-border);}

  /* 章节 */
  section{background:var(--bg-surface);border:1px solid var(--border-default);border-radius:12px;
          padding:16px 18px 18px;margin-bottom:20px;box-shadow:0 1px 2px rgba(15,23,42,.04);
          scroll-margin-top:86px;}
  .sec-head{display:flex;align-items:center;gap:10px;padding-bottom:12px;
            border-bottom:1px solid var(--border-muted);margin-bottom:14px;}
  .sec-num{font-family:var(--font-mono);font-size:12px;font-weight:700;color:#fff;
           background:var(--brand-primary);padding:2px 7px;border-radius:6px;flex:none;}
  .sec-head h2{font-size:16px;margin:0;}
  .sec-head .sec-tip{margin-left:auto;font-size:10px;color:var(--text-muted);}

  /* 截图网格 */
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(214px,1fr));gap:14px;}
  figure{margin:0;display:flex;flex-direction:column;}
  .shot{border:1px solid var(--border-default);border-radius:12px;overflow:hidden;
        background:var(--bg-muted);box-shadow:0 1px 2px rgba(15,23,42,.05);}
  .shot img{display:block;width:100%;height:auto;}
  figcaption{display:flex;gap:7px;align-items:flex-start;font-size:12px;
             color:var(--text-secondary);padding:9px 2px 0;line-height:1.45;}
  .step{font-family:var(--font-mono);font-size:10px;font-weight:700;color:var(--brand-secondary);
        background:#e0e7ff;padding:1px 5px;border-radius:4px;flex:none;margin-top:1px;}

  /* 图注语义色 */
  .k{color:var(--text-primary);font-weight:600;}
  .kw{color:#b45309;}
  .ks{color:#be123c;}
  .ko{color:#047857;}
  .ka{color:var(--brand-auxiliary);font-weight:600;}

  footer{max-width:1180px;margin:0 auto;padding:0 24px 40px;font-size:10px;color:var(--text-muted);}

  @media (max-width:860px){
    .layout{grid-template-columns:1fr;padding:16px;}
    .toc{position:static;}
    .grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;}
  }
</style>
</head>
<body>

<header class="topbar">
  <div class="topbar-inner">
    <div class="logo">穗</div>
    <div>
      <div class="brand-title"><产品名></div>
      <div class="brand-sub"><角色>端 · 操作指引</div>
    </div>
    <div class="topbar-meta"><span class="meta-dot"></span>图文版 · 共 N 个模块</div>
  </div>
</header>

<div class="layout">

  <!-- 目录：与 section id 一一对应，序号两位 -->
  <nav class="toc">
    <div class="toc-title">目 录</div>
    <a href="#s1"><span class="idx">01</span>登录与身份核验</a>
    <a href="#s2"><span class="idx">02</span>工作台（首页）</a>
    <!-- ... -->
  </nav>

  <main>
    <!-- 概览 -->
    <div class="intro">
      <h1><角色>操作指引</h1>
      <p class="lead">按「登录 → 首页 → …」动线，用截图说明每一步该点哪里、看什么。</p>
      <div class="chips">
        <span class="chip">登录核验</span>
        <span class="chip">案件查阅</span>
        <!-- 3~6 个模块关键词 -->
      </div>
    </div>

    <!-- 章节示例 -->
    <section id="s1">
      <div class="sec-head">
        <span class="sec-num">01</span>
        <h2>登录与身份核验</h2>
        <span class="sec-tip">人脸识别 / 账号密码</span>
      </div>
      <div class="grid">
        <figure>
          <div class="shot"><img src="guide-assets/01-login.png" alt="登录方式选择"></div>
          <figcaption><span class="step">1</span><span>打开小程序，选择 <span class="k">人脸识别登录</span> 或 <span class="k">账号密码登录</span>。</span></figcaption>
        </figure>
        <!-- 每步一个 figure，步骤序号在章节内重新计数 -->
      </div>
    </section>

    <!-- 后续章节结构同上 -->
  </main>
</div>

<footer>
  <产品名>（<角色>端）图文操作指引 · 截图取自平台真实运行界面，图片与 guide-assets 目录需同目录存放。
</footer>

</body>
</html>
```

### 模板使用要点

1. **章节数量控制在 6~9 个**，每章 2~8 张图，整体 30~45 张；过多则拆分为多份指引。
2. **章节划分按业务动线**，不按代码页面划分。例如「四类签署」合为一章，而不是拆成 4 章。
3. **步骤序号在章节内重新计数**，与目录的模块序号（01/02…）区分。
4. **图注写作公式**：`在哪 + 看什么 / 点什么 → 结果`，控制在 40 字内，并用语义色标注关键词：
   可点按钮用 `.k`、待办状态用 `.kw`、危险操作/驳回用 `.ks`、通过/完成用 `.ko`、文档卷宗类名词用 `.ka`。
5. 图注中提到的按钮文案**必须与截图内文字完全一致**。

---

## 六、反模式（禁止）

- ❌ 用 HTML/CSS 复刻界面代替真实截图
- ❌ 凭想象写图注（未核对画面内容）
- ❌ 未采集空态、弹窗、二次确认等关键状态
- ❌ 引入外部 CDN、字体、图标库
- ❌ 装饰性顶部彩条、渐变背景、发光阴影、多层嵌套卡片
- ❌ 图注写成长段落或使用英文标签
- ❌ 修改 `src/` 下业务源码来「方便截图」
- ❌ 额外生成 README / 说明文档

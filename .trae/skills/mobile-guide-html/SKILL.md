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
  /* 信息色不再单独定义色号：一律取项目 DESIGN.md 的品牌色令牌（示例 #0a1f8f）派生 */
  --info:var(--brand-primary);
  --info-bg:color-mix(in srgb, var(--brand-primary) 8%, #fff);      /* 品牌色低透明度浅底 */
  --info-border:color-mix(in srgb, var(--brand-primary) 22%, #fff); /* 与浅底同级的淡描边 */

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
    --brand-primary:#0a1f8f; --brand-secondary:#1d4ed8; --brand-accent:#f59e0b; --info:var(--brand-primary);
    /* 浅底与描边由品牌色派生，不写旧蓝色号 */
    --info-bg:color-mix(in srgb, var(--brand-primary) 8%, #fff); --info-border:color-mix(in srgb, var(--brand-primary) 22%, #fff);
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
        background:var(--info-bg);border:1px solid var(--info-border);padding:3px 8px;border-radius:999px;}
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
        background:var(--info-bg);padding:1px 5px;border-radius:4px;flex:none;margin-top:1px;}

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

## 六、导出 PDF / 导出 WORD

指引交付后，业务方常会追加要「一份 PDF」「一份 Word」。本节给出**零依赖的纯前端**实现：PDF 走浏览器打印（`window.print()`），Word 手写 ZIP + OOXML 生成**标准 `.docx`**。两个按钮放在概览标题右侧，屏幕可见、打印不出现。

**默认路径固定为**：PDF = 打印；WORD = 标准 `.docx`。`HTML + application/msword` 只作 `.docx` 生成异常时的兜底（原因见 6.6），不要作为主路径。

### 6.1 按钮与状态区 DOM

概览标题需要包一层 `.intro-head`，右侧放操作组：

```html
<div class="intro-head">
  <h1><角色>操作指引</h1>

  <div class="doc-actions" role="group" aria-label="导出为文件">
    <button type="button" class="btn btn-primary" id="btnPdf">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 17h12v4H6z"/>
      </svg>
      导出 PDF
    </button>
    <button type="button" class="btn btn-secondary" id="btnWord">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>
      </svg>
      导出 WORD
    </button>
  </div>
</div>
<!-- 概览其余内容照旧：.lead、.chips -->
<p class="doc-status" id="docStatus" role="status" aria-live="polite"></p>
```

要点：

- `role="group"` + `aria-label="导出为文件"`：声明这是同一组同级操作，读屏会念出组名。
- `type="button"`：避免以后把概览放进表单时被当成提交按钮。
- 图标 `aria-hidden="true"`，按钮文案用**中文**，不使用英文装饰词。
- 状态区 `role="status" aria-live="polite"`：进度、成功、失败都写在这里，读屏自动播报；`.doc-status:empty{display:none}` 保证没有内容时不占行高。
- 两个按钮共用一套 `.btn`，只换配色类（`btn-primary` / `btn-secondary`），不各写一套。

### 6.2 按钮样式（32px 高，紧凑并排）

```css
.intro-head{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:8px;}
.intro-head h1{margin:0;}
.doc-actions{margin-left:auto;display:inline-flex;align-items:center;gap:8px;}
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  height:32px;padding:0 12px;white-space:nowrap;
  font-family:inherit;font-size:12px;font-weight:600;line-height:1.4;
  border:1px solid var(--brand-primary);border-radius:6px;
  cursor:pointer;transition:background .15s,color .15s,border-color .15s;
}
.btn svg{flex:none;width:14px;height:14px;}   /* SVG 属性写 16×16，CSS 收到 14×14 */
.btn-primary{background:var(--brand-primary);color:#fff;}
.btn-secondary{background:var(--bg-surface);color:var(--brand-primary);}
@media (hover:hover){
  .btn-primary:hover{filter:brightness(.94);}
  .btn-secondary:hover{background:var(--info-bg);}
}
.btn:active{background:#022167;border-color:#022167;color:#fff;}
.btn:focus-visible{outline:2px solid var(--brand-secondary);outline-offset:2px;}
.btn[disabled]{opacity:.6;cursor:default;}
.doc-status{margin:10px 0 0;font-size:12px;line-height:1.6;color:var(--text-muted);}
.doc-status:empty{display:none;}
@media (max-width:600px){.doc-actions{margin-left:0;}}
```

尺寸口径：**32px 高 / 12px 字 / 内边距 `0 12px` / 圆角 6px / 图标 14×14 / 图标与文字 gap 6px / 两按钮 gap 8px**。

- **不要** `flex:1`、`width:100%`、`min-height:44px`：导出是低频次级操作，拉满整行的视觉重量会压过正文，也让标题行看起来像工具栏。
- 品牌色取项目 `DESIGN.md` 的品牌色令牌（示例 `#0a1f8f`），**不要在文档里写死色值**；悬停用 `filter:brightness()` 派生，避免再引入新色号。
- 手机上点按：32px 低于移动端 44px 建议值，但导出属于低频次级操作，一般不必为它放大。若指引主要在手机上看且确需手指点按，可在 `@media (max-width:600px)` 里给 `.btn{padding:0 14px}` 略增可点面积，仍保持紧凑、不回到整行。
- 打印时整体隐藏：`.doc-actions` 与 `.doc-status` 都进隐藏列表（见 6.3）。

### 6.3 打印样式（PDF 的唯一实现）

PDF 不引第三方库，也不受 `file://` 限制（打印读的是已渲染的 DOM），只需一段 `@media print`：

```css
@media print{
  @page{size:A4 portrait;margin:14mm 12mm;}
  html,body{background:#fff;}
  body{padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  /* 屏幕专用外壳一律不上纸 */
  .topbar,.toc,.to-top,.doc-actions,.doc-status,footer{display:none !important;}
  .layout{display:block;max-width:none;margin:0;padding:0;}
  /* 概览独立第一页，读起来像封面 + 导读 */
  .intro{border:0;box-shadow:none;border-radius:0;padding:0;margin:0;
         break-after:page;page-break-after:always;break-inside:avoid;}
  /* 每个模块另起一页，章节标题不会落在页脚被切断 */
  section{background:transparent;border:0;box-shadow:none;border-radius:0;
          padding:0;margin:0 0 8mm;
          break-before:page;page-break-before:always;break-inside:auto;}
  /* 标题与其下第一张截图保持同页 */
  .sec-head,.group-head{break-after:avoid;page-break-after:avoid;break-inside:avoid;}
  figure{break-inside:avoid;page-break-inside:avoid;}
  .shot{box-shadow:none;border-radius:6px;background:#fff;}
}
```

逐条对应的坑：

- `@page{size:A4 portrait;margin:14mm 12mm}`：不写 `size` 会按打印机默认纸张（常是 Letter）。
- 隐藏外壳：`.topbar` 顶栏、`.toc` 目录（桌面 sticky / 移动胶囊条）、`.to-top` 窄屏返回目录、`.doc-actions` + `.doc-status` 导出区、`footer`。
- `.layout{display:block}`：不取消两栏，纸面上仍按 `196px + 1fr` 分栏，正文会被挤成窄条。
- `break-before:page` 与 `page-break-*` **双写**：新语法给 Chromium 系，旧别名兜老内核与部分打印驱动。
- 卡片去壳（`border / box-shadow / border-radius / background` 归零）：否则每页印一张圆角卡片边框，费墨且显脏。
- `figure{break-inside:avoid}`：截图不被切到下一页；标题用 `break-after:avoid`，防止标题独占页尾而正文翻页。
- `print-color-adjust:exact`：品牌色实色输出。它仍依赖用户在打印对话框勾选「背景图形」（见 6.6）。

触发与状态：

```js
btnPdf.addEventListener('click', function(){
  setStatus('正在唤起打印窗口，请在「目标打印机」中选择「另存为 PDF」。');
  // 先让状态文案绘制一帧，再进入阻塞式打印流程
  window.setTimeout(function(){ window.print(); }, 50);
});
window.addEventListener('afterprint', function(){
  setStatus('打印 / 另存为 PDF 已完成。');
});
```

### 6.4 .docx 生成流程

五步，缺一步文件就打不开：

1. **取图** — `querySelectorAll('.shot img')` 去重 `src`，逐张 `fetch(src,{cache:'force-cache'})` → `arrayBuffer` → `{bytes, ext}`；失败退画布重绘（`canvas.toDataURL` → `atob` → `Uint8Array`）；再失败记为 `missing`，正文位置写占位说明并累计数量。
2. **编号** — 第 i 张图 → `relId = 'rId' + i`、落盘名 `word/media/image{i+1}{ext}`，并建 `map[src] = rec`，供正文按 `src` 反查关系号。
3. **正文** — 遍历 `main section`：主标题 40 半磅（20pt）；模块标题 28（14pt）+ `pageBreakBefore` + 底部边框 + `keepNext`；小节标题 22（11pt）；`grid` 转 3 列表格，图宽按原始宽高比折算 EMU（1cm = 360000）。**每个表格后必须补一个 `<w:p/>`**。
4. **打包** — 4 个固定分区 + N 个图片分区，`zipStore` 出字节。
5. **下载** — `new Blob([bytes], {type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})` → `URL.createObjectURL` + `<a download>` → 3 秒后 `revokeObjectURL` 并移除节点。

打包函数骨架：

```js
/* images: [{relId:'rId1', ext:'.png', bytes}]，第 i 张对应 word/media/image{i+1}{ext} */
function buildDocxBytes(bodyXml, images){
  var rels = images.map(function(im, i){
    return '<Relationship Id="' + im.relId + '" '
      + 'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" '
      + 'Target="media/image' + (i + 1) + im.ext + '"/>';
  }).join('');

  var files = [
    {name:'[Content_Types].xml', text:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
      + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
      + '<Default Extension="xml" ContentType="application/xml"/>'
      + '<Default Extension="png" ContentType="image/png"/>'
      + '<Default Extension="jpg" ContentType="image/jpeg"/>'
      + '<Default Extension="jpeg" ContentType="image/jpeg"/>'
      + '<Override PartName="/word/document.xml" '
      + 'ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
      + '</Types>'},
    {name:'_rels/.rels', text:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + '<Relationship Id="rId1" '
      + 'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
      + 'Target="word/document.xml"/></Relationships>'},
    {name:'word/document.xml', text:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<w:document ' + W_NS + '><w:body>' + bodyXml
      + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>'
      + '<w:pgMar w:top="1134" w:right="1021" w:bottom="1134" w:left="1021" '
      + 'w:header="851" w:footer="992" w:gutter="0"/></w:sectPr>'
      + '</w:body></w:document>'},
    {name:'word/_rels/document.xml.rels', text:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + rels + '</Relationships>'}
  ];

  images.forEach(function(im, i){
    files.push({name:'word/media/image' + (i + 1) + im.ext, data: im.bytes});
  });
  return zipStore(files);
}
```

`W_NS` 是 5 个命名空间前缀，拼在 `<w:document>` 上（用了 `r:` / `wp:` / `a:` / `pic:` 就必须声明）：

```js
var W_NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
         + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
         + 'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" '
         + 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
         + 'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
```

ZIP（store 不压缩）+ CRC32 + 转义：

```js
function xmlEsc(v){
  return String(v == null ? '' : v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
function crc32(bytes){                      // 多项式 0xEDB88320，首尾各异或 0xFFFFFFFF
  if(!crc32.t){ var t = crc32.t = new Uint32Array(256);
    for(var n = 0; n < 256; n++){ var c = n;
      for(var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0; } }
  var crc = 0xFFFFFFFF;
  for(var i = 0; i < bytes.length; i++) crc = t[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function u16(a, o, v){ a[o] = v & 255; a[o+1] = (v >>> 8) & 255; }
function u32(a, o, v){ a[o] = v & 255; a[o+1] = (v >>> 8) & 255;
                       a[o+2] = (v >>> 16) & 255; a[o+3] = (v >>> 24) & 255; }

/* files: [{name, text}] 或 [{name, data: Uint8Array}] */
function zipStore(files){
  var enc = new TextEncoder(), chunks = [], central = [], off = 0, d = new Date();
  var tm = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xFFFF;
  var dt = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;

  files.forEach(function(f){
    var name = enc.encode(f.name);
    var data = f.data ? new Uint8Array(f.data) : enc.encode(f.text || '');
    var crc  = crc32(data);
    var L = new Uint8Array(30 + name.length), C = new Uint8Array(46 + name.length);

    // 本地头 0x04034B50：0 签名 / 4 版本20 / 6 flag=0x0800(UTF-8 名) / 8 method=0(store)
    // 10 时间 / 12 日期 / 14 crc / 18 压缩后长 / 22 原始长 / 26 名长 / 28 扩展长
    u32(L,0,0x04034B50); u16(L,4,20); u16(L,6,0x0800); u16(L,8,0);
    u16(L,10,tm); u16(L,12,dt); u32(L,14,crc);
    u32(L,18,data.length); u32(L,22,data.length); u16(L,26,name.length); u16(L,28,0);
    L.set(name, 30);

    // 中央目录 0x02014B50：16 crc / 20 压缩后 / 24 原始 / 28 名长 / 42 本地头偏移
    u32(C,0,0x02014B50); u16(C,4,20); u16(C,6,20); u16(C,8,0x0800); u16(C,10,0);
    u16(C,12,tm); u16(C,14,dt); u32(C,16,crc);
    u32(C,20,data.length); u32(C,24,data.length); u16(C,28,name.length);
    u16(C,30,0); u16(C,32,0); u16(C,34,0); u16(C,36,0); u32(C,38,0); u32(C,42,off);
    C.set(name, 46);

    chunks.push(L, data); central.push(C); off += L.length + data.length;
  });

  var cdSize = central.reduce(function(s, c){ return s + c.length; }, 0);
  var e = new Uint8Array(22);
  // EOCD 0x06054B50：8/10 条目数 / 12 中央目录长 / 16 中央目录起始偏移
  u32(e,0,0x06054B50); u16(e,8,files.length); u16(e,10,files.length);
  u32(e,12,cdSize); u32(e,16,off); u16(e,20,0);

  var out = new Uint8Array(off + cdSize + 22), p = 0;
  chunks.concat(central, [e]).forEach(function(part){ out.set(part, p); p += part.length; });
  return out;
}
```

Run / 段落 / 表格（子元素顺序是硬约束）：

```js
// 字号单位是半磅：40=20pt / 28=14pt / 22=11pt / 21=10.5pt / 18=9pt
function runXml(text, o){
  o = o || {};
  var size = o.size || 21, F = o.font || 'Microsoft YaHei';
  var rpr = '<w:rPr><w:rFonts w:ascii="' + F + '" w:hAnsi="' + F
          + '" w:eastAsia="微软雅黑" w:hint="eastAsia"/>'
          + (o.bold ? '<w:b/><w:bCs/>' : '')
          + (o.color ? '<w:color w:val="' + o.color + '"/>' : '')
          + '<w:sz w:val="' + size + '"/><w:szCs w:val="' + size + '"/></w:rPr>';
  return '<w:r>' + rpr + '<w:t xml:space="preserve">' + xmlEsc(text) + '</w:t></w:r>';
}
function paraXml(inner, o){
  o = o || {};
  // pPr 是严格 sequence：keepNext → pageBreakBefore → pBdr → spacing，顺序错 Word 报损坏
  var ppr = (o.keepNext ? '<w:keepNext/>' : '')
          + (o.pageBreakBefore ? '<w:pageBreakBefore/>' : '')
          + (o.border ? '<w:pBdr><w:bottom w:val="single" w:sz="4" w:space="4" w:color="E2E8F0"/></w:pBdr>' : '')
          + ((o.before || o.after)
              ? '<w:spacing w:before="' + (o.before || 0) + '" w:after="' + (o.after || 0) + '"/>' : '');
  return '<w:p>' + (ppr ? '<w:pPr>' + ppr + '</w:pPr>' : '') + (inner || '') + '</w:p>';
}
function tableXml(rows, colW){
  // tblPr 同样严格 sequence：tblW → tblBorders → tblLayout → tblCellMar
  // 每个 <w:tc> 需先写 <w:tcPr><w:tcW w:w="colW" w:type="dxa"/></w:tcPr>，且单元格内至少一个 <w:p/>
}
```

图片：

```js
// cx / cy 单位 EMU，1cm = 360000；按原图宽高比缩放，不要拉伸
function imageRunXml(relId, picId, cx, cy, name){
  return '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">'
       + '<wp:extent cx="' + cx + '" cy="' + cy + '"/>'
       + '<wp:docPr id="' + picId + '" name="' + name + '"/>'
       + '<wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>'
       + '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
       + '<pic:pic><pic:nvPicPr><pic:cNvPr id="' + picId + '" name="' + name + '"/><pic:cNvPicPr/></pic:nvPicPr>'
       + '<pic:blipFill><a:blip r:embed="' + relId + '"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
       + '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm>'
       + '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>'
       + '</a:graphicData></a:graphic></wp:inline></w:drawing></w:r>';
}
```

`r:embed` 必须是 `word/_rels/document.xml.rels` 里存在的 Id，该关系的 `Target` 必须指向真实落盘的 `word/media/imageN.ext`。**三者（关系数 / 媒体文件数 / `r:embed` 数）必须一一对应**，多一个少一个都会导致 Word 报文件损坏。

### 6.5 异常兜底（只在 .docx 失败时用）

`.docx` 抛错时，退一份「简化 HTML + `application/msword`」的 `.doc`：只保证标题层级与段落可读，图片按相对路径引用。文件名加 `-兼容版`，状态区明确告知失败原因与下一步建议，例如「标准 .docx 生成失败（原因），已下载兼容版 .doc；若仍打不开请改用『导出 PDF』」。

```js
download(new Blob([html], {type:'application/msword;charset=utf-8'}), '…-兼容版.doc');
```

**不要**再回到 MHTML（`multipart/related`）方案，原因见 6.6。

### 6.6 踩坑与校验清单

| 坑 | 现象 | 正确做法 |
|---|---|---|
| MHTML 塞进 `.doc` | Word / WPS 弹「不支持该类型或文件已损坏」 | 默认走标准 `.docx`；`application/msword` 只作兜底 |
| MHTML 边界写法 | 同上 | 若确实要做：声明的 boundary 值为 `xxx`，**分区分隔行必须写成 `--xxx`**，**结尾必须是 `--xxx--`**，全部换行必须 CRLF，base64 每行 76 列 |
| `file://` 读图 | Word 里图片全变成占位说明 | 图片字节只能靠 `fetch` 取；提示用户在 `docs` 目录执行 `python -m http.server 8080`，用 `http://` 打开再导出；PDF 不受此限 |
| 打印丢品牌色 | 章节序号底、胶囊底色变白 | 打印对话框需勾选「背景图形 / Background graphics」，并在文档里写明这一步 |
| 打印没页码 | 纸质稿没有页码 | 页码来自浏览器页眉页脚，需勾选「页眉和页脚」 |
| 体积意外大 | 导出一个 8MB 的 docx | store 不压缩，体积 ≈ 截图字节总量 + 几十 KB XML；导出前状态区提示预期体积（如「约 7.9 MB，内嵌 38 张截图」） |
| 表格后直接接表格或结束 | Word 报文档结构错误 | 每个 `<w:tbl>` 后补 `<w:p/>` |
| `pPr` / `tblPr` 子元素顺序 | 打开报损坏或样式失效 | 严格按 6.4 顺序写，不要「想到哪写到哪」 |
| 中文字体 | 中文变宋体、英文变雅黑 | `w:rFonts` 同时声明 `ascii` / `hAnsi` 与 `eastAsia="微软雅黑"`，并加 `w:hint="eastAsia"` |
| 特殊字符 | XML 解析失败或出现 `&amp;amp;` | 统一走 `xmlEsc`，且只转义一次（先转义再拼接，不要对已转义串二次转义） |
| 静默失败 | 点了按钮没反应，不知道错在哪 | 状态区必须有「正在… / 已完成（体积）/ 失败原因 + 下一步建议」，按钮 `disabled` + `aria-busy` |

**离线校验（全程不开浏览器）**：

1. 页面里的 docx 核心函数用 `/* @docx-core:start */ … /* @docx-core:end */` 注释包住，保持**纯函数、无 DOM 依赖**，离线脚本才能原样抽取执行。
2. Node 读 HTML、截取标记区间、`new Function` 执行，喂假数据（假图片字节 + 假正文）产出 `sample.docx`。
3. Python 校（任一条不过即视为失败）：
   - `zipfile.ZipFile(p).testzip()` 返回 `None`（CRC 全对）
   - 条目齐全：`[Content_Types].xml`、`_rels/.rels`、`word/document.xml`、`word/_rels/document.xml.rels`、`word/media/image1..N`
   - `ElementTree.fromstring` 能解析全部 XML（良构）
   - 关系表里 image 关系数 == `word/media/*` 数 == `document.xml` 里 `r:embed` 数
   - `sectPr` 的 `pgSz` 为 `11906 × 16838`
   - `pPr`、`tblPr` 子元素顺序符合 6.4
   - 每个 `w:tbl` 后紧跟 `w:p`
   - 字号集合只落在 18 / 21 / 22 / 28 / 40
4. 顺带静态自检：`<script>` 内 JS 用 `new Function` 试解析（查语法）、CSS 大括号配平、`section` / `figure` 数量与实际图片引用数一致。
5. **临时脚本与样例 docx 用完删除**，不要留在 `docs/` 或项目根目录。

交付前勾一遍：

- [ ] 屏幕上：两个按钮 32px 高、并排、不拉伸；文案中文；Tab 可达且焦点环可见
- [ ] 打印预览：无顶栏 / 目录 / 按钮 / 页脚；概览一页；每模块新起一页；截图不跨页
- [ ] 导出的 `.docx` 在 Word 与 WPS 均能打开；标题层级、表格、图片、图注齐全
- [ ] 图片缺失时有明确提示，且指向本地 http 服务方案
- [ ] 成功与失败两种状态都有可读文案，不静默
- [ ] 导出是加法：原有内容与样式未被改动

---

## 七、反模式（禁止）

- ❌ 用 HTML/CSS 复刻界面代替真实截图
- ❌ 凭想象写图注（未核对画面内容）
- ❌ 未采集空态、弹窗、二次确认等关键状态
- ❌ 引入外部 CDN、字体、图标库
- ❌ 装饰性顶部彩条、渐变背景、发光阴影、多层嵌套卡片
- ❌ 图注写成长段落或使用英文标签
- ❌ 修改 `src/` 下业务源码来「方便截图」
- ❌ 额外生成 README / 说明文档

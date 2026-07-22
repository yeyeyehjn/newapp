import { readFileSync, writeFileSync, watchFile, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MD_FILE = resolve(__dirname, '..', '穗仲云仲裁员_PRD_V1.0.md');
const HTML_FILE = resolve(__dirname, '..', '穗仲云仲裁员_PRD_V1.0.html');

function buildHtml(mdContent: string): string {
  const body = marked.parse(mdContent, { async: false }) as string;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>穗仲云仲裁员 PRD V1.0</title>
  <style>
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
  </style>
</head>
<body>
${body}
</body>
</html>
`;
}

function sync(watch: boolean): void {
  if (!existsSync(MD_FILE)) {
    console.error(`[sync-prd] 找不到文件: ${MD_FILE}`);
    process.exit(1);
  }

  const convert = () => {
    const md = readFileSync(MD_FILE, 'utf-8');
    const html = buildHtml(md);
    writeFileSync(HTML_FILE, html, 'utf-8');
    const now = new Date().toLocaleTimeString('zh-CN');
    console.log(`[${now}] 已同步 HTML → ${HTML_FILE}`);
  };

  convert();

  if (watch) {
    console.log('[sync-prd] 正在监听文件变化，按 Ctrl+C 退出...');
    watchFile(MD_FILE, { interval: 1000 }, () => {
      convert();
    });
  }
}

const watch = process.argv.includes('--watch');
sync(watch);

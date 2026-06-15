# Design System

## Semantic Color System (语义化颜色系统)

定义在 `src/index.css` 的 `@theme` 块中。

### Brand Colors (品牌色)

| Token | Color | Tailwind | Usage |
|-------|-------|----------|-------|
| `--color-brand-primary` | #4f46e5 | Indigo 600 | 主品牌色，按钮、链接 |
| `--color-brand-secondary` | #6366f1 | Indigo 500 | 品牌辅助色，图标、装饰 |
| `--color-brand-accent` | #f59e0b | Amber 500 | 品牌强调色，徽章、标签 |

### Background Colors (背景色)

| Token | Color | Tailwind | Usage |
|-------|-------|----------|-------|
| `--color-bg-base` | #f8fafc | Slate 50 | 页面背景 |
| `--color-bg-surface` | #ffffff | White | 卡片/组件背景 |
| `--color-bg-muted` | #f1f5f9 | Slate 100 | 次级背景，分隔区域 |
| `--color-bg-elevated` | #ffffff | White | 浮层/弹窗背景 |

### Text Colors (文字色)

| Token | Color | Tailwind | Contrast | Usage |
|-------|-------|----------|----------|-------|
| `--color-text-primary` | #0f172a | Slate 900 | 15.5:1 | 主要文字 |
| `--color-text-secondary` | #475569 | Slate 600 | 4.6:1 | 次要文字 |
| `--color-text-muted` | #64748b | Slate 500 | 4.5:1 | 辅助文字 |
| `--color-text-inverse` | #ffffff | White | - | 反色文字（深色背景） |

### Border Colors (边框色)

| Token | Color | Tailwind | Usage |
|-------|-------|----------|-------|
| `--color-border-default` | #e2e8f0 | Slate 200 | 默认边框 |
| `--color-border-muted` | #f1f5f9 | Slate 100 | 次级边框 |
| `--color-border-strong` | #cbd5e1 | Slate 300 | 强边框 |

### Semantic Colors (语义色)

| Semantic | Token | Color | Tailwind | Background Token |
|----------|-------|-------|----------|------------------|
| **Success** | `--color-success` | #10b981 | Emerald 500 | `--color-success-bg` (#d1fae5) |
| **Warning** | `--color-warning` | #f59e0b | Amber 500 | `--color-warning-bg` (#fef3c7) |
| **Error** | `--color-error` | #ef4444 | Red 500 | `--color-error-bg` (#fee2e2) |
| **Info** | `--color-info` | #6366f1 | Indigo 500 | `--color-info-bg` (#e0e7ff) |

### Case Status Colors (案件状态色)

| Status | Token | Color | Tailwind | Background Token |
|--------|-------|-------|----------|------------------|
| **审理中** | `--color-status-active` | #6366f1 | Indigo 500 | `--color-status-active-bg` (#e0e7ff) |
| **待开庭** | `--color-status-pending` | #f59e0b | Amber 500 | `--color-status-pending-bg` (#fef3c7) |
| **待签名** | `--color-status-signing` | #f43f5e | Rose 500 | `--color-status-signing-bg` (#ffe4e6) |
| **已结案** | `--color-status-resolved` | #10b981 | Emerald 500 | `--color-status-resolved-bg` (#d1fae5) |

### Interaction Colors (交互色)

| Token | Color | Tailwind | Usage |
|-------|-------|----------|-------|
| `--color-hover` | #4f46e5 | Indigo 600 | Hover 状态 |
| `--color-active` | #4338ca | Indigo 700 | Active/Pressed 状态 |
| `--color-focus` | #6366f1 | Indigo 500 | Focus 状态 |

---

## Color Palette (Legacy Reference)

### Primary Colors
- **Brand Primary**: `oklch(0.55 0.2 250)` - Deep blue for primary actions and brand identity
- **Brand Secondary**: `oklch(0.65 0.18 200)` - Teal for secondary elements

### Neutral Scale
- **Background**: `oklch(0.98 0 0)` - Pure light background
- **Surface**: `oklch(1 0 0)` - White cards and surfaces
- **Border**: `oklch(0.9 0 0)` - Subtle borders
- **Text Primary**: `oklch(0.2 0 0)` - Main text
- **Text Secondary**: `oklch(0.4 0 0)` - Secondary text
- **Text Muted**: `oklch(0.6 0 0)` - Muted/disabled text

### Semantic Colors (Legacy)
- **Success**: `oklch(0.65 0.15 140)` - Green for success states
- **Warning**: `oklch(0.7 0.18 70)` - Amber for warnings
- **Error**: `oklch(0.55 0.2 25)` - Red for errors
- **Info**: `oklch(0.6 0.15 220)` - Blue for informational messages

---

## Typography

### Font Families
- **Primary**: Inter, system-ui, -apple-system, sans-serif
- **Mono**: JetBrains Mono, monospace (for code and data)

### Unified Font Size Scale (CSS Variables)
Defined in `src/index.css` under `@theme`:

| Token | Size | Usage |
|-------|------|-------|
| `--text-2xs` | 8px | Micro labels, badges, fine print |
| `--text-xs` | 10px | Small labels, captions |
| `--text-sm` | 12px | Secondary text, helper text |
| `--text-base` | 14px | Body text (default) |
| `--text-lg` | 16px | Emphasized body, small headings |
| `--text-xl` | 18px | Subsection headings |
| `--text-2xl` | 20px | Section headings |
| `--text-3xl` | 24px | Page titles |

Usage in Tailwind: `text-2xs`, `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`

### Scale (Legacy - for reference)
- **Display**: `clamp(2rem, 5vw, 3.5rem)` - Hero headings
- **H1**: `clamp(1.75rem, 4vw, 2.5rem)` - Page titles
- **H2**: `clamp(1.5rem, 3vw, 2rem)` - Section headings
- **H3**: `clamp(1.25rem, 2vw, 1.5rem)` - Subsections
- **H4**: `1.125rem` - Card titles
- **Body**: `1rem` - Body text
- **Small**: `0.875rem` - Captions, labels
- **XSmall**: `0.75rem` - Fine print

### Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Line Heights
- **Tight**: 1.2 (headings)
- **Normal**: 1.5 (body)
- **Relaxed**: 1.75 (long-form content)

---

## Spacing

### Unified Spacing Scale (CSS Variables)
Defined in `src/index.css` under `@theme`:

| Token | Size | Tailwind | Usage |
|-------|------|----------|-------|
| `--space-1` | 4px | `p-1`, `gap-1`, `m-1` | Micro spacing (icon gaps, tight elements) |
| `--space-2` | 8px | `p-2`, `gap-2`, `m-2` | Small spacing (related elements, inline gaps) |
| `--space-3` | 12px | `p-3`, `gap-3`, `m-3` | Medium-small spacing (component internal) |
| `--space-4` | 16px | `p-4`, `gap-4`, `m-4` | Medium spacing (component padding, section gaps) |
| `--space-5` | 20px | `p-5`, `gap-5`, `m-5` | Medium-large spacing (card padding) |
| `--space-6` | 24px | `p-6`, `gap-6`, `m-6` | Large spacing (section margins, card groups) |
| `--space-8` | 32px | `p-8`, `gap-8`, `m-8` | Extra large spacing (page sections) |

### Usage Guidelines
- **Level 1 (4px)**: Icon-text gaps, badge padding, tight inline elements
- **Level 2 (8px)**: Related text elements, small component gaps
- **Level 3 (12px)**: Card internal spacing, stat blocks
- **Level 4 (16px)**: Component padding, section separators
- **Level 5 (20px)**: Card padding, modal content
- **Level 6 (24px)**: Section margins, page blocks
- **Level 8 (32px)**: Page section dividers, major layout gaps

### Legacy Spacing (Deprecated)
Base unit: `4px`

- **XS**: 4px (0.25rem)
- **SM**: 8px (0.5rem)
- **MD**: 16px (1rem)
- **LG**: 24px (1.5rem)
- **XL**: 32px (2rem)
- **2XL**: 48px (3rem)
- **3XL**: 64px (4rem)

---

## Components

### Cards
- Background: Surface color
- Border: 1px solid Border color
- Radius: 8px
- Shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Padding: LG (24px)

### Buttons
- **Primary**: Brand Primary background, white text
- **Secondary**: Transparent background, Brand Primary border and text
- **Ghost**: Transparent background, Text Secondary text
- Radius: 6px
- Padding: SM MD (8px 16px)
- Font weight: Medium

### Inputs
- Border: 1px solid Border color
- Radius: 6px
- Padding: SM MD (8px 16px)
- Focus: 2px solid Brand Primary ring

### Tables
- Border: 1px solid Border color
- Header background: `oklch(0.97 0 0)`
- Row hover: `oklch(0.98 0 0)`
- Padding: MD LG (16px 24px)

---

## Layout

### Container Max Widths
- **SM**: 640px
- **MD**: 768px
- **LG**: 1024px
- **XL**: 1280px
- **2XL**: 1536px

### Grid System
- Columns: 12
- Gutter: LG (24px)
- Margin: LG (24px)

---

## Breakpoints

- **SM**: 640px
- **MD**: 768px
- **LG**: 1024px
- **XL**: 1280px
- **2XL**: 1536px

---

## Motion

### Durations
- **Fast**: 150ms
- **Normal**: 250ms
- **Slow**: 400ms

### Easing
- **Ease Out**: `cubic-bezier(0, 0, 0.2, 1)`
- **Ease In**: `cubic-bezier(0.4, 0, 1, 1)`
- **Ease In Out**: `cubic-bezier(0.4, 0, 0.2, 1)`

### Principles
- All animations respect `prefers-reduced-motion`
- Transform and opacity only (no layout animations)
- Purposeful motion, no decorative animation

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text (≥18px or ≥14px bold)
- Focus indicators: 2px solid ring
- Touch targets: minimum 44x44px

---

## Dark Mode

*To be defined based on user preference and brand requirements*

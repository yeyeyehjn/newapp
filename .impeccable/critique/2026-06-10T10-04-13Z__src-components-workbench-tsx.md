---
target: 首页
total_score: 22
p0_count: 0
p1_count: 2
timestamp: 2026-06-10T10-04-13Z
slug: src-components-workbench-tsx
---
# Critique: src/components/Workbench.tsx

## Design Health Score: 22/40

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | ticker interval too slow |
| 2 | Match System / Real World | 3 | GZAC Core/Extra labels unfamiliar |
| 3 | User Control and Freedom | 2 | overlay navigation lacks back gesture |
| 4 | Consistency and Standards | 3 | indigo overused |
| 5 | Error Prevention | 2 | search triggers overlay on every keystroke |
| 6 | Recognition Rather Than Recall | 3 | card descriptions truncated |
| 7 | Flexibility and Efficiency | 2 | no quick actions, fixed quick replies |
| 8 | Aesthetic and Minimalist Design | 2 | too many layers |
| 9 | Error Recovery | 1 | no undo for chat, no retry for export |
| 10 | Help and Documentation | 1 | help buried in secondary tab |

## Priority Issues

### [P1] Information architecture too deep
4 layers of content on homepage, 3-4 clicks to reach target feature.

### [P1] Side-stripe border on task cards
Line 311, w-[4.5px] bg-red-500 left stripe is a banned anti-pattern.

### [P1] Search triggers overlay too aggressively
onChange on search input opens full-screen overlay on every character.

### [P2] Color strategy monotonous
Indigo dominates all interactive states.

### [P2] Korean text in credential watermark
Line 626, 广州仲裁위원회 contains Korean characters.

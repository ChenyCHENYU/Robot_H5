# Design System — Apple HIG + Linear

Core design language: Apple Human Interface Guidelines, with Linear's modern tool aesthetic.

## Principles

1. **Restraint** — Less is more. Remove all unnecessary decoration.
2. **Hierarchy** — Build information layers through font weight, color depth, spacing.
3. **Consistency** — Use design tokens globally. No hardcoded colors or font sizes.
4. **Breathing** — Generous whitespace. Content never feels crowded.

## Color Tokens

All referenced via `var(--ds-xxx)`. Never use raw hex values.

### Light Mode
| Token | Value | Usage |
|-------|-------|-------|
| `--ds-bg` | #FFFFFF | Page background |
| `--ds-bg-secondary` | #F5F5F7 | Card/input background |
| `--ds-bg-tertiary` | #E8E8ED | Hover/pressed state |
| `--ds-surface` | #FFFFFF | Elevated surface |
| `--ds-text-primary` | #1D1D1F | Headings, body text |
| `--ds-text-secondary` | #6E6E73 | Descriptions, labels |
| `--ds-text-tertiary` | #AEAEB2 | Placeholders, captions |
| `--ds-accent` | #0071E3 | Primary actions (Apple Blue) |
| `--ds-accent-hover` | #0077ED | Hover state |
| `--ds-success` | #34C759 | Success indicators |
| `--ds-warning` | #FF9500 | Warning indicators |
| `--ds-danger` | #FF3B30 | Destructive actions |
| `--ds-border` | rgba(0,0,0,0.08) | Subtle borders |
| `--ds-divider` | rgba(0,0,0,0.05) | Divider lines |

### Dark Mode
| Token | Value |
|-------|-------|
| `--ds-bg` | #000000 |
| `--ds-bg-secondary` | #1C1C1E |
| `--ds-bg-tertiary` | #2C2C2E |
| `--ds-surface` | #1C1C1E |
| `--ds-text-primary` | #F5F5F7 |
| `--ds-text-secondary` | #98989D |
| `--ds-text-tertiary` | #636366 |
| `--ds-accent` | #0A84FF |
| `--ds-border` | rgba(255,255,255,0.1) |
| `--ds-divider` | rgba(255,255,255,0.06) |

## Typography

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text',
  'Helvetica Neue', Helvetica, Arial, sans-serif;
```

### Scale (Mobile)
| Level | Size | Weight |
|-------|------|--------|
| Large Title | 34px | Bold |
| Title 1 | 28px | Bold |
| Title 2 | 22px | Bold |
| Title 3 | 20px | Semibold |
| Headline | 17px | Semibold |
| Body | 17px | Regular |
| Callout | 16px | Regular |
| Subheadline | 15px | Regular |
| Footnote | 13px | Regular |
| Caption | 11px | Regular |

## Spacing (4px Grid)

`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64`

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Small | 8px | Buttons, inputs |
| Medium | 12px | Cards |
| Large | 16px | Dialogs, large cards |
| XL | 20px | Bottom sheets |
| Full | 9999px | Avatars, badges |

CSS variables: `--ds-radius-sm`, `--ds-radius-md`, `--ds-radius-lg`, `--ds-radius-xl`, `--ds-radius-full`

## Shadows

| Level | Value |
|-------|-------|
| Level 1 | `0 1px 3px rgba(0,0,0,0.08)` |
| Level 2 | `0 4px 12px rgba(0,0,0,0.08)` |
| Level 3 | `0 8px 24px rgba(0,0,0,0.12)` |

Dark mode: use `rgba(0,0,0,0.3)` series.

## Animation

- Duration: 200ms ~ 300ms
- Standard easing: `cubic-bezier(0.25, 0.1, 0.25, 1)`
- Spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- No flicker or jumpy animations

## Component Patterns

### Button
- Primary: `--ds-accent` background, white text, 50px height, 12px radius
- Secondary: `--ds-bg-secondary` background, `--ds-text-primary` text
- Press: `transform: scale(0.98)` feedback

### Input Field
- Background: `--ds-bg-secondary`, no border, 12px radius, 16px padding
- Focus: 2px `--ds-accent` ring (`box-shadow: 0 0 0 2px var(--ds-accent)`)

### Card
- Background: `--ds-surface`, 16px radius, Level 2 shadow, 20px padding

### Navigation Bar
- Frosted glass: `backdrop-filter: blur(20px) saturate(180%)`
- Semi-transparent background

### Tab Bar
- Same frosted glass effect
- 0.5px top border with `--ds-divider`

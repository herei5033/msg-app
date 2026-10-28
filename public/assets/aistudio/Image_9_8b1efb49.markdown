---
name: Obsidian Signal
colors:
  surface: '#11131a'
  surface-dim: '#11131a'
  surface-bright: '#373941'
  surface-container-lowest: '#0c0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d1f27'
  surface-container-high: '#282a31'
  surface-container-highest: '#33343c'
  on-surface: '#e2e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e2e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#11131a'
  on-background: '#e2e2ec'
  surface-variant: '#33343c'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 13.5px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 17px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-inline:
    fontFamily: Geist
    fontSize: 12.5px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The design system establishes a focused, hyper-efficient desktop communication environment tailored for engineers, system architects, and high-cadence digital operators. It balances high-density information architecture with serene, low-fatigue visual clarity. 

The aesthetic is precision-engineered minimalism paired with tactile edge illumination. Deep cosmic neutrals minimize optical strain during prolonged night sessions, while electric blue accents and icy cyan edge glints provide precise spatial orientation and immediate interaction feedback. The atmosphere feels deliberate, quiet, and rapid—evoking the tactile precision of an illuminated avionics console stripped of ornamental distraction.

## Colors
The palette is built upon a deliberate progression of pitch-black and slate-infused surfaces, engineered to create layer separation via tonal shifts and razor-thin containment rather than heavy drop shadows:

- **Base Canvas (`#090A0F`):** Deep ambient canvas applied to background regions, app framing, and outer shells.
- **Surface Elevation 1 (`#11131A`):** The default work surface used for sidebars, conversation lists, and dormant panels.
- **Surface Elevation 2 (`#181B24`):** Elevated interactive tiles, active chat panels, input enclosures, and popovers.
- **Surface Elevation 3 (`#1F232E`):** Ephemeral context menus, message action floats, and active item highlights.
- **Borders & Micro-lines (`#232733`):** High-precision containment lines. Use at 1px thickness to define regions cleanly without visual bulk.
- **Primary Electric (`#3B82F6`):** Command actions, primary active selections, outgoing unread ticks, and focused state rings. Hover states shift to `#60A5FA`; pressed states drop to `#2563EB`.
- **Secondary Glint (`#38BDF8`):** Ice blue for system callouts, mention tags (`@user`), active tab glints, and pinned indicators.
- **Text & Foreground:**
  - High Emphasis (`#F3F4F6`): Message content, active headlines, and high-priority titles.
  - Medium Emphasis (`#9CA3AF`): Timestamps, muted conversation previews, and inactive navigation nodes.
  - Low Emphasis (`#6B7280`): Micro-metadata, disabled affordances, and empty state guides.
- **Operational Status:**
  - Active: `#10B981` (Vibrant Emerald)
  - Busy: `#F59E0B` (Amber)
  - Idle / Offline: `#64748B` (Muted Slate)
  - Destructive / Urgent: `#EF4444` (Laser Crimson)

## Typography
Typographic rhythm prioritizes rapid scanning and high information density without sacrificing optical breathing room. 

Geist handles overall structural elements and message flows due to its surgical, modern glyph construction and condensed horizontal footprint. Inter is reserved for high-legibility UI labels, badges, and metadata chips where distinct letterform clarity is essential at micro scales.

Message text defaults to `body-md` (13.5px / 20px) to balance reading comfort with viewport efficiency during fast back-and-forth interactions. Uppercase styling is strictly reserved for `label-sm` when designating user roles, keyboard shortcuts, or operational badges. Numerical tabular lining must be enabled globally for timestamps, ping rates, unread counts, and file sizes.

## Layout & Spacing
The layout architecture is organized as a three-pane desktop viewport with strict split-pane containment:
1. **Utility & Channel Rail (Width: 64px fixed or 240px collapsable):** Anchored to the far left. Houses workspace switchers, direct contact navigation, and status settings.
2. **Conversation Index (Width: 320px fixed):** Scrollable stream of active channels and direct threads.
3. **Primary Conversation View (Flex 1):** Main stream containing the header, virtualized message thread, composer, and optional flyout inspector (Width: 340px fixed).

Spatial gaps adhere to a dense 4px base rhythm:
- Use `space-xs` (4px) for inline status pill gaps and micro-avatar offsets.
- Use `space-sm` (8px) for list element separation, badge padding, and icon-to-label intervals.
- Use `space-md` (12px) for chat message bubble internal padding and message-group cluster gaps.
- Use `space-lg` (16px) for panel header padding and channel separator breaks.
- Use `space-xl` (24px) strictly between disparate message sender clusters or day dividers.

## Elevation & Depth
Elevation is articulated through precise luminance tiers and luminous rim glows rather than traditional diffused drop shadows.

- **Level 0 (Base Canvas):** `#090A0F`. Non-interactive backdrop.
- **Level 1 (Structural Panes):** `#11131A` bounded by a 1px border of `#232733`. Sidebars, list panes, and workspace navigation.
- **Level 2 (Active Message Canvas & Input):** `#181B24` with a 1px border of `#232733`. Incoming message bubbles and pinned callouts.
- **Level 3 (Overlays, Floating Action bars, Menus):** `#1F232E` with a 1px border of `#2E3445`, accompanied by a subtle ambient edge aura: `box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.65), 0 0 1px 1px rgba(59, 130, 246, 0.15)`.
- **Focus & Selection Glows:** Active conversation rows and focused text entry fields receive an illuminated border: border color shifts to `#3B82F6` accompanied by an electric aura: `0 0 0 1px #3B82F6, 0 0 12px -2px rgba(59, 130, 246, 0.35)`.

## Shapes
A clean, compact geometric structure (`roundedness: 1` / 4px base) dictates the visual identity:
- Small controls, badge counters, status indicators, and keyboard hints use `0.25rem` (4px).
- Input fields, context cards, floating action toolbars, and list selection tiles scale up to `rounded-lg` (`0.5rem` / 8px).
- Floating modals, drawer panels, and large image/media embeds scale to `rounded-xl` (`0.75rem` / 12px).
- Circular profiles and operational status indicator dots use standard full-radius curvature (`9999px`).

## Components

### Message Bubbles
- **Incoming:** Surface `#181B24`, border 1px `#232733`, text `#F3F4F6`. Radius is 8px on all corners, reduced to 2px on the top-left corner for consecutive messages within the same sender cluster.
- **Outgoing:** Surface `#1E293B` (or `#1D4ED8` for high-priority dispatch), border 1px `#3B82F6` with 30% alpha, text `#FFFFFF`. Radius is 8px, reduced to 2px on the top-right corner for consecutive messages.
- **Actions Hover Dock:** A floating bar positioned above the top right of the message container. Background `#1F232E`, border 1px `#2E3445`, containing micro-action icons (Reactions, Reply, Bookmark, More) spaced at 4px intervals.

### Buttons & Inputs
- **Primary Button:** Background `#3B82F6`, hover `#2563EB`, text `#FFFFFF`, border none, inner highlight glow `inset 0 1px 0 rgba(255, 255, 255, 0.2)`. Padding `6px 14px`, radius 6px.
- **Secondary / Ghost Button:** Background transparent, hover `#181B24`, active `#1F232E`, border 1px `#232733`, text `#9CA3AF`, hover text `#F3F4F6`.
- **Message Input Composer:** Fixed container `#181B24` with 1px border `#232733`, radius 8px, padding 10px 14px. Focus state triggers border `#3B82F6` with the electric accent aura. Integrated bottom toolbar for attachment, code snippet, emoji, and voice memo triggers.

### Status Indicators & Pills
- **Presence Indicators:** 8px circle with a 2px cutout ring matching the surrounding background surface (`#11131A` or `#181B24`).
  - Active: `#10B981` with an optional 3px radial glow `rgba(16, 185, 129, 0.4)`.
  - Busy / DND: `#F59E0B`.
  - Idle / Away: `#64748B`.
- **Unread Notification Badge:** Background `#3B82F6`, text `#FFFFFF`, font `label-sm`, min-width 18px, height 18px, padding `0 5px`, radius 9999px. Silent/muted channels use background `#232733` with text `#9CA3AF`.

### List Items & Channels
- **Thread Rows:** Height 56px, horizontal padding 10px, radius 6px.
  - Default: Transparent background.
  - Hover: Background `#181B24` with immediate transition (80ms ease).
  - Selected / Active: Background `#181B24`, border-left 2px solid `#3B82F6`. Secondary text shifts to high-emphasis `#F3F4F6`.

### Chips & Code Snippets
- **Mention Chips (`@user`):** Background `rgba(56, 189, 248, 0.12)`, border 1px `rgba(56, 189, 248, 0.25)`, text `#38BDF8`, font `label-md`, radius 4px, padding `1px 6px`.
- **Code Block Embed:** Background `#0D0E14`, border 1px `#232733`, font `code-inline`, radius 6px, padding `10px 12px`, syntax accent colors calibrated to icy blues, soft emerald, and muted coral.
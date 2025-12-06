# Dark Mode Implementation Guide

## Overview
A comprehensive dark mode system has been successfully implemented across the entire website with persistent user preferences and beautiful styling transitions.

## Features

### 1. **Theme Store (`src/lib/stores/theme.ts`)**
- Centralized theme state management using Svelte stores
- Automatically detects system color scheme preference
- Persists user choice to localStorage
- Exports `theme` store with `toggle()` and `subscribe()` methods

### 2. **Theme Toggle Component (`src/lib/components/ThemeToggle.svelte`)**
- Beautiful sun/moon icon that changes based on current theme
- Smooth color transitions
- Positioned in the navigation bar (desktop and mobile)
- Fully accessible with proper ARIA labels

### 3. **CSS Dark Mode Support (`src/routes/layout.css`)**
Updated utilities with dark mode variants:
- `@utility btn-secondary` - Dark variant for secondary buttons
- `@utility card` - Dark styling for card components
- `@utility input` - Dark styling for form inputs with proper focus states
- `@utility label` - Dark text colors
- `@utility section-title` & `@utility section-subtitle` - Dark headings
- `@utility badge-primary`, `@utility badge-success`, `@utility badge-warning`, `@utility badge-danger` - Dark badge styles

### 4. **Updated Components**
All components now include dark mode support:
- **Navigation** - Dark bg, borders, and hover states
- **PageHeader** - Dark heading and description text
- **TestSection** - Dark text colors and styling
- **ConsoleOutput** - Dark terminal-like appearance
- **Layout** - Dark background, footer, and smooth transitions
- **FormField** - Already using utility classes (inherits dark mode)

### 5. **Color Palette**
Dark mode uses complementary colors:
- Background: `#020617` (surface-950)
- Surface: `#1e293b` (surface-900)
- Text: `#f1f5f9` (surface-50)
- Accents: Primary blue with adjusted opacity

## How It Works

### User Flow
1. **On First Visit**: 
   - System checks `localStorage` for saved preference
   - Falls back to system color scheme (via `prefers-color-scheme` media query)
   - Defaults to light mode if neither is available

2. **Toggle**:
   - User clicks theme toggle button
   - Theme state updates in store
   - `dark` class is added/removed from `<html>` element
   - Preference is saved to localStorage
   - All CSS classes update via dark mode variants

3. **Persistence**:
   - User's choice persists across browser sessions
   - Works across all pages in the application

### Technical Implementation
- Uses CSS `:is()` pseudo-class for dark mode selectors: `html.dark & { ... }`
- Smooth 300ms transitions for theme changes
- Respects system preferences but allows user override
- All Tailwind dark mode classes (`dark:`) also work alongside utility classes

## Styling Details

### Dark Mode Activation
Dark mode is activated when the `dark` class is present on the `<html>` element:
```html
<html class="dark">
```

### Example Dark Mode Utilities
```css
@utility btn-secondary {
	@apply btn bg-surface-200 text-surface-800 hover:bg-surface-300 active:bg-surface-400;
	
	html.dark & {
		@apply bg-surface-700 text-surface-100 hover:bg-surface-600 active:bg-surface-500;
	}
}
```

### Tailwind Dark Mode Classes
Components also use Tailwind's built-in dark mode utilities:
```svelte
<p class="text-surface-600 dark:text-surface-400">Text</p>
<div class="bg-white dark:bg-surface-900">Container</div>
```

## Browser Support
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Uses `localStorage` for persistence
- Uses `matchMedia` for system preference detection

## User Experience
- ✨ Smooth 300ms transitions between themes
- 👁️ Reduces eye strain in low-light environments
- 🎨 Maintains visual hierarchy and contrast in both modes
- 💾 Remembers user preference across sessions
- 📱 Works seamlessly on mobile and desktop

## Future Enhancements
- Auto theme switching based on time of day
- Additional theme options (e.g., sepia, high contrast)
- Per-page theme customization
- Theme preview before applying

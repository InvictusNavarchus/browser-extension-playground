# Dark Mode Visual Guide

## Color Schemes

### Light Mode (Default)
- **Background**: `#f8fafc` (surface-50)
- **Text**: `#0f172a` (surface-900)
- **Cards**: `#ffffff` with `#e2e8f0` border
- **Primary**: `#2563eb` (blue-600)

### Dark Mode
- **Background**: `#020617` (surface-950)
- **Text**: `#f1f5f9` (surface-50)
- **Cards**: `#1e293b` with `#334155` border
- **Primary**: `#2563eb` (blue-600) - Same, with adjusted opacity

## Components Styling

### Navigation Bar
- Light: White background with light text
- Dark: `#0f172a` background with light text
- Toggle button changes from gray to dark

### Cards & Containers
- Light: White with subtle gray border
- Dark: Dark slate with lighter border
- Shadows adjusted for readability

### Buttons
- **Primary**: Always blue (consistent branding)
- **Secondary**: 
  - Light: Gray with dark text
  - Dark: Dark gray with light text
- **Danger/Success**: Adjusted saturation for dark mode

### Form Inputs
- Light: White background, dark text
- Dark: Very dark background with light text
- Focus states maintained with proper contrast

### Console/Terminal
- Light: Very dark background with green text
- Dark: Same or slightly adjusted for consistency

## Transitions
- All theme changes use smooth 300ms CSS transitions
- Properties affected: colors, backgrounds, borders, shadows
- Provides seamless user experience

## Accessibility Features
✓ Maintains sufficient contrast ratios in both modes
✓ System preference detection (`prefers-color-scheme`)
✓ ARIA labels on toggle button
✓ Keyboard accessible theme switching
✓ Proper focus indicators in both modes

## How to Test

### In Browser DevTools Console
```javascript
// Toggle to dark mode
document.documentElement.classList.add('dark');

// Toggle to light mode
document.documentElement.classList.remove('dark');

// Check current preference from localStorage
localStorage.getItem('theme');
```

### Manual Testing
1. Click the sun/moon icon in the navigation bar
2. Refresh the page - theme preference is maintained
3. Open DevTools and inspect the `<html>` element for `class="dark"`
4. Test on different screen sizes and devices

## Browser DevTools Support
Most modern browsers support theme simulation:
- **Chrome/Edge**: DevTools → Rendering → Emulate CSS media feature prefers-color-scheme
- **Firefox**: about:config → `ui.systemUsesDarkTheme: 1` (for dark) or 0 (for light)
- **Safari**: Preferences → Advanced → Appearance (system-wide setting)

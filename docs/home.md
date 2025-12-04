# Home Page Guide

The home page serves as the dashboard and entry point for the Browser Extension Playground. It provides an overview of all features and displays real-time browser information.

## Overview

**Route**: `/`

The home page is designed to help extension developers quickly understand what the playground offers and verify that their extension is loading correctly.

## Features

### 1. Feature Cards Grid

A grid of clickable cards that link to each test page. Each card displays:
- Icon representation
- Feature name
- Brief description of testing capabilities

**Extension Testing Use Cases:**
- Verify your extension's content script injects properly on page load
- Test that your extension's UI modifications appear correctly
- Check if your extension detects and modifies feature cards

### 2. Real-Time Browser Information

Displays live browser environment data:

| Property | Description | Update Frequency |
|----------|-------------|------------------|
| Window Size | Current viewport dimensions | On resize |
| User Agent | Browser's user agent string | Static |
| Language | Browser's preferred language | Static |
| Online Status | Network connectivity status | On change |
| Cookies Enabled | Whether cookies are allowed | Static |
| Platform | Operating system platform | Static |

**Extension Testing Use Cases:**
- Test extensions that modify or spoof user agent
- Verify extensions that detect browser capabilities
- Test offline-mode handling in your extension

### 3. Quick Test Section

Interactive form elements for quick functionality testing:
- Text input with placeholder
- Checkbox toggle
- Action buttons

**Extension Testing Use Cases:**
- Test form auto-fill extensions
- Verify input monitoring/modification
- Test click handlers and event interception

## Code Structure

```svelte
<script lang="ts">
  // Reactive state using Svelte 5 runes
  let windowSize = $state({ width: 0, height: 0 });
  let browserInfo = $state({ ... });
  
  // Effect for window resize tracking
  $effect(() => {
    const handleResize = () => {
      windowSize = { 
        width: window.innerWidth, 
        height: window.innerHeight 
      };
    };
    // ...
  });
</script>
```

## Testing Scenarios

### Scenario 1: Content Script Injection
1. Load the home page
2. Verify your content script runs (check console for logs)
3. Confirm any DOM modifications appear correctly

### Scenario 2: Browser API Detection
1. Check the browser info section
2. Verify your extension correctly reads/modifies these values
3. Test with different browser configurations

### Scenario 3: Event Handling
1. Use the quick test section
2. Type in the text input
3. Click buttons and toggle checkboxes
4. Verify your extension captures these events

## API References

The home page uses these browser APIs that extensions commonly interact with:

- `window.innerWidth` / `window.innerHeight`
- `navigator.userAgent`
- `navigator.language`
- `navigator.onLine`
- `navigator.cookieEnabled`
- `navigator.platform`

## Tips for Extension Developers

1. **Console Logging**: Open DevTools and check for any errors when your extension loads
2. **DOM Inspection**: Use the Elements panel to verify your injected content
3. **Network Tab**: Monitor any requests your extension makes on page load
4. **Performance**: Check if your extension impacts page load time

# DOM Manipulation Guide

The DOM page provides a comprehensive testing environment for content scripts and DOM manipulation features commonly used by browser extensions.

## Overview

**Route**: `/dom`

This page allows testing of DOM injection, observation, modification, and traversal - the core capabilities needed by most browser extension content scripts.

## Test Sections

### 1. Element Injection

Inject new HTML elements into the page dynamically.

**Features:**
- Custom HTML input textarea
- Target container selection
- Position options (prepend, append, replace)
- Immediate visual feedback

**How to Use:**
1. Enter HTML code in the textarea (e.g., `<div class="my-element">Hello</div>`)
2. Select where to inject (container ID)
3. Choose position: beginning, end, or replace contents
4. Click "Inject Element"
5. Observe the result in the target container

**Extension Testing:**
```javascript
// Test your extension's element detection
const injected = document.querySelector('.my-element');
console.log('Found injected element:', injected);
```

### 2. MutationObserver Testing

Monitor DOM changes in real-time - essential for extensions that need to react to page updates.

**Features:**
- Start/stop observation controls
- Configure observation options:
  - `childList`: Watch for added/removed nodes
  - `attributes`: Watch for attribute changes
  - `characterData`: Watch for text content changes
  - `subtree`: Observe entire subtree
- Real-time mutation logging

**How to Use:**
1. Click "Start Observing" to begin monitoring
2. Make changes to the observed container (inject elements, modify text)
3. Watch the console output for mutation records
4. Click "Stop Observing" when done

**Extension Testing:**
```javascript
// Extensions often use MutationObserver like this:
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        // Process new elements
      });
    }
  });
});
```

### 3. Shadow DOM

Test extension behavior with Shadow DOM encapsulation.

**Features:**
- Create shadow roots (open or closed)
- Inject content into shadow DOM
- Test style encapsulation

**How to Use:**
1. Click "Create Shadow Root" to attach a shadow DOM
2. Choose mode: `open` (accessible) or `closed` (restricted)
3. Add content inside the shadow root
4. Test your extension's ability to access shadow content

**Important Notes:**
- Closed shadow roots are not accessible via `element.shadowRoot`
- Extensions may need special handling for shadow DOM content
- Styles inside shadow DOM are encapsulated

**Extension Testing:**
```javascript
// Accessing open shadow DOM
const host = document.querySelector('#shadow-host');
const shadow = host.shadowRoot; // null if closed
if (shadow) {
  const innerContent = shadow.querySelector('.shadow-content');
}
```

### 4. Element Cloning

Test deep and shallow cloning of DOM elements.

**Features:**
- Clone any element by selector
- Deep clone (includes children) or shallow clone
- Clone with or without event listeners

**How to Use:**
1. Enter a CSS selector for the element to clone
2. Choose deep or shallow clone
3. Click "Clone Element"
4. The clone appears in the output area

### 5. Attribute Modification

Modify element attributes dynamically.

**Features:**
- Target element by selector
- Add, modify, or remove attributes
- Test `data-*` attributes
- Modify classes, IDs, styles

**How to Use:**
1. Enter the target element selector
2. Specify attribute name and new value
3. Click "Set Attribute" or "Remove Attribute"
4. Observe the change in the element

**Extension Testing:**
```javascript
// Common attribute operations
element.setAttribute('data-extension-processed', 'true');
element.classList.add('extension-modified');
element.removeAttribute('hidden');
```

## Console Output

All operations log to the on-page console, showing:
- Timestamps for each action
- Success/failure status
- Relevant details (element counts, attribute values, etc.)

## Common Extension Patterns

### Pattern 1: Wait for Element
```javascript
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);
    
    const observer = new MutationObserver((mutations, obs) => {
      const el = document.querySelector(selector);
      if (el) {
        obs.disconnect();
        resolve(el);
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      observer.disconnect();
      reject(new Error('Element not found'));
    }, timeout);
  });
}
```

### Pattern 2: Safe Element Injection
```javascript
function safeInject(html, container) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const element = template.content.firstChild;
  container.appendChild(element);
  return element;
}
```

### Pattern 3: Shadow DOM Piercing
```javascript
function queryShadow(selector, root = document) {
  const elements = root.querySelectorAll('*');
  for (const el of elements) {
    if (el.shadowRoot) {
      const found = el.shadowRoot.querySelector(selector);
      if (found) return found;
      const nested = queryShadow(selector, el.shadowRoot);
      if (nested) return nested;
    }
  }
  return null;
}
```

## Tips

1. **Performance**: Minimize DOM operations by batching changes
2. **Memory Leaks**: Always disconnect MutationObservers when done
3. **Shadow DOM**: Not all content is accessible - design accordingly
4. **Event Delegation**: Use event delegation for dynamically added elements

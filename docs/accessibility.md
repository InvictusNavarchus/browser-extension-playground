# Accessibility Guide

The Accessibility page provides comprehensive testing for accessibility-related extension features including ARIA, focus management, and assistive technology support.

## Overview

**Route**: `/accessibility`

Test your extension's impact on accessibility and verify that your features work well with screen readers and other assistive technologies.

## Test Sections

### 1. Accessibility Preferences

Detect and respond to user accessibility settings.

**Preferences Detected:**

| Preference | Media Query | Description |
|------------|-------------|-------------|
| Reduced Motion | `prefers-reduced-motion: reduce` | User prefers less animation |
| High Contrast | `prefers-contrast: more` | User needs higher contrast |
| Color Scheme | `prefers-color-scheme: dark` | Dark/light mode preference |

**How to Use:**
1. View detected preferences
2. Toggle high contrast mode
3. Adjust font size
4. Observe changes

**Extension Testing:**
```javascript
// Detect accessibility preferences
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const prefersHighContrast = window.matchMedia(
  '(prefers-contrast: more)'
).matches;

const prefersDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;

// Listen for changes
window.matchMedia('(prefers-reduced-motion: reduce)')
  .addEventListener('change', (e) => {
    if (e.matches) {
      disableAnimations();
    } else {
      enableAnimations();
    }
  });
```

### 2. Focus Management

Test programmatic focus control and tab order.

**Features:**
- Collect focusable elements
- Navigate focus programmatically
- Test tab order
- Focus trap demonstration

**How to Use:**
1. Click "Collect Focusable Elements"
2. Use Previous/Next buttons to move focus
3. Press Tab to test natural order
4. View focus count

**Focusable Elements:**
- `<button>`
- `<a href="...">`
- `<input>`, `<select>`, `<textarea>`
- Elements with `tabindex >= 0`
- NOT: `tabindex="-1"` (programmatically focusable only)

**Extension Testing:**
```javascript
// Get all focusable elements
function getFocusableElements(container = document) {
  const selector = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  
  return Array.from(container.querySelectorAll(selector))
    .filter(el => el.offsetParent !== null); // Visible only
}

// Focus trap for modals
function createFocusTrap(container) {
  const focusable = getFocusableElements(container);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  
  first?.focus();
}
```

### 3. ARIA Live Regions

Test screen reader announcements.

**Live Region Types:**

| Type | Attribute | Behavior |
|------|-----------|----------|
| Polite | `aria-live="polite"` | Announces when user is idle |
| Assertive | `aria-live="assertive"` | Interrupts immediately |

**How to Use:**
1. Enter a message
2. Click "Announce (Polite)" or "Announce (Assertive)"
3. Screen reader will announce the message

**Extension Testing:**
```javascript
// Create announcement utility
function announce(message, priority = 'polite') {
  const region = document.createElement('div');
  region.setAttribute('aria-live', priority);
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only'; // Visually hidden
  
  document.body.appendChild(region);
  
  // Delay to ensure screen reader catches the change
  setTimeout(() => {
    region.textContent = message;
  }, 100);
  
  // Clean up
  setTimeout(() => {
    region.remove();
  }, 1000);
}

// CSS for sr-only
// .sr-only {
//   position: absolute;
//   width: 1px;
//   height: 1px;
//   padding: 0;
//   margin: -1px;
//   overflow: hidden;
//   clip: rect(0, 0, 0, 0);
//   border: 0;
// }
```

### 4. Accessible Accordion

ARIA-compliant expandable sections.

**ARIA Attributes Used:**
- `aria-expanded` - Current state
- `aria-controls` - Target panel ID
- `role="region"` - Panel landmark
- `aria-labelledby` - Panel heading reference

**How to Use:**
1. Click accordion headers to expand/collapse
2. Use keyboard (Enter/Space) to toggle
3. Tab between headers

**Extension Testing:**
```javascript
// Accessible accordion pattern
class AccessibleAccordion {
  constructor(container) {
    this.headers = container.querySelectorAll('[data-accordion-header]');
    this.init();
  }
  
  init() {
    this.headers.forEach(header => {
      const panelId = header.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      
      header.addEventListener('click', () => this.toggle(header, panel));
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(header, panel);
        }
      });
    });
  }
  
  toggle(header, panel) {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', !expanded);
    panel.hidden = expanded;
  }
}
```

### 5. Accessible Tabs

ARIA-compliant tab panel with keyboard navigation.

**Keyboard Navigation:**
- `Arrow Left/Right` - Switch tabs
- `Tab` - Move to tab panel
- `Home` - First tab
- `End` - Last tab

**ARIA Attributes:**
- `role="tablist"` - Tab container
- `role="tab"` - Individual tabs
- `role="tabpanel"` - Content panels
- `aria-selected` - Active tab
- `aria-controls` - Tab's panel
- `aria-labelledby` - Panel's tab

**Extension Testing:**
```javascript
// Accessible tabs implementation
class AccessibleTabs {
  constructor(container) {
    this.tablist = container.querySelector('[role="tablist"]');
    this.tabs = container.querySelectorAll('[role="tab"]');
    this.panels = container.querySelectorAll('[role="tabpanel"]');
    this.init();
  }
  
  init() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.select(index));
      tab.addEventListener('keydown', (e) => this.handleKeydown(e, index));
    });
    
    this.select(0);
  }
  
  select(index) {
    this.tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', selected);
      tab.setAttribute('tabindex', selected ? '0' : '-1');
      this.panels[i].hidden = !selected;
    });
    
    this.tabs[index].focus();
  }
  
  handleKeydown(e, index) {
    let newIndex;
    
    switch (e.key) {
      case 'ArrowLeft':
        newIndex = (index - 1 + this.tabs.length) % this.tabs.length;
        break;
      case 'ArrowRight':
        newIndex = (index + 1) % this.tabs.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = this.tabs.length - 1;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    this.select(newIndex);
  }
}
```

### 6. Accessible Modal

ARIA-compliant modal dialog.

**Features:**
- Focus trap
- Escape to close
- Background click to close
- Focus restoration on close
- Body scroll lock

**ARIA Attributes:**
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` - Dialog title
- `aria-describedby` - Dialog description

**Extension Testing:**
```javascript
class AccessibleModal {
  constructor() {
    this.activeModal = null;
    this.previousFocus = null;
  }
  
  open(modal) {
    this.previousFocus = document.activeElement;
    this.activeModal = modal;
    
    modal.setAttribute('aria-hidden', 'false');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const focusable = getFocusableElements(modal);
    focusable[0]?.focus();
    
    // Event listeners
    modal.addEventListener('keydown', this.handleKeydown);
    modal.addEventListener('click', this.handleBackdropClick);
  }
  
  close() {
    if (!this.activeModal) return;
    
    this.activeModal.setAttribute('aria-hidden', 'true');
    this.activeModal.hidden = true;
    document.body.style.overflow = '';
    
    this.previousFocus?.focus();
    this.activeModal = null;
  }
  
  handleKeydown = (e) => {
    if (e.key === 'Escape') {
      this.close();
    }
  }
  
  handleBackdropClick = (e) => {
    if (e.target === this.activeModal) {
      this.close();
    }
  }
}
```

### 7. Form Accessibility

Properly labeled form controls.

**Best Practices:**
- Every input has a `<label>`
- Required fields marked with `aria-required`
- Error states use `aria-invalid`
- Help text linked with `aria-describedby`
- Error messages use `role="alert"`
- Fieldsets group related inputs

**Extension Testing:**
```javascript
// Check form accessibility
function auditFormAccessibility(form) {
  const issues = [];
  
  form.querySelectorAll('input, select, textarea').forEach(input => {
    // Check for label
    const label = form.querySelector(`label[for="${input.id}"]`);
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!label && !ariaLabel && !ariaLabelledBy) {
      issues.push({
        element: input,
        issue: 'Missing label'
      });
    }
    
    // Check required fields
    if (input.required && !input.getAttribute('aria-required')) {
      issues.push({
        element: input,
        issue: 'Required field missing aria-required'
      });
    }
  });
  
  return issues;
}
```

### 8. ARIA Roles Reference

Common ARIA roles with examples.

**Landmark Roles:**
- `banner` - Site header
- `navigation` - Nav links
- `main` - Main content
- `complementary` - Sidebar
- `contentinfo` - Footer

**Widget Roles:**
- `button` - Clickable element
- `checkbox` - Two-state input
- `dialog` - Modal window
- `tab` / `tablist` / `tabpanel` - Tab interface
- `menu` / `menuitem` - Menu interface

## Common Extension Patterns

### Pattern 1: Accessibility Checker
```javascript
class A11yChecker {
  check() {
    return {
      missingAlt: this.findMissingAlt(),
      missingLabels: this.findMissingLabels(),
      lowContrast: this.findLowContrast(),
      missingLandmarks: this.findMissingLandmarks()
    };
  }
  
  findMissingAlt() {
    return document.querySelectorAll('img:not([alt])');
  }
  
  findMissingLabels() {
    const inputs = document.querySelectorAll('input, select, textarea');
    return Array.from(inputs).filter(input => {
      return !input.labels?.length && 
             !input.getAttribute('aria-label') &&
             !input.getAttribute('aria-labelledby');
    });
  }
  
  findMissingLandmarks() {
    const issues = [];
    if (!document.querySelector('[role="main"], main')) {
      issues.push('Missing main landmark');
    }
    if (!document.querySelector('[role="navigation"], nav')) {
      issues.push('Missing navigation landmark');
    }
    return issues;
  }
}
```

### Pattern 2: Skip Link Injector
```javascript
function injectSkipLink() {
  const main = document.querySelector('main, [role="main"]');
  if (!main) return;
  
  if (!main.id) main.id = 'main-content';
  
  const skipLink = document.createElement('a');
  skipLink.href = '#' + main.id;
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = `
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 1em;
    background: #000;
    color: #fff;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}
```

## Tips

1. **Test with Screen Readers**: Use NVDA, VoiceOver, or JAWS
2. **Keyboard Navigation**: Ensure all functionality works without mouse
3. **Color Contrast**: Maintain WCAG AA minimum (4.5:1 for text)
4. **Focus Indicators**: Never remove focus outlines without replacement
5. **Semantic HTML**: Use proper elements before adding ARIA
6. **Testing Tools**: Use Lighthouse, axe, or WAVE extensions

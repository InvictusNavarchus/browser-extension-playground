# Events & Messaging Guide

The Events page provides comprehensive testing for event handling and cross-context messaging, essential for browser extension communication.

## Overview

**Route**: `/events`

Test custom events, postMessage API, broadcast channels, and various DOM events that extensions commonly intercept or dispatch.

## Test Sections

### 1. Custom Events

Dispatch and listen for custom DOM events.

**Features:**
- Custom event name
- Event detail (payload)
- Bubbles option
- Cancelable option
- One-time listener option

**How to Use:**
1. Enter event name (e.g., `my-extension-event`)
2. Enter event detail/payload
3. Configure bubbling and cancelable options
4. Click "Listen (Once)" to start listening
5. Click "Dispatch Event" to fire the event
6. View event details in the console

**Extension Testing:**
```javascript
// Dispatch custom event from extension
document.dispatchEvent(new CustomEvent('extension-ready', {
  detail: {
    name: 'MyExtension',
    version: '1.0.0',
    capabilities: ['feature1', 'feature2']
  },
  bubbles: true
}));

// Listen for events from page
document.addEventListener('page-action', (e) => {
  console.log('Page requested action:', e.detail);
});
```

### 2. PostMessage API

Cross-window and cross-origin communication.

**Targets:**
- **Self**: Send message to current window
- **Iframe**: Send to embedded iframe
- **Opener**: Send to window that opened this one
- **Parent**: Send to parent frame (if in iframe)

**Features:**
- Target selection
- Custom message content
- Origin restriction
- Message listener toggle

**How to Use:**
1. Select target window (self, iframe, opener, parent)
2. Enter message content
3. Set target origin (`*` for any, or specific origin)
4. Enable the message listener
5. Click "Send Message"
6. View received messages in the console

**Extension Testing:**
```javascript
// Content script sending to page
window.postMessage({
  type: 'FROM_EXTENSION',
  action: 'getData',
  requestId: Date.now()
}, '*');

// Page listening for extension messages
window.addEventListener('message', (e) => {
  if (e.data?.type === 'FROM_EXTENSION') {
    // Handle extension request
    window.postMessage({
      type: 'TO_EXTENSION',
      requestId: e.data.requestId,
      data: { /* response */ }
    }, '*');
  }
});

// Content script receiving response
window.addEventListener('message', (e) => {
  if (e.data?.type === 'TO_EXTENSION') {
    console.log('Response from page:', e.data);
  }
});
```

### 3. Broadcast Channel

Cross-tab communication within same origin.

**Features:**
- Create named channels
- Send broadcasts
- Receive from other tabs

**How to Use:**
1. Enter channel name
2. Click "Create Channel"
3. Open page in another tab
4. Create same channel in new tab
5. Send messages between tabs

**Extension Testing:**
```javascript
// Sync state across tabs
const channel = new BroadcastChannel('extension-sync');

channel.onmessage = (e) => {
  if (e.data.type === 'state-update') {
    updateLocalState(e.data.state);
  }
};

function broadcastStateChange(newState) {
  channel.postMessage({
    type: 'state-update',
    state: newState
  });
}
```

### 4. Window Events

Monitor various window and document events.

**Available Events:**

| Event | Trigger |
|-------|---------|
| `resize` | Window size changes |
| `scroll` | Page scrolls |
| `focus` | Window gains focus |
| `blur` | Window loses focus |
| `online` | Network connection restored |
| `offline` | Network connection lost |
| `beforeunload` | Page about to unload |
| `hashchange` | URL hash changes |
| `popstate` | History navigation |
| `storage` | localStorage changed (other tab) |
| `visibilitychange` | Tab visibility changes |

**How to Use:**
1. Click event buttons to toggle listeners
2. Trigger the events (resize window, switch tabs, etc.)
3. View events in the console

**Extension Testing:**
```javascript
// Track tab visibility
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseExtensionActivity();
  } else {
    resumeExtensionActivity();
  }
});

// Handle navigation
window.addEventListener('popstate', (e) => {
  console.log('Navigation:', e.state);
  updateExtensionState(e.state);
});
```

### 5. Keyboard Events

Capture keyboard input.

**Captured Data:**
- Key pressed
- Key code
- Modifier keys (Ctrl, Alt, Shift, Meta)
- Event type (keydown, keyup)

**How to Use:**
1. Click "Start Listening"
2. Press keys on keyboard
3. View key info in real-time

**Extension Testing:**
```javascript
// Global keyboard shortcut handler
document.addEventListener('keydown', (e) => {
  // Check for Ctrl+Shift+E
  if (e.ctrlKey && e.shiftKey && e.key === 'E') {
    e.preventDefault();
    toggleExtensionPanel();
  }
});
```

### 6. Mouse Events

Track mouse movements and clicks.

**Captured Events:**
- `mousemove` - Position tracking
- `click` - Left clicks
- `dblclick` - Double clicks
- `contextmenu` - Right clicks

**How to Use:**
1. Click "Start Listening"
2. Move mouse around the page
3. Click, double-click, right-click
4. View events in the console

**Extension Testing:**
```javascript
// Track user interactions
document.addEventListener('click', (e) => {
  logInteraction({
    type: 'click',
    target: e.target.tagName,
    position: { x: e.clientX, y: e.clientY },
    timestamp: Date.now()
  });
});
```

### 7. Touch Events

Mobile/touchscreen interaction.

**Captured Events:**
- `touchstart` - Touch begins
- `touchmove` - Touch moves
- `touchend` - Touch ends

**How to Use:**
1. Enable touch listener
2. Use touch input (or enable device emulation in DevTools)
3. View touch coordinates and count

### 8. Clipboard Events

Monitor copy, cut, and paste operations.

**Captured Events:**
- `copy` - Content copied
- `cut` - Content cut
- `paste` - Content pasted

**How to Use:**
1. Enable clipboard listener
2. Select text and copy (Ctrl+C)
3. Paste content (Ctrl+V)
4. View clipboard data in console

**Extension Testing:**
```javascript
// Intercept clipboard operations
document.addEventListener('copy', (e) => {
  const selection = window.getSelection().toString();
  
  // Modify clipboard content
  e.clipboardData.setData('text/plain', 
    transformText(selection)
  );
  e.preventDefault();
});
```

### 9. Drag & Drop Events

File and element drag operations.

**Features:**
- Draggable test element
- Drop zone
- File drop support

**How to Use:**
1. Enable drag & drop listener
2. Drag the "Drag me" element to the drop zone
3. Or drag files from your system
4. View drop data in console

**Extension Testing:**
```javascript
// Handle file drops
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  
  const files = Array.from(e.dataTransfer.files);
  files.forEach(file => {
    processDroppedFile(file);
  });
});
```

## Communication Patterns

### Pattern 1: Request-Response via postMessage
```javascript
// Request with response handling
function sendRequest(action, data) {
  return new Promise((resolve, reject) => {
    const requestId = Math.random().toString(36);
    
    const handler = (e) => {
      if (e.data?.requestId === requestId) {
        window.removeEventListener('message', handler);
        if (e.data.error) {
          reject(new Error(e.data.error));
        } else {
          resolve(e.data.result);
        }
      }
    };
    
    window.addEventListener('message', handler);
    window.postMessage({ action, data, requestId }, '*');
    
    // Timeout
    setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error('Request timeout'));
    }, 5000);
  });
}
```

### Pattern 2: Event Bus
```javascript
class EventBus {
  constructor() {
    this.handlers = new Map();
  }
  
  on(event, callback) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event).add(callback);
    
    return () => this.off(event, callback);
  }
  
  off(event, callback) {
    this.handlers.get(event)?.delete(callback);
  }
  
  emit(event, data) {
    this.handlers.get(event)?.forEach(cb => cb(data));
    
    // Also dispatch DOM event for cross-script communication
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}

const bus = new EventBus();
```

### Pattern 3: Cross-Tab State Sync
```javascript
class TabSync {
  constructor(channelName) {
    this.channel = new BroadcastChannel(channelName);
    this.state = {};
    this.listeners = new Set();
    
    this.channel.onmessage = (e) => {
      this.state = { ...this.state, ...e.data };
      this.notify();
    };
  }
  
  update(partial) {
    this.state = { ...this.state, ...partial };
    this.channel.postMessage(partial);
    this.notify();
  }
  
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  
  notify() {
    this.listeners.forEach(cb => cb(this.state));
  }
}
```

## Tips

1. **Event Delegation**: Use event delegation for dynamically added elements
2. **Cleanup**: Always remove event listeners when done
3. **Origin Checking**: Verify message origins in postMessage handlers
4. **Debouncing**: Debounce high-frequency events (resize, scroll, mousemove)
5. **Passive Listeners**: Use `{ passive: true }` for scroll/touch when possible

# Notifications Guide

The Notifications page provides comprehensive testing for browser notification APIs and user feedback mechanisms.

## Overview

**Route**: `/notifications`

Test browser notifications, alerts, badges, vibration, and other user feedback APIs commonly used by extensions.

## Test Sections

### 1. Notification Permission

Check and request notification permission.

**Permission States:**

| State | Description |
|-------|-------------|
| `default` | User hasn't been asked yet |
| `granted` | User allowed notifications |
| `denied` | User blocked notifications |

**How to Use:**
1. Check current permission status
2. Click "Request Permission" if not granted
3. Allow or deny in browser prompt

**Extension Testing:**
```javascript
// Check permission
console.log('Notification permission:', Notification.permission);

// Request permission
async function requestPermission() {
  if (Notification.permission === 'default') {
    const result = await Notification.requestPermission();
    console.log('Permission result:', result);
  }
}
```

### 2. Browser Notifications

Create and display system notifications.

**Notification Options:**

| Option | Type | Description |
|--------|------|-------------|
| `title` | string | Notification title |
| `body` | string | Notification body text |
| `icon` | string | Icon URL |
| `tag` | string | Tag for grouping/replacing |
| `requireInteraction` | boolean | Stay until dismissed |
| `silent` | boolean | No sound/vibration |
| `data` | any | Custom data payload |

**How to Use:**
1. Fill in notification fields
2. Configure options (require interaction, silent)
3. Click "Show Basic Notification"
4. Interact with the notification

**Extension Testing:**
```javascript
// Create notification
function showNotification(title, options = {}) {
  if (Notification.permission !== 'granted') {
    console.warn('Notifications not permitted');
    return null;
  }
  
  const notification = new Notification(title, {
    body: options.body || '',
    icon: options.icon || '/icon.png',
    tag: options.tag,
    requireInteraction: options.requireInteraction || false,
    silent: options.silent || false,
    data: options.data
  });
  
  notification.onclick = () => {
    window.focus();
    notification.close();
    if (options.onClick) options.onClick(notification);
  };
  
  notification.onclose = () => {
    if (options.onClose) options.onClose(notification);
  };
  
  return notification;
}
```

### 3. Service Worker Notifications

Notifications that persist even when page is closed.

**Additional Options:**
- `actions` - Notification action buttons
- `badge` - Small icon for mobile
- `image` - Large image preview
- `vibrate` - Vibration pattern

**How to Use:**
1. Same options as basic notification
2. Click "Show SW Notification"
3. Note: Requires active service worker

**Extension Testing:**
```javascript
// Service worker notification
async function showSWNotification(title, options) {
  const registration = await navigator.serviceWorker.ready;
  
  await registration.showNotification(title, {
    body: options.body,
    icon: options.icon,
    badge: options.badge,
    tag: options.tag,
    data: options.data,
    actions: [
      { action: 'view', title: 'View', icon: '/view-icon.png' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    requireInteraction: true
  });
}

// Handle notification clicks in service worker
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  
  if (e.action === 'view') {
    clients.openWindow(e.notification.data.url);
  }
});
```

### 4. Native Dialogs

Test browser's built-in dialog functions.

**Dialog Types:**

| Function | Returns | Description |
|----------|---------|-------------|
| `alert()` | void | Information message |
| `confirm()` | boolean | Yes/no question |
| `prompt()` | string\|null | Text input |

**How to Use:**
1. Click dialog buttons
2. Interact with dialogs
3. View return values in console

**Extension Note:** Extensions can intercept these by overriding window methods:
```javascript
// Intercept alerts
const originalAlert = window.alert;
window.alert = function(message) {
  console.log('Alert intercepted:', message);
  // Optionally show custom UI instead
  // originalAlert.call(window, message);
};
```

### 5. App Badge API

Set notification badges on PWA icons.

**Methods:**
- `setAppBadge(count)` - Set badge number
- `clearAppBadge()` - Remove badge

**How to Use:**
1. Enter badge count
2. Click "Set Badge"
3. View badge on PWA icon (if installed)
4. Click "Clear Badge" to remove

**Extension Testing:**
```javascript
// Set badge
if ('setAppBadge' in navigator) {
  await navigator.setAppBadge(5);
}

// Clear badge
if ('clearAppBadge' in navigator) {
  await navigator.clearAppBadge();
}
```

### 6. Vibration API

Trigger device vibration (mobile).

**Vibration Patterns:**
- Single number: Duration in ms
- Array: [vibrate, pause, vibrate, pause, ...]

**Examples:**
- `200` - Vibrate 200ms
- `[200, 100, 200]` - Vibrate, pause, vibrate

**How to Use:**
1. Enter vibration pattern
2. Click "Vibrate"
3. Click "Stop" to cancel

**Extension Testing:**
```javascript
// Single vibration
navigator.vibrate(200);

// Pattern
navigator.vibrate([100, 50, 100, 50, 100]);

// Stop vibration
navigator.vibrate(0);
```

### 7. Screen Wake Lock

Prevent screen from turning off.

**How to Use:**
1. Click "Request Wake Lock"
2. Screen will stay on
3. Click "Release Wake Lock" when done

**Extension Testing:**
```javascript
let wakeLock = null;

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake lock active');
      
      wakeLock.addEventListener('release', () => {
        console.log('Wake lock released');
      });
    } catch (err) {
      console.error('Wake lock error:', err);
    }
  }
}

async function releaseWakeLock() {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
}

// Auto-reacquire when page becomes visible
document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible' && !wakeLock) {
    await requestWakeLock();
  }
});
```

### 8. Custom Toast Notifications

In-page toast notifications (commonly modified by extensions).

**Toast Types:**
- Info (blue)
- Success (green)
- Warning (yellow)
- Error (red)

**How to Use:**
1. Click toast type buttons
2. Watch toast appear and auto-dismiss
3. Note animation and styling

## Common Extension Patterns

### Pattern 1: Notification Manager
```javascript
class NotificationManager {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }
  
  async show(title, options = {}) {
    if (Notification.permission !== 'granted') {
      const result = await Notification.requestPermission();
      if (result !== 'granted') return null;
    }
    
    return new Promise((resolve) => {
      this.queue.push({ title, options, resolve });
      this.processQueue();
    });
  }
  
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    const { title, options, resolve } = this.queue.shift();
    
    const notification = new Notification(title, options);
    
    notification.onclose = () => {
      resolve(notification);
      this.isProcessing = false;
      this.processQueue();
    };
    
    // Auto-close after timeout
    if (options.timeout) {
      setTimeout(() => notification.close(), options.timeout);
    }
  }
  
  closeAll() {
    // Notifications auto-close, but we can clear queue
    this.queue = [];
  }
}
```

### Pattern 2: Toast System
```javascript
class ToastManager {
  constructor(container = document.body) {
    this.container = container;
    this.toasts = [];
    this.createContainer();
  }
  
  createContainer() {
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    this.toastContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    this.container.appendChild(this.toastContainer);
  }
  
  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      animation: slideIn 0.3s ease;
      cursor: pointer;
      ${this.getTypeStyles(type)}
    `;
    
    toast.onclick = () => this.dismiss(toast);
    this.toastContainer.appendChild(toast);
    this.toasts.push(toast);
    
    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }
    
    return toast;
  }
  
  getTypeStyles(type) {
    const styles = {
      info: 'background: #3b82f6;',
      success: 'background: #10b981;',
      warning: 'background: #f59e0b;',
      error: 'background: #ef4444;'
    };
    return styles[type] || styles.info;
  }
  
  dismiss(toast) {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      toast.remove();
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 300);
  }
}
```

### Pattern 3: Badge Counter
```javascript
class BadgeCounter {
  constructor() {
    this.count = 0;
  }
  
  async increment(amount = 1) {
    this.count += amount;
    await this.update();
  }
  
  async decrement(amount = 1) {
    this.count = Math.max(0, this.count - amount);
    await this.update();
  }
  
  async set(count) {
    this.count = Math.max(0, count);
    await this.update();
  }
  
  async clear() {
    this.count = 0;
    await this.update();
  }
  
  async update() {
    if ('setAppBadge' in navigator) {
      if (this.count > 0) {
        await navigator.setAppBadge(this.count);
      } else {
        await navigator.clearAppBadge();
      }
    }
  }
}
```

## Tips

1. **Permission Timing**: Request permission after user interaction
2. **Notification Fatigue**: Don't spam users with notifications
3. **Actionable**: Make notifications useful with clear actions
4. **Fallbacks**: Always have fallback for unsupported APIs
5. **Testing**: Test on both desktop and mobile browsers

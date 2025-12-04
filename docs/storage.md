# Storage APIs Guide

The Storage page provides testing for all browser storage mechanisms commonly accessed by browser extensions.

## Overview

**Route**: `/storage`

Test localStorage, sessionStorage, cookies, and IndexedDB - the primary ways extensions and websites store persistent data.

## Test Sections

### 1. LocalStorage

Persistent key-value storage that survives browser restarts.

**Features:**
- Set key-value pairs
- Get values by key
- Delete specific keys
- Clear all localStorage
- View all stored items

**How to Use:**
1. Enter a key name (e.g., `myExtension_setting`)
2. Enter a value (string, JSON, etc.)
3. Click "Set" to store
4. Click "Get" to retrieve
5. Use "View All" to see all stored items

**Storage Limits:**
- Typically 5-10 MB per origin
- Synchronous API (can block main thread)
- Strings only (JSON.stringify for objects)

**Extension Testing:**
```javascript
// Extensions commonly use prefixed keys
localStorage.setItem('ext_myExtension_config', JSON.stringify({
  enabled: true,
  theme: 'dark'
}));

// Read and parse
const config = JSON.parse(
  localStorage.getItem('ext_myExtension_config') || '{}'
);
```

### 2. SessionStorage

Temporary storage that clears when the tab closes.

**Features:**
- Same API as localStorage
- Isolated per tab/window
- Cleared on tab close

**How to Use:**
1. Same interface as localStorage
2. Open in new tab to verify isolation
3. Close tab and reopen to verify clearing

**Extension Testing:**
```javascript
// Good for temporary state
sessionStorage.setItem('ext_tempData', JSON.stringify({
  lastAction: Date.now(),
  pendingChanges: []
}));
```

### 3. Cookies

HTTP cookies for cross-request data persistence.

**Features:**
- Create cookies with various attributes
- Read existing cookies
- Delete cookies
- Set expiration, path, domain, secure, sameSite

**Cookie Attributes:**

| Attribute | Description |
|-----------|-------------|
| `name=value` | Cookie data |
| `expires` | Expiration date |
| `max-age` | Lifetime in seconds |
| `path` | URL path scope |
| `domain` | Domain scope |
| `secure` | HTTPS only |
| `sameSite` | Cross-site policy |
| `httpOnly` | JavaScript inaccessible (server-set only) |

**How to Use:**
1. Enter cookie name and value
2. Set optional attributes (expires, path, etc.)
3. Click "Set Cookie"
4. View all cookies in the list
5. Click "Delete" to remove specific cookies

**Extension Testing:**
```javascript
// Set a cookie
document.cookie = 'ext_session=abc123; max-age=3600; path=/';

// Read all cookies
const cookies = document.cookie.split(';').reduce((acc, cookie) => {
  const [key, value] = cookie.trim().split('=');
  acc[key] = value;
  return acc;
}, {});

// Delete a cookie
document.cookie = 'ext_session=; max-age=0; path=/';
```

**Note:** Extensions can use the `chrome.cookies` API for more control.

### 4. IndexedDB

Full database storage for large, structured data.

**Features:**
- Create object stores (tables)
- Add, read, update, delete records
- Query by key or index
- Transaction support

**How to Use:**
1. Click "Open Database" to initialize
2. Enter record data (key and JSON value)
3. Click "Add Record" to store
4. Click "Get Record" to retrieve by key
5. View all records in the output

**Extension Testing:**
```javascript
// Open database
const request = indexedDB.open('ExtensionDB', 1);

request.onupgradeneeded = (e) => {
  const db = e.target.result;
  db.createObjectStore('cache', { keyPath: 'url' });
};

request.onsuccess = (e) => {
  const db = e.target.result;
  
  // Add data
  const tx = db.transaction('cache', 'readwrite');
  tx.objectStore('cache').add({
    url: 'https://example.com',
    data: { /* cached response */ },
    timestamp: Date.now()
  });
};
```

## Storage Comparison

| Feature | localStorage | sessionStorage | Cookies | IndexedDB |
|---------|-------------|----------------|---------|-----------|
| Capacity | 5-10 MB | 5-10 MB | 4 KB | Unlimited* |
| Persistence | Permanent | Tab session | Configurable | Permanent |
| API | Sync | Sync | Sync | Async |
| Data Type | String | String | String | Any |
| Accessible | Same origin | Same origin | Configurable | Same origin |
| Server Access | No | No | Yes | No |

\* Browser may prompt user for large storage

## Extension-Specific Patterns

### Pattern 1: Storage Wrapper
```javascript
const Storage = {
  prefix: 'ext_myExt_',
  
  get(key, defaultValue = null) {
    const value = localStorage.getItem(this.prefix + key);
    if (value === null) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  
  set(key, value) {
    localStorage.setItem(
      this.prefix + key,
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  },
  
  remove(key) {
    localStorage.removeItem(this.prefix + key);
  },
  
  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
};
```

### Pattern 2: Storage Event Listener
```javascript
// Listen for storage changes (from other tabs)
window.addEventListener('storage', (e) => {
  if (e.key?.startsWith('ext_myExt_')) {
    console.log('Storage changed:', {
      key: e.key,
      oldValue: e.oldValue,
      newValue: e.newValue,
      url: e.url
    });
  }
});
```

### Pattern 3: IndexedDB Promise Wrapper
```javascript
function openDB(name, version, upgradeCallback) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => upgradeCallback(e.target.result);
  });
}

async function dbOperation(db, storeName, mode, operation) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = operation(store);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
```

### Pattern 4: Cookie Manager
```javascript
const CookieManager = {
  get(name) {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? decodeURIComponent(match[2]) : null;
  },
  
  set(name, value, options = {}) {
    let cookie = `${name}=${encodeURIComponent(value)}`;
    
    if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
    if (options.expires) cookie += `; expires=${options.expires.toUTCString()}`;
    if (options.path) cookie += `; path=${options.path}`;
    if (options.domain) cookie += `; domain=${options.domain}`;
    if (options.secure) cookie += '; secure';
    if (options.sameSite) cookie += `; samesite=${options.sameSite}`;
    
    document.cookie = cookie;
  },
  
  delete(name, path = '/') {
    document.cookie = `${name}=; max-age=0; path=${path}`;
  }
};
```

## Security Considerations

1. **Sensitive Data**: Never store passwords or tokens in localStorage (use secure cookies or extension storage)
2. **XSS Attacks**: localStorage is vulnerable to XSS - sanitize all data
3. **Cookie Flags**: Use `secure` and `httpOnly` for sensitive cookies
4. **Data Validation**: Always validate data read from storage

## Tips

1. **Quota Management**: Check available space before large writes
2. **Error Handling**: Storage operations can fail (quota exceeded, private browsing)
3. **Serialization**: Use JSON.stringify/parse consistently
4. **Namespacing**: Prefix keys to avoid conflicts with other extensions/sites
5. **Migration**: Plan for schema changes in IndexedDB

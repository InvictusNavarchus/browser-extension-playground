# Network Testing Guide

The Network page provides comprehensive testing for network-related extension features including request interception, WebSocket handling, and API communication.

## Overview

**Route**: `/network`

Test your extension's ability to intercept, modify, and monitor network requests across different protocols and methods.

## Test Sections

### 1. Fetch API

Modern promise-based HTTP requests.

**Features:**
- Custom URL input
- HTTP method selection (GET, POST, PUT, DELETE, PATCH)
- Custom headers editor
- Request body input (for POST/PUT/PATCH)
- Response display (status, headers, body)

**How to Use:**
1. Enter a URL (e.g., `https://jsonplaceholder.typicode.com/posts`)
2. Select HTTP method
3. Add custom headers if needed
4. Enter request body for POST/PUT/PATCH
5. Click "Send Request"
6. View response in the output area

**Test URLs:**
- `https://jsonplaceholder.typicode.com/posts` - GET posts
- `https://jsonplaceholder.typicode.com/posts` - POST new post
- `https://httpbin.org/get` - Echo GET request
- `https://httpbin.org/post` - Echo POST request
- `https://httpbin.org/headers` - View request headers

**Extension Testing:**
```javascript
// Intercept fetch requests
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log('Fetch intercepted:', args);
  const response = await originalFetch(...args);
  console.log('Response:', response.status);
  return response;
};
```

### 2. XMLHttpRequest (XHR)

Legacy but still widely used HTTP request API.

**Features:**
- Same options as Fetch
- Progress tracking
- Upload/download progress events
- Synchronous option (not recommended)

**How to Use:**
1. Configure request same as Fetch
2. Click "Send XHR"
3. Observe progress indicators
4. View response

**Extension Testing:**
```javascript
// Intercept XHR
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...rest) {
  console.log('XHR intercepted:', method, url);
  this._url = url;
  return originalOpen.call(this, method, url, ...rest);
};

const originalSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(body) {
  console.log('XHR send:', this._url, body);
  return originalSend.call(this, body);
};
```

### 3. WebSocket

Real-time bidirectional communication.

**Features:**
- Connect to WebSocket servers
- Send text/JSON messages
- Receive and display messages
- Connection status indicator
- Manual disconnect

**How to Use:**
1. Enter WebSocket URL (e.g., `wss://echo.websocket.org`)
2. Click "Connect"
3. Type messages and click "Send"
4. View incoming messages in the log
5. Click "Disconnect" when done

**Test WebSocket Servers:**
- `wss://echo.websocket.org` - Echoes messages back
- `wss://socketsbay.com/wss/v2/1/demo/` - Public test server

**Extension Testing:**
```javascript
// Intercept WebSocket
const OriginalWebSocket = window.WebSocket;
window.WebSocket = function(url, protocols) {
  console.log('WebSocket intercepted:', url);
  const ws = new OriginalWebSocket(url, protocols);
  
  ws.addEventListener('message', (e) => {
    console.log('WS message:', e.data);
  });
  
  return ws;
};
```

### 4. Server-Sent Events (SSE)

Server-push event stream.

**Features:**
- Connect to SSE endpoints
- Display incoming events
- Automatic reconnection handling
- Event type filtering

**How to Use:**
1. Enter SSE endpoint URL
2. Click "Connect"
3. View incoming events
4. Click "Disconnect" to close

**Extension Testing:**
```javascript
// Intercept EventSource
const OriginalEventSource = window.EventSource;
window.EventSource = function(url, config) {
  console.log('EventSource intercepted:', url);
  return new OriginalEventSource(url, config);
};
```

### 5. Request Headers

Test and view common HTTP headers.

**Headers Tested:**

| Header | Description |
|--------|-------------|
| `Content-Type` | Request/response body format |
| `Authorization` | Auth credentials |
| `Accept` | Expected response type |
| `User-Agent` | Client identification |
| `Origin` | Request origin |
| `Referer` | Source page URL |
| `X-Custom-*` | Custom headers |

**Extension Testing:**
```javascript
// Modify request headers (content script)
// Note: Some headers can only be modified via webRequest API

// For extensions using webRequest:
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    details.requestHeaders.push({
      name: 'X-Extension-Id',
      value: chrome.runtime.id
    });
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders']
);
```

## Network Event Timeline

The page displays network events with timing information:

| Event | Description |
|-------|-------------|
| Request Start | When request is initiated |
| DNS Lookup | Domain resolution time |
| TCP Connect | Connection establishment |
| TLS Handshake | Secure connection setup |
| Request Sent | Request transmitted |
| Waiting (TTFB) | Time to first byte |
| Content Download | Response body received |
| Request Complete | Full response available |

## CORS Testing

Test Cross-Origin Resource Sharing behavior.

**Scenarios:**
1. Same-origin requests (always work)
2. Cross-origin with CORS headers (work if allowed)
3. Cross-origin without CORS (blocked in browser)
4. Preflight requests (OPTIONS for complex requests)

**Extension Note:** Extensions can bypass CORS using:
- Background script fetch (not subject to CORS)
- `webRequest` API to modify headers
- Manifest `host_permissions`

## Common Extension Patterns

### Pattern 1: Request Logger
```javascript
const requestLog = [];

// Log all fetch requests
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.url;
  const method = init?.method || 'GET';
  
  const entry = {
    url,
    method,
    timestamp: Date.now(),
    status: null,
    duration: null
  };
  
  requestLog.push(entry);
  
  try {
    const response = await originalFetch(input, init);
    entry.status = response.status;
    entry.duration = Date.now() - entry.timestamp;
    return response;
  } catch (error) {
    entry.error = error.message;
    entry.duration = Date.now() - entry.timestamp;
    throw error;
  }
};
```

### Pattern 2: Response Modifier
```javascript
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  
  // Clone to read body without consuming
  const clone = response.clone();
  const body = await clone.json();
  
  // Modify response data
  body.modified = true;
  body.timestamp = Date.now();
  
  // Create new response with modified body
  return new Response(JSON.stringify(body), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
};
```

### Pattern 3: WebSocket Message Handler
```javascript
class WebSocketInterceptor {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.handlers = new Map();
    
    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const handler = this.handlers.get(data.type);
      if (handler) handler(data);
    };
  }
  
  on(type, callback) {
    this.handlers.set(type, callback);
  }
  
  send(type, payload) {
    this.ws.send(JSON.stringify({ type, payload }));
  }
}
```

### Pattern 4: Request Blocker
```javascript
const blockedDomains = ['ads.example.com', 'tracker.example.com'];

const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' ? input : input.url);
  
  if (blockedDomains.includes(url.hostname)) {
    console.log('Blocked request to:', url.hostname);
    return new Response('', { status: 204 });
  }
  
  return originalFetch(input, init);
};
```

## Tips

1. **DevTools Network Tab**: Use alongside this page for detailed inspection
2. **Throttling**: Test with slow connections using DevTools
3. **Offline Mode**: Test offline behavior
4. **Error Handling**: Test network failure scenarios
5. **Caching**: Be aware of browser and service worker caching

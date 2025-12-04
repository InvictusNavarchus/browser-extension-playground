# Documentation Index

Welcome to the Browser Extension Playground documentation. This guide will help you understand and use each testing page effectively.

## Quick Links

| Page | Documentation | Description |
|------|---------------|-------------|
| Home | [home.md](home.md) | Dashboard and browser info |
| DOM | [dom.md](dom.md) | DOM manipulation testing |
| Forms | [forms.md](forms.md) | Form interaction and autofill |
| Storage | [storage.md](storage.md) | Browser storage APIs |
| Network | [network.md](network.md) | Network request testing |
| Events | [events.md](events.md) | Events and messaging |
| Media | [media.md](media.md) | Media element testing |
| Notifications | [notifications.md](notifications.md) | Notification APIs |
| Auth | [auth.md](auth.md) | Authentication flows |
| Accessibility | [accessibility.md](accessibility.md) | A11y feature testing |

## Getting Started

### 1. Run the Development Server

```bash
cd browser-extension-playground
bun install
bun run dev
```

### 2. Load Your Extension

1. Open Chrome/Firefox extension developer mode
2. Load your unpacked extension
3. Navigate to `http://localhost:5173`
4. Your extension should inject into the page

### 3. Start Testing

Each page is designed to test specific extension capabilities:

- **Content Scripts** → Use [DOM](dom.md) and [Forms](forms.md) pages
- **Storage** → Use [Storage](storage.md) page
- **Network Interception** → Use [Network](network.md) page
- **Messaging** → Use [Events](events.md) page
- **Notifications** → Use [Notifications](notifications.md) page
- **Credentials** → Use [Auth](auth.md) page

## Documentation Structure

Each page documentation includes:

1. **Overview** - Page purpose and route
2. **Test Sections** - Detailed feature descriptions
3. **How to Use** - Step-by-step instructions
4. **Extension Testing** - Code examples for extensions
5. **Common Patterns** - Reusable extension code
6. **Tips** - Best practices and gotchas

## Extension Development Workflow

### Testing Cycle

```
1. Identify feature to test
2. Navigate to relevant playground page
3. Open DevTools console
4. Interact with test elements
5. Verify extension behavior
6. Check console for errors
7. Iterate on extension code
```

### Debugging Tips

1. **Console Tab**: Watch for extension logs and errors
2. **Network Tab**: Monitor extension network activity
3. **Elements Tab**: Inspect DOM modifications
4. **Sources Tab**: Debug extension scripts
5. **Application Tab**: Check storage and service workers

## API Coverage

### Browser APIs Tested

| Category | APIs |
|----------|------|
| DOM | querySelector, MutationObserver, Shadow DOM |
| Storage | localStorage, sessionStorage, cookies, IndexedDB |
| Network | fetch, XMLHttpRequest, WebSocket, EventSource |
| Events | CustomEvent, postMessage, BroadcastChannel |
| Media | HTMLMediaElement, Canvas, MediaDevices |
| Notifications | Notification, Push API, Vibration |
| Auth | Credentials API, WebAuthn |
| A11y | ARIA, Focus management, Live regions |

### Extension APIs (for reference)

While this playground tests web APIs, extensions typically use:

- `chrome.storage` / `browser.storage`
- `chrome.runtime` / `browser.runtime`
- `chrome.tabs` / `browser.tabs`
- `chrome.webRequest` / `browser.webRequest`
- `chrome.notifications` / `browser.notifications`

## Contributing

Found an issue or want to add a test case?

1. Check existing documentation
2. Open an issue describing the enhancement
3. Submit a PR with your changes

## Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Updates**: Watch the repository for updates

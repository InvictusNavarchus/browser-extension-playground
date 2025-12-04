# Browser Extension Playground 🎮

A comprehensive testing environment for browser extension developers built with SvelteKit and Svelte 5. Test your extensions against real-world scenarios including DOM manipulation, form handling, storage APIs, network requests, and more.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

The development server runs at `http://localhost:5173` by default.

## 📋 Features Overview

| Page | Description | Key Testing Areas |
|------|-------------|-------------------|
| [Home](docs/home.md) | Dashboard with browser info | Extension detection, browser APIs |
| [DOM](docs/dom.md) | DOM manipulation testing | Content scripts, MutationObserver |
| [Forms](docs/forms.md) | Form interaction testing | Autofill, validation, input handling |
| [Storage](docs/storage.md) | Browser storage APIs | localStorage, cookies, IndexedDB |
| [Network](docs/network.md) | Network request testing | Request interception, WebSocket |
| [Events](docs/events.md) | Event system testing | Custom events, messaging |
| [Media](docs/media.md) | Media element testing | Video/audio control, canvas |
| [Notifications](docs/notifications.md) | Notification APIs | Push notifications, alerts |
| [Auth](docs/auth.md) | Authentication flows | OAuth, credentials, WebAuthn |
| [Accessibility](docs/accessibility.md) | A11y feature testing | ARIA, focus management |

## 🛠️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: TypeScript
- **Package Manager**: [Bun](https://bun.sh/)

## 🎯 Use Cases

### For Extension Developers

- **Content Scripts**: Test DOM injection, element selection, and page modification
- **Background Scripts**: Test messaging between contexts using postMessage and custom events
- **Storage**: Verify your extension properly reads/writes to various storage APIs
- **Network**: Test request interception and modification with real API calls
- **Permissions**: Test behavior when various browser APIs are available or blocked

### For QA Testing

- **Regression Testing**: Consistent environment for testing extension updates
- **Cross-Browser Testing**: Same test cases across different browsers
- **Edge Cases**: Pre-built scenarios for common edge cases

## 📁 Project Structure

```
browser-extension-playground/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable Svelte components
│   │   └── index.ts        # Component exports
│   └── routes/
│       ├── +layout.svelte  # Root layout with navigation
│       ├── +page.svelte    # Home page
│       ├── dom/            # DOM manipulation tests
│       ├── forms/          # Form testing
│       ├── storage/        # Storage API tests
│       ├── network/        # Network request tests
│       ├── events/         # Event handling tests
│       ├── media/          # Media element tests
│       ├── notifications/  # Notification API tests
│       ├── auth/           # Authentication flow tests
│       └── accessibility/  # Accessibility tests
├── docs/                   # Detailed documentation
├── static/                 # Static assets
└── package.json
```

## 🔧 Components

The playground includes reusable components:

- **Navigation**: Sidebar navigation with active state tracking
- **PageHeader**: Consistent page headers with title and description
- **TestSection**: Card-style containers for test groups
- **ConsoleOutput**: Real-time log display for test results
- **FormField**: Accessible form inputs with labels

## 📖 Documentation

Detailed documentation for each test page is available in the [docs/](docs/) folder:

- [Home Page Guide](docs/home.md)
- [DOM Manipulation Guide](docs/dom.md)
- [Forms Testing Guide](docs/forms.md)
- [Storage APIs Guide](docs/storage.md)
- [Network Testing Guide](docs/network.md)
- [Events & Messaging Guide](docs/events.md)
- [Media Testing Guide](docs/media.md)
- [Notifications Guide](docs/notifications.md)
- [Authentication Guide](docs/auth.md)
- [Accessibility Guide](docs/accessibility.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-test`
3. Commit changes: `git commit -m 'feat: add new test scenario'`
4. Push to branch: `git push origin feature/new-test`
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this playground for your extension development and testing needs.

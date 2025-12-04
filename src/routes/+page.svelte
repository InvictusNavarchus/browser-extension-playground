<script lang="ts">
	const features = [
		{
			icon: '🔧',
			title: 'DOM Manipulation',
			description: 'Test content scripts, element injection, mutation observers, and shadow DOM interactions.',
			href: '/dom',
			color: 'bg-blue-500'
		},
		{
			icon: '📝',
			title: 'Forms & Inputs',
			description: 'Validate form filling, auto-complete, password management, and input handling.',
			href: '/forms',
			color: 'bg-green-500'
		},
		{
			icon: '💾',
			title: 'Storage APIs',
			description: 'Test localStorage, sessionStorage, IndexedDB, and cookies manipulation.',
			href: '/storage',
			color: 'bg-purple-500'
		},
		{
			icon: '🌐',
			title: 'Network & XHR',
			description: 'Intercept fetch requests, XHR calls, WebSocket connections, and API responses.',
			href: '/network',
			color: 'bg-orange-500'
		},
		{
			icon: '🎬',
			title: 'Media & Files',
			description: 'Test video/audio controls, file downloads, clipboard access, and media capture.',
			href: '/media',
			color: 'bg-pink-500'
		},
		{
			icon: '⚡',
			title: 'Events & Listeners',
			description: 'Test keyboard shortcuts, mouse events, custom events, and event delegation.',
			href: '/events',
			color: 'bg-yellow-500'
		},
		{
			icon: '🪟',
			title: 'Popups & Modals',
			description: 'Test popup detection, modal handling, alert/confirm dialogs, and notifications.',
			href: '/popups',
			color: 'bg-indigo-500'
		},
		{
			icon: '🖼️',
			title: 'Iframes & Frames',
			description: 'Test cross-origin frames, iframe injection, and frame communication.',
			href: '/iframes',
			color: 'bg-teal-500'
		},
		{
			icon: '🔒',
			title: 'Security & CSP',
			description: 'Test Content Security Policy, CORS, and security-related features.',
			href: '/security',
			color: 'bg-red-500'
		},
		{
			icon: '⚡',
			title: 'Performance',
			description: 'Test performance APIs, timing measurements, and resource loading.',
			href: '/performance',
			color: 'bg-cyan-500'
		},
		{
			icon: '♿',
			title: 'Accessibility',
			description: 'Test ARIA attributes, focus management, screen reader compatibility.',
			href: '/accessibility',
			color: 'bg-emerald-500'
		}
	];

	let browserInfo = $state({
		userAgent: '',
		platform: '',
		language: '',
		cookiesEnabled: false,
		onLine: false,
		windowSize: 'Measuring...'
	});

	$effect(() => {
		if (typeof window !== 'undefined') {
			browserInfo = {
				userAgent: navigator.userAgent,
				platform: navigator.platform,
				language: navigator.language,
				cookiesEnabled: navigator.cookieEnabled,
				onLine: navigator.onLine,
				windowSize: `${window.innerWidth} × ${window.innerHeight}`
			};
			
			const handleResize = () => {
				browserInfo.windowSize = `${window.innerWidth} × ${window.innerHeight}`;
			};
			
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}
	});
</script>

<!-- Hero Section -->
<div class="text-center mb-12">
	<div class="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
		<span>🧪</span>
		<span>Browser Extension Testing Playground</span>
	</div>
	
	<h1 class="text-4xl sm:text-5xl font-bold text-surface-900 mb-4">
		Extension Lab
	</h1>
	
	<p class="text-xl text-surface-600 max-w-2xl mx-auto mb-8">
		A comprehensive battleground for browser extension developers. Test your extension's capabilities across DOM manipulation, storage, network requests, and more.
	</p>
	
	<div class="flex flex-wrap justify-center gap-3">
		<a href="/dom" class="btn-primary">
			Get Started
			<span>→</span>
		</a>
		<a href="#features" class="btn-secondary">
			Explore Features
		</a>
	</div>
</div>

<!-- Browser Info Card -->
<div class="card p-6 mb-12">
	<h2 class="section-subtitle flex items-center gap-2">
		<span>🔍</span>
		Current Browser Information
	</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<div class="bg-surface-50 rounded-lg p-4">
			<p class="text-sm text-surface-500 mb-1">User Agent</p>
			<p class="text-sm font-mono text-surface-700 break-all">{browserInfo.userAgent || 'Loading...'}</p>
		</div>
		<div class="bg-surface-50 rounded-lg p-4">
			<p class="text-sm text-surface-500 mb-1">Platform</p>
			<p class="text-sm font-mono text-surface-700">{browserInfo.platform || 'Loading...'}</p>
		</div>
		<div class="bg-surface-50 rounded-lg p-4">
			<p class="text-sm text-surface-500 mb-1">Language</p>
			<p class="text-sm font-mono text-surface-700">{browserInfo.language || 'Loading...'}</p>
		</div>
		<div class="bg-surface-50 rounded-lg p-4">
			<p class="text-sm text-surface-500 mb-1">Cookies Enabled</p>
			<span class={browserInfo.cookiesEnabled ? 'badge-success' : 'badge-danger'}>
				{browserInfo.cookiesEnabled ? 'Yes' : 'No'}
			</span>
		</div>
		<div class="bg-surface-50 rounded-lg p-4">
			<p class="text-sm text-surface-500 mb-1">Online Status</p>
			<span class={browserInfo.onLine ? 'badge-success' : 'badge-danger'}>
				{browserInfo.onLine ? 'Online' : 'Offline'}
			</span>
		</div>
		<div class="bg-surface-50 rounded-lg p-4">
			<p class="text-sm text-surface-500 mb-1">Window Size</p>
			<p class="text-sm font-mono text-surface-700">{browserInfo.windowSize}</p>
		</div>
	</div>
</div>

<!-- Features Grid -->
<section id="features" class="scroll-mt-20">
	<h2 class="section-title text-center mb-8">
		Testing Modules
	</h2>
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each features as feature}
			<a 
				href={feature.href}
				class="card p-6 hover:shadow-lg transition-all duration-200 group hover:-translate-y-1"
			>
				<div class="flex items-start gap-4">
					<div class="{feature.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0">
						{feature.icon}
					</div>
					<div>
						<h3 class="font-semibold text-surface-900 mb-1 group-hover:text-primary-600 transition-colors">
							{feature.title}
						</h3>
						<p class="text-sm text-surface-600">
							{feature.description}
						</p>
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>

<!-- Quick Test Section -->
<section class="mt-12">
	<div class="card p-6">
		<h2 class="section-subtitle flex items-center gap-2 mb-4">
			<span>🚀</span>
			Quick Extension Test
		</h2>
		<p class="text-surface-600 mb-4">
			Use these elements to quickly verify your extension is working:
		</p>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Test Elements -->
			<div class="space-y-4">
				<div>
					<label class="label" for="quick-test-input">Test Input Field</label>
					<input 
						type="text" 
						class="input" 
						placeholder="Type something here..."
						id="quick-test-input"
						data-testid="quick-input"
						autocomplete="off"
					/>
				</div>
				
				<div>
					<label class="label" for="quick-test-password">Test Password Field</label>
					<input 
						type="password" 
						class="input" 
						placeholder="Password field for testing"
						id="quick-test-password"
						data-testid="quick-password"
						autocomplete="new-password"
					/>
				</div>
				
				<div class="flex flex-wrap gap-2">
					<button class="btn-primary" id="test-button" data-testid="test-btn">
						Click Me
					</button>
					<button class="btn-secondary" id="test-button-2">
						Secondary Action
					</button>
					<button class="btn-danger" id="test-button-danger">
						Danger Button
					</button>
				</div>
			</div>
			
			<!-- Test Content -->
			<div class="space-y-4">
				<div class="bg-surface-50 rounded-lg p-4" id="test-content-area" data-content="test">
					<p class="text-sm text-surface-600 mb-2">Content area for injection testing:</p>
					<div id="injection-target" class="min-h-[60px] border-2 border-dashed border-surface-300 rounded-lg p-4 text-center text-surface-400">
						Injection target area
					</div>
				</div>
				
				<div class="flex flex-wrap gap-2">
					<span class="badge-primary">Test Badge</span>
					<span class="badge-success">Success</span>
					<span class="badge-warning">Warning</span>
					<span class="badge-danger">Error</span>
				</div>
				
				<div class="text-sm text-surface-500">
					<p>Element ID: <code class="bg-surface-200 px-1 rounded">quick-test-input</code></p>
					<p>Data attribute: <code class="bg-surface-200 px-1 rounded">data-testid="quick-input"</code></p>
				</div>
			</div>
		</div>
	</div>
</section>

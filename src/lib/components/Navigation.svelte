<script lang="ts">
	import { page } from '$app/state';
	import { ThemeToggle } from '$lib';

	const navItems = [
		{ href: '/', label: 'Home', icon: '🏠' },
		{ href: '/dom', label: 'DOM Manipulation', icon: '🔧' },
		{ href: '/forms', label: 'Forms & Inputs', icon: '📝' },
		{ href: '/storage', label: 'Storage APIs', icon: '💾' },
		{ href: '/network', label: 'Network & XHR', icon: '🌐' },
		{ href: '/media', label: 'Media & Files', icon: '🎬' },
		{ href: '/events', label: 'Events & Listeners', icon: '⚡' },
		{ href: '/popups', label: 'Popups & Modals', icon: '🪟' },
		{ href: '/iframes', label: 'Iframes & Frames', icon: '🖼️' },
		{ href: '/security', label: 'Security & CSP', icon: '🔒' },
		{ href: '/performance', label: 'Performance', icon: '⚡' },
		{ href: '/accessibility', label: 'Accessibility', icon: '♿' },
	];

	let mobileMenuOpen = $state(false);
</script>

<nav class="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 sticky top-0 z-50 transition-colors duration-300">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center">
				<a href="/" class="flex items-center gap-3">
					<span class="text-2xl">🧪</span>
					<span class="font-bold text-xl text-surface-900 dark:text-surface-50">Extension Lab</span>
				</a>
			</div>
			
		<!-- Desktop Navigation -->
		<div class="hidden lg:flex items-center gap-1">
			{#each navItems.slice(0, 6) as item, i (i)}
				<a 
					href={item.href}
					class="px-3 py-2 rounded-lg text-sm font-medium transition-colors {page.url.pathname === item.href ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'}"
				>
					<span class="mr-1">{item.icon}</span>
					{item.label}
				</a>
			{/each}				<!-- More dropdown -->
				<div class="relative group">
					<button class="px-3 py-2 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 transition-colors">
						More ▼
					</button>
					<div class="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-lg shadow-lg border border-surface-200 dark:border-surface-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
						{#each navItems.slice(6) as item, i (i)}
							<a 
								href={item.href}
								class="block px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 first:rounded-t-lg last:rounded-b-lg {page.url.pathname === item.href ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : ''}"
							>
								<span class="mr-2">{item.icon}</span>
								{item.label}
							</a>
						{/each}
					</div>
				</div>

				<div class="border-l border-surface-200 dark:border-surface-800 mx-1 h-6"></div>
				<ThemeToggle />
			</div>

			<!-- Mobile menu button -->
			<div class="lg:hidden flex items-center gap-2">
				<ThemeToggle />
				<button 
					onclick={() => mobileMenuOpen = !mobileMenuOpen}
					class="p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if mobileMenuOpen}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<div class="lg:hidden border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
			<div class="px-4 py-2 space-y-1">
				{#each navItems as item, i (i)}
					<a 
						href={item.href}
						onclick={() => mobileMenuOpen = false}
						class="block px-3 py-2 rounded-lg text-sm font-medium {page.url.pathname === item.href ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'}"
					>
						<span class="mr-2">{item.icon}</span>
						{item.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>

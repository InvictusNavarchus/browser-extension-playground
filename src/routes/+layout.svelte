<script lang="ts">
	import './layout.css';
	import { Navigation } from '$lib';
	
	let { children } = $props();
</script>

<svelte:head>
	<title>Extension Lab - Browser Extension Testing Playground</title>
	<meta name="description" content="A comprehensive testing playground for browser extension developers to test DOM manipulation, storage APIs, network requests, and more." />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Navigation />
	
	<main class="flex-1 py-8">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			{@render children()}
		</div>
	</main>
	
	<footer class="bg-white border-t border-surface-200 py-6">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<p class="text-surface-500 text-sm">
					🧪 Extension Lab - Built for browser extension developers
				</p>
				<div class="flex items-center gap-4 text-sm text-surface-500">
					<span>Test your extensions here!</span>
					<a 
						href="https://github.com" 
						target="_blank" 
						rel="noopener noreferrer"
						class="hover:text-surface-700 transition-colors"
					>
						GitHub
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>

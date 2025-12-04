<script lang="ts">
	import { PageHeader } from '$lib';

	let logs = $state<string[]>([]);
	let injectedCount = $state(0);
	let mutationCount = $state(0);
	let elementText = $state('Original Text');
	let dynamicContent = $state('');
	let shadowDomContent = $state('Shadow DOM is not created yet');
	
	function log(message: string) {
		logs = [...logs, `[${new Date().toLocaleTimeString()}] ${message}`];
	}
	
	function clearLogs() {
		logs = [];
	}

	// Inject element
	function injectElement() {
		const target = document.getElementById('injection-zone');
		if (target) {
			const el = document.createElement('div');
			el.className = 'bg-green-100 border border-green-300 rounded-lg p-3 text-green-800 text-sm';
			el.textContent = `Injected element #${++injectedCount}`;
			el.setAttribute('data-injected', 'true');
			target.appendChild(el);
			log(`Injected element #${injectedCount}`);
		}
	}

	// Remove all injected elements
	function clearInjected() {
		const elements = document.querySelectorAll('[data-injected="true"]');
		elements.forEach(el => el.remove());
		injectedCount = 0;
		log('Cleared all injected elements');
	}

	// Modify existing element
	function modifyElement() {
		const texts = ['Modified Text!', 'Changed Again!', 'Another Modification!', 'Original Text'];
		const currentIndex = texts.indexOf(elementText);
		elementText = texts[(currentIndex + 1) % texts.length];
		log(`Element text changed to: ${elementText}`);
	}

	// Setup mutation observer
	let observer: MutationObserver | null = null;
	
	function startObserver() {
		const target = document.getElementById('observed-zone');
		if (target && !observer) {
			observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutationCount++;
					log(`Mutation detected: ${mutation.type} - ${mutation.target.nodeName}`);
				});
			});
			observer.observe(target, {
				childList: true,
				attributes: true,
				characterData: true,
				subtree: true
			});
			log('MutationObserver started');
		}
	}

	function stopObserver() {
		if (observer) {
			observer.disconnect();
			observer = null;
			log('MutationObserver stopped');
		}
	}

	// Shadow DOM
	let shadowHost: HTMLElement | null = null;
	let shadowRoot: ShadowRoot | null = null;

	function createShadowDOM() {
		shadowHost = document.getElementById('shadow-host');
		if (shadowHost && !shadowRoot) {
			shadowRoot = shadowHost.attachShadow({ mode: 'open' });
			shadowRoot.innerHTML = `
				<style>
					.shadow-content {
						background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
						color: white;
						padding: 1rem;
						border-radius: 0.5rem;
						font-family: system-ui;
					}
					.shadow-content p {
						margin: 0;
					}
				</style>
				<div class="shadow-content">
					<p>🌙 This content is inside Shadow DOM!</p>
					<p style="font-size: 0.875rem; opacity: 0.8; margin-top: 0.5rem;">
						Extensions need special handling to access this.
					</p>
				</div>
			`;
			shadowDomContent = 'Shadow DOM created with mode: open';
			log('Shadow DOM created');
		}
	}

	// Dynamic content loading
	function loadDynamicContent() {
		dynamicContent = '';
		log('Loading dynamic content...');
		setTimeout(() => {
			dynamicContent = 'This content was loaded dynamically after 1 second!';
			log('Dynamic content loaded');
		}, 1000);
	}

	// Clone element
	function cloneElement() {
		const source = document.getElementById('clone-source');
		const target = document.getElementById('clone-target');
		if (source && target) {
			const clone = source.cloneNode(true) as HTMLElement;
			clone.id = `clone-${Date.now()}`;
			clone.classList.add('opacity-70');
			target.appendChild(clone);
			log('Element cloned');
		}
	}
</script>

<PageHeader 
	title="DOM Manipulation" 
	description="Test content script interactions, element injection, mutation observers, and shadow DOM access."
>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Element Injection -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>💉</span>
				Element Injection
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test injecting and removing elements from the DOM.
			</p>
			
			<div 
				id="injection-zone" 
				class="min-h-32 border-2 border-dashed border-surface-300 rounded-lg p-4 mb-4 space-y-2"
				data-testid="injection-zone"
			>
				<p class="text-surface-400 text-sm">Injection target zone</p>
			</div>
			
			<div class="flex gap-2">
				<button class="btn-primary" onclick={injectElement}>
					Inject Element
				</button>
				<button class="btn-danger" onclick={clearInjected}>
					Clear All
				</button>
			</div>
		</div>

		<!-- Element Modification -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>✏️</span>
				Element Modification
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test modifying existing DOM elements.
			</p>
			
			<div 
				id="modifiable-element"
				class="bg-surface-100 rounded-lg p-4 mb-4 text-center"
				data-testid="modifiable"
			>
				<span class="text-lg font-medium">{elementText}</span>
			</div>
			
			<button class="btn-primary" onclick={modifyElement}>
				Modify Text
			</button>
		</div>

		<!-- Mutation Observer -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>👁️</span>
				Mutation Observer
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test MutationObserver for DOM changes. Mutations detected: <span class="badge-primary">{mutationCount}</span>
			</p>
			
			<div 
				id="observed-zone"
				class="bg-surface-100 rounded-lg p-4 mb-4"
				data-testid="observed-zone"
				contenteditable="true"
			>
				<p>Edit this content to trigger mutations...</p>
			</div>
			
			<div class="flex gap-2">
				<button class="btn-success" onclick={startObserver}>
					Start Observer
				</button>
				<button class="btn-danger" onclick={stopObserver}>
					Stop Observer
				</button>
			</div>
		</div>

		<!-- Shadow DOM -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>🌙</span>
				Shadow DOM
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test Shadow DOM creation and access.
			</p>
			
			<div 
				id="shadow-host"
				class="min-h-24 bg-surface-100 rounded-lg p-4 mb-4"
				data-testid="shadow-host"
			>
				<p class="text-surface-500 text-sm">{shadowDomContent}</p>
			</div>
			
			<button class="btn-primary" onclick={createShadowDOM}>
				Create Shadow DOM
			</button>
		</div>

		<!-- Dynamic Content -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>⏳</span>
				Dynamic Content Loading
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test handling of dynamically loaded content.
			</p>
			
			<div 
				id="dynamic-content"
				class="min-h-20 bg-surface-100 rounded-lg p-4 mb-4"
				data-testid="dynamic-content"
			>
				{#if dynamicContent}
					<p class="text-green-600">{dynamicContent}</p>
				{:else}
					<p class="text-surface-400 text-sm">Content will appear here...</p>
				{/if}
			</div>
			
			<button class="btn-primary" onclick={loadDynamicContent}>
				Load Content
			</button>
		</div>

		<!-- Element Cloning -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>📋</span>
				Element Cloning
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test cloning DOM elements.
			</p>
			
			<div 
				id="clone-source"
				class="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 text-blue-800"
			>
				<p class="font-medium">Source Element</p>
				<p class="text-sm">This element will be cloned.</p>
			</div>
			
			<div id="clone-target" class="space-y-2 mb-4">
				<!-- Clones appear here -->
			</div>
			
			<button class="btn-primary" onclick={cloneElement}>
				Clone Element
			</button>
		</div>
	</div>

	<!-- Various Test Elements -->
	<div class="card p-6 mt-6">
		<h3 class="section-subtitle flex items-center gap-2">
			<span>🧪</span>
			Various DOM Elements
		</h3>
		<p class="text-surface-600 text-sm mb-4">
			A collection of different elements for selector testing.
		</p>
		
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<div id="test-div" class="bg-red-100 p-3 rounded" data-type="div">DIV element</div>
			<span id="test-span" class="bg-blue-100 p-3 rounded inline-block" data-type="span">SPAN element</span>
			<article id="test-article" class="bg-green-100 p-3 rounded" data-type="article">ARTICLE element</article>
			<section id="test-section" class="bg-yellow-100 p-3 rounded" data-type="section">SECTION element</section>
			<p id="test-p" class="bg-purple-100 p-3 rounded" data-type="paragraph">P element</p>
			<strong id="test-strong" class="bg-pink-100 p-3 rounded block" data-type="strong">STRONG element</strong>
			<em id="test-em" class="bg-indigo-100 p-3 rounded block" data-type="em">EM element</em>
			<code id="test-code" class="bg-gray-100 p-3 rounded block" data-type="code">CODE element</code>
		</div>
		
		<div class="mt-4 space-y-2">
			<p class="text-sm text-surface-500">Nested elements for traversal testing:</p>
			<div id="nested-parent" class="bg-surface-100 p-4 rounded-lg">
				<div class="nested-child bg-surface-200 p-3 rounded mb-2">
					<span class="nested-grandchild bg-surface-300 p-2 rounded inline-block">Level 3</span>
				</div>
				<div class="nested-child bg-surface-200 p-3 rounded">
					<span class="nested-grandchild bg-surface-300 p-2 rounded inline-block">Level 3</span>
					<span class="nested-grandchild bg-surface-300 p-2 rounded inline-block ml-2">Level 3</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Console Output -->
	<div class="card p-6 mt-6">
		<div class="flex items-center justify-between mb-4">
			<h3 class="section-subtitle flex items-center gap-2 mb-0">
				<span>📟</span>
				Activity Log
			</h3>
			<button class="btn-secondary text-sm" onclick={clearLogs}>
				Clear
			</button>
		</div>
		
		<div class="bg-surface-900 rounded-lg overflow-hidden">
			<div class="p-4 font-mono text-sm text-green-400 max-h-48 overflow-y-auto">
				{#if logs.length === 0}
					<span class="text-surface-500">No activity yet...</span>
				{:else}
					{#each logs as log}
						<div class="mb-1">{log}</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</PageHeader>

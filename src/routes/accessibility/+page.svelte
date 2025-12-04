<script lang="ts">
	import { PageHeader, TestSection } from '$lib';

	let logs = $state<string[]>([]);

	function log(message: string) {
		logs = [...logs, `[${new Date().toLocaleTimeString()}] ${message}`];
	}

	function clearLogs() {
		logs = [];
	}

	// Focus Management
	let focusableElements = $state<HTMLElement[]>([]);
	let currentFocusIndex = $state(0);

	function collectFocusableElements() {
		const container = document.getElementById('focus-test-area');
		if (!container) return;

		const elements = container.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		focusableElements = Array.from(elements);
		log(`Found ${focusableElements.length} focusable elements`);
	}

	function focusNext() {
		if (focusableElements.length === 0) {
			collectFocusableElements();
		}
		currentFocusIndex = (currentFocusIndex + 1) % focusableElements.length;
		focusableElements[currentFocusIndex]?.focus();
		log(`Focused element ${currentFocusIndex + 1}/${focusableElements.length}`);
	}

	function focusPrev() {
		if (focusableElements.length === 0) {
			collectFocusableElements();
		}
		currentFocusIndex = (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length;
		focusableElements[currentFocusIndex]?.focus();
		log(`Focused element ${currentFocusIndex + 1}/${focusableElements.length}`);
	}

	// ARIA Live Regions
	let liveMessage = $state('');
	let livePoliteMessage = $state('');
	let liveAssertiveMessage = $state('');

	function announcePolite() {
		livePoliteMessage = liveMessage || `Polite announcement at ${new Date().toLocaleTimeString()}`;
		log(`Polite announcement: ${livePoliteMessage}`);
	}

	function announceAssertive() {
		liveAssertiveMessage = liveMessage || `Assertive announcement at ${new Date().toLocaleTimeString()}`;
		log(`Assertive announcement: ${liveAssertiveMessage}`);
	}

	// ARIA Expanded/Collapsed
	let accordionItems = $state([
		{ id: 1, title: 'Section 1', content: 'This is the content for section 1. It can contain any information.', expanded: false },
		{ id: 2, title: 'Section 2', content: 'This is the content for section 2. Extensions can detect expanded states.', expanded: false },
		{ id: 3, title: 'Section 3', content: 'This is the content for section 3. ARIA attributes help screen readers.', expanded: true }
	]);

	function toggleAccordion(id: number) {
		accordionItems = accordionItems.map((item) =>
			item.id === id ? { ...item, expanded: !item.expanded } : item
		);
		const item = accordionItems.find((i) => i.id === id);
		log(`Accordion ${id} ${item?.expanded ? 'expanded' : 'collapsed'}`);
	}

	// ARIA Modal Dialog
	let modalOpen = $state(false);
	let lastFocusedElement: HTMLElement | null = null;

	function openModal() {
		lastFocusedElement = document.activeElement as HTMLElement;
		modalOpen = true;
		log('Modal opened');
		// Focus first focusable element in modal
		setTimeout(() => {
			const modal = document.getElementById('accessible-modal');
			const firstFocusable = modal?.querySelector<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])');
			firstFocusable?.focus();
		}, 100);
	}

	function closeModal() {
		modalOpen = false;
		lastFocusedElement?.focus();
		log('Modal closed, focus restored');
	}

	// Skip Links
	function handleSkipLink(targetId: string) {
		const target = document.getElementById(targetId);
		if (target) {
			target.focus();
			target.scrollIntoView({ behavior: 'smooth' });
			log(`Skipped to: #${targetId}`);
		}
	}

	// High Contrast Mode
	let highContrastMode = $state(false);

	function toggleHighContrast() {
		highContrastMode = !highContrastMode;
		document.documentElement.classList.toggle('high-contrast', highContrastMode);
		log(`High contrast mode: ${highContrastMode ? 'enabled' : 'disabled'}`);
	}

	// Reduced Motion
	let reducedMotion = $state(false);

	$effect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mediaQuery.matches;
		const handler = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
			log(`Reduced motion preference: ${e.matches}`);
		};
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	});

	// Font Size
	let fontSize = $state(16);

	function adjustFontSize(delta: number) {
		fontSize = Math.max(12, Math.min(24, fontSize + delta));
		document.documentElement.style.fontSize = `${fontSize}px`;
		log(`Font size adjusted to: ${fontSize}px`);
	}

	// ARIA Roles Demo
	const ariaRoles = [
		{ role: 'alert', description: 'Important time-sensitive info' },
		{ role: 'alertdialog', description: 'Alert with interactive elements' },
		{ role: 'application', description: 'Web application region' },
		{ role: 'article', description: 'Self-contained content' },
		{ role: 'banner', description: 'Site-oriented content' },
		{ role: 'button', description: 'Clickable element' },
		{ role: 'checkbox', description: 'Two-state input' },
		{ role: 'complementary', description: 'Supporting content' },
		{ role: 'contentinfo', description: 'Footer information' },
		{ role: 'dialog', description: 'Dialog or modal window' },
		{ role: 'document', description: 'Document region' },
		{ role: 'feed', description: 'Scrollable list of articles' },
		{ role: 'figure', description: 'Self-contained figure' },
		{ role: 'form', description: 'Form landmark' },
		{ role: 'grid', description: 'Grid/table structure' },
		{ role: 'gridcell', description: 'Cell in a grid' },
		{ role: 'group', description: 'Related elements' },
		{ role: 'heading', description: 'Section heading' },
		{ role: 'img', description: 'Image content' },
		{ role: 'link', description: 'Hyperlink' },
		{ role: 'list', description: 'List container' },
		{ role: 'listitem', description: 'Item in a list' },
		{ role: 'log', description: 'Log of events' },
		{ role: 'main', description: 'Main content' },
		{ role: 'marquee', description: 'Non-essential scrolling' },
		{ role: 'menu', description: 'Menu of options' },
		{ role: 'menubar', description: 'Menu bar' },
		{ role: 'menuitem', description: 'Menu option' },
		{ role: 'navigation', description: 'Navigation links' },
		{ role: 'none', description: 'No semantic meaning' },
		{ role: 'note', description: 'Note or tip' },
		{ role: 'option', description: 'Option in a listbox' },
		{ role: 'presentation', description: 'No semantic meaning' },
		{ role: 'progressbar', description: 'Progress indicator' },
		{ role: 'radio', description: 'Radio button' },
		{ role: 'radiogroup', description: 'Group of radio buttons' },
		{ role: 'region', description: 'Landmark region' },
		{ role: 'row', description: 'Row in a table/grid' },
		{ role: 'rowgroup', description: 'Group of rows' },
		{ role: 'scrollbar', description: 'Scrollbar' },
		{ role: 'search', description: 'Search landmark' },
		{ role: 'searchbox', description: 'Search input' },
		{ role: 'separator', description: 'Divider' },
		{ role: 'slider', description: 'Slider input' },
		{ role: 'spinbutton', description: 'Spin button input' },
		{ role: 'status', description: 'Status message' },
		{ role: 'switch', description: 'On/off switch' },
		{ role: 'tab', description: 'Tab in a tablist' },
		{ role: 'table', description: 'Data table' },
		{ role: 'tablist', description: 'List of tabs' },
		{ role: 'tabpanel', description: 'Tab panel content' },
		{ role: 'term', description: 'Term in a list' },
		{ role: 'textbox', description: 'Text input' },
		{ role: 'timer', description: 'Timer' },
		{ role: 'toolbar', description: 'Toolbar' },
		{ role: 'tooltip', description: 'Tooltip' },
		{ role: 'tree', description: 'Tree view' },
		{ role: 'treegrid', description: 'Tree grid' },
		{ role: 'treeitem', description: 'Item in a tree' }
	];

	// Tab Panel Demo
	let activeTab = $state(0);
	const tabs = [
		{ id: 'tab-1', label: 'Tab 1', content: 'Content for the first tab panel. This demonstrates proper ARIA tab implementation.' },
		{ id: 'tab-2', label: 'Tab 2', content: 'Content for the second tab panel. Each tab has proper keyboard navigation.' },
		{ id: 'tab-3', label: 'Tab 3', content: 'Content for the third tab panel. Arrow keys switch between tabs.' }
	];

	function handleTabKeydown(e: KeyboardEvent, index: number) {
		if (e.key === 'ArrowRight') {
			activeTab = (index + 1) % tabs.length;
			document.getElementById(tabs[activeTab].id)?.focus();
		} else if (e.key === 'ArrowLeft') {
			activeTab = (index - 1 + tabs.length) % tabs.length;
			document.getElementById(tabs[activeTab].id)?.focus();
		}
	}

	// Screen Reader Detection (heuristic)
	let screenReaderHint = $state(false);

	$effect(() => {
		// This is a heuristic - not 100% reliable
		const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const hasHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
		if (hasReducedMotion || hasHighContrast) {
			screenReaderHint = true;
			log('Accessibility preferences detected (possible screen reader user)');
		}
	});
</script>

<PageHeader title="Accessibility" description="Test ARIA attributes, focus management, and accessibility features">
	<button class="btn btn-secondary text-sm" onclick={clearLogs}>Clear Logs</button>
</PageHeader>

<!-- Skip Links (positioned for screen readers) -->
<div class="sr-only focus-within:not-sr-only focus-within:fixed focus-within:left-4 focus-within:top-4 focus-within:z-50">
	<button class="rounded bg-primary-600 px-4 py-2 text-white" onclick={() => handleSkipLink('main-content')}>
		Skip to main content
	</button>
</div>

<div class="space-y-6" id="main-content" tabindex="-1">
	<!-- Accessibility Preferences -->
	<TestSection title="Accessibility Preferences" description="Detect and respond to user accessibility preferences">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-lg bg-surface-100 p-4 dark:bg-surface-800">
				<div class="mb-2 text-sm font-medium">Reduced Motion</div>
				<div class="flex items-center gap-2">
					<span class={reducedMotion ? 'badge-success' : 'badge-warning'}>
						{reducedMotion ? 'Preferred' : 'Not Set'}
					</span>
				</div>
			</div>
			<div class="rounded-lg bg-surface-100 p-4 dark:bg-surface-800">
				<div class="mb-2 text-sm font-medium">High Contrast</div>
				<button class="btn btn-secondary text-sm" onclick={toggleHighContrast}>
					{highContrastMode ? 'Disable' : 'Enable'}
				</button>
			</div>
			<div class="rounded-lg bg-surface-100 p-4 dark:bg-surface-800">
				<div class="mb-2 text-sm font-medium">Font Size: {fontSize}px</div>
				<div class="flex gap-2">
					<button class="btn btn-secondary text-sm" onclick={() => adjustFontSize(-2)}>A-</button>
					<button class="btn btn-secondary text-sm" onclick={() => adjustFontSize(2)}>A+</button>
				</div>
			</div>
			<div class="rounded-lg bg-surface-100 p-4 dark:bg-surface-800">
				<div class="mb-2 text-sm font-medium">Screen Reader</div>
				<span class={screenReaderHint ? 'badge-info' : 'badge-warning'}>
					{screenReaderHint ? 'Likely Active' : 'Unknown'}
				</span>
			</div>
		</div>
	</TestSection>

	<!-- Focus Management -->
	<TestSection title="Focus Management" description="Test programmatic focus control and tab order">
		<div class="space-y-4">
			<div class="flex flex-wrap gap-2">
				<button class="btn btn-secondary" onclick={collectFocusableElements}>Collect Focusable Elements</button>
				<button class="btn btn-primary" onclick={focusPrev}>← Previous</button>
				<button class="btn btn-primary" onclick={focusNext}>Next →</button>
			</div>

			<div id="focus-test-area" class="rounded-lg border border-surface-300 p-4 dark:border-surface-600">
				<p class="mb-3 text-sm text-surface-600 dark:text-surface-400">Tab through these elements or use the buttons above:</p>
				<div class="flex flex-wrap gap-2">
					<button class="btn btn-secondary">Button 1</button>
					<input type="text" class="input w-32" placeholder="Input" />
					<button class="btn btn-secondary">Link Style</button>
					<button class="btn btn-secondary">Button 2</button>
					<select class="input w-32">
						<option>Select</option>
						<option>Option 1</option>
						<option>Option 2</option>
					</select>
					<button class="btn btn-secondary">Button 3</button>
					<button class="rounded border border-surface-400 px-3 py-1 focus:ring-2">Focusable Button</button>
				</div>
			</div>
		</div>
	</TestSection>

	<!-- ARIA Live Regions -->
	<TestSection title="ARIA Live Regions" description="Test screen reader announcements">
		<div class="space-y-4">
			<div>
				<label for="live-message" class="label">Message to announce</label>
				<input id="live-message" type="text" class="input" bind:value={liveMessage} placeholder="Enter a message..." />
			</div>
			<div class="flex flex-wrap gap-2">
				<button class="btn btn-secondary" onclick={announcePolite}>Announce (Polite)</button>
				<button class="btn btn-primary" onclick={announceAssertive}>Announce (Assertive)</button>
			</div>

			<!-- Live regions (invisible but announced) -->
			<div aria-live="polite" aria-atomic="true" class="sr-only">
				{livePoliteMessage}
			</div>
			<div aria-live="assertive" aria-atomic="true" class="sr-only">
				{liveAssertiveMessage}
			</div>
		</div>
	</TestSection>

	<!-- Accessible Accordion -->
	<TestSection title="Accessible Accordion" description="ARIA-compliant expandable sections">
		<div class="space-y-2">
			{#each accordionItems as item}
				<div class="rounded-lg border border-surface-300 dark:border-surface-600">
					<button
						id="accordion-header-{item.id}"
						class="flex w-full items-center justify-between px-4 py-3 text-left font-medium hover:bg-surface-100 dark:hover:bg-surface-800"
						aria-expanded={item.expanded}
						aria-controls="accordion-panel-{item.id}"
						onclick={() => toggleAccordion(item.id)}
					>
						<span>{item.title}</span>
						<span class="text-xl transition-transform" class:rotate-180={item.expanded}>▼</span>
					</button>
					{#if item.expanded}
						<div
							id="accordion-panel-{item.id}"
							role="region"
							aria-labelledby="accordion-header-{item.id}"
							class="border-t border-surface-300 px-4 py-3 dark:border-surface-600"
						>
							{item.content}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</TestSection>

	<!-- Accessible Tabs -->
	<TestSection title="Accessible Tabs" description="ARIA-compliant tab panel with keyboard navigation">
		<div>
			<div role="tablist" class="flex border-b border-surface-300 dark:border-surface-600">
				{#each tabs as tab, index}
					<button
						id={tab.id}
						role="tab"
						aria-selected={activeTab === index}
						aria-controls="panel-{tab.id}"
						tabindex={activeTab === index ? 0 : -1}
						class="px-4 py-2 font-medium transition-colors"
						class:border-b-2={activeTab === index}
						class:border-primary-600={activeTab === index}
						class:text-primary-600={activeTab === index}
						class:text-surface-500={activeTab !== index}
						onclick={() => (activeTab = index)}
						onkeydown={(e) => handleTabKeydown(e, index)}
					>
						{tab.label}
					</button>
				{/each}
			</div>
			{#each tabs as tab, index}
				<div
					id="panel-{tab.id}"
					role="tabpanel"
					aria-labelledby={tab.id}
					class="p-4"
					class:hidden={activeTab !== index}
				>
					{tab.content}
				</div>
			{/each}
		</div>
	</TestSection>

	<!-- Accessible Modal -->
	<TestSection title="Accessible Modal Dialog" description="ARIA-compliant modal with focus trap">
		<button class="btn btn-primary" onclick={openModal}>Open Modal</button>
	</TestSection>

	<!-- ARIA Roles Reference -->
	<TestSection title="ARIA Roles Reference" description="Common ARIA roles for accessibility">
		<div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each ariaRoles.slice(0, 20) as item}
				<div class="rounded bg-surface-100 px-3 py-2 dark:bg-surface-800" role={item.role}>
					<code class="text-xs font-bold text-primary-600">{item.role}</code>
					<p class="text-xs text-surface-500">{item.description}</p>
				</div>
			{/each}
		</div>
		<p class="mt-4 text-sm text-surface-500">Showing 20 of {ariaRoles.length} ARIA roles. Each card has the role it describes.</p>
	</TestSection>

	<!-- Form Accessibility -->
	<TestSection title="Accessible Form Elements" description="Properly labeled form controls with error states">
		<form class="max-w-md space-y-4" onsubmit={(e) => { e.preventDefault(); log('Form submitted'); }}>
			<div>
				<label for="acc-name" class="label">
					Full Name <span class="text-red-500" aria-hidden="true">*</span>
				</label>
				<input
					id="acc-name"
					type="text"
					class="input"
					required
					aria-required="true"
					aria-describedby="name-hint"
				/>
				<p id="name-hint" class="mt-1 text-xs text-surface-500">Enter your first and last name</p>
			</div>

			<div>
				<label for="acc-email" class="label">
					Email <span class="text-red-500" aria-hidden="true">*</span>
				</label>
				<input
					id="acc-email"
					type="email"
					class="input border-red-500"
					required
					aria-required="true"
					aria-invalid="true"
					aria-describedby="email-error"
				/>
				<p id="email-error" class="mt-1 text-xs text-red-500" role="alert">Please enter a valid email address</p>
			</div>

			<fieldset>
				<legend class="label">Notification Preferences</legend>
				<div class="mt-2 space-y-2">
					<label class="flex items-center gap-2">
						<input type="checkbox" name="notifications" value="email" />
						<span>Email notifications</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" name="notifications" value="sms" />
						<span>SMS notifications</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" name="notifications" value="push" />
						<span>Push notifications</span>
					</label>
				</div>
			</fieldset>

			<button type="submit" class="btn btn-primary">Submit Form</button>
		</form>
	</TestSection>

	<!-- Console Output -->
	<div class="rounded-lg bg-surface-900">
		<div class="flex items-center justify-between border-b border-surface-700 bg-surface-800 px-4 py-2">
			<span class="text-sm font-medium text-surface-300">Console Output</span>
			<button onclick={clearLogs} class="text-xs text-surface-400 transition-colors hover:text-surface-200">Clear</button>
		</div>
		<div class="max-h-48 overflow-y-auto p-4 font-mono text-sm text-green-400" role="log" aria-live="polite">
			{#if logs.length === 0}
				<span class="text-surface-500">No logs yet...</span>
			{:else}
				{#each logs as logEntry}
					<div class="mb-1">{logEntry}</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<!-- Modal Overlay -->
{#if modalOpen}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		aria-describedby="modal-description"
		tabindex="-1"
		onclick={(e) => e.target === e.currentTarget && closeModal()}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div id="accessible-modal" class="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-surface-800">
			<h2 id="modal-title" class="mb-2 text-xl font-bold">Accessible Modal</h2>
			<p id="modal-description" class="mb-4 text-surface-600 dark:text-surface-400">
				This modal implements proper ARIA attributes, focus management, and keyboard navigation.
				Press Escape to close or click outside.
			</p>
			<div class="flex justify-end gap-2">
				<button class="btn btn-secondary" onclick={closeModal}>Cancel</button>
				<button class="btn btn-primary" onclick={() => { log('Modal action confirmed'); closeModal(); }}>Confirm</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* High contrast mode styles */
	:global(.high-contrast) {
		--color-primary: #0000ff;
		--color-background: #ffffff;
		--color-text: #000000;
	}

	:global(.high-contrast) * {
		border-color: currentColor !important;
	}

	/* Screen reader only utility */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.sr-only:focus-within {
		position: static;
		width: auto;
		height: auto;
		padding: inherit;
		margin: inherit;
		overflow: visible;
		clip: auto;
		white-space: normal;
	}
</style>

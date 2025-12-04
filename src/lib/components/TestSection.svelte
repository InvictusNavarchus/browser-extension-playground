<script lang="ts">
	import type { Snippet } from 'svelte';

	let { 
		title, 
		description, 
		icon = '🧪',
		children
	}: { 
		title: string; 
		description: string; 
		icon?: string;
		children: Snippet;
	} = $props();
</script>

<div class="test-section">
	<div class="flex items-start gap-3 mb-4">
		<span class="text-2xl">{icon}</span>
		<div>
			<h3 class="section-subtitle">{title}</h3>
			<p class="text-surface-600 text-sm">{description}</p>
		</div>
	</div>
	<div class="space-y-4">
		{@render children()}
	</div>
</div>

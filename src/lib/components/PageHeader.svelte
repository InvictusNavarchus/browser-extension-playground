<script lang="ts">
	import type { Snippet } from 'svelte';
	
	let { 
		title, 
		description, 
		children 
	}: { 
		title: string; 
		description: string; 
		children: Snippet;
	} = $props();
</script>

<div class="mb-8">
	<h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-2">{title}</h1>
	<p class="text-surface-600 dark:text-surface-400 text-lg">{description}</p>
</div>

<div class="space-y-6">
	{@render children()}
</div>

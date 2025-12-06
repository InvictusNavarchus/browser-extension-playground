<script lang="ts">
	import { theme } from '$lib/stores/theme';

	let currentTheme = $state('light');

	$effect(() => {
		theme.subscribe((t) => {
			currentTheme = t;
		});
	});
</script>

<button
	onclick={() => theme.toggle()}
	class="p-2 rounded-lg transition-colors {currentTheme === 'light'
		? 'bg-surface-100 text-surface-600 hover:bg-surface-200'
		: 'bg-surface-800 text-surface-300 hover:bg-surface-700'}"
	title="Toggle dark mode"
	aria-label="Toggle dark mode"
>
	{#if currentTheme === 'light'}
		<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
			<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
		</svg>
	{:else}
		<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
			<path
				fill-rule="evenodd"
				d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.464 5.464a1 1 0 01.707 1.414l-.707.707A1 1 0 013.05 6.171l.707-.707a1 1 0 011.414 0z"
				clip-rule="evenodd"
			/>
		</svg>
	{/if}
</button>

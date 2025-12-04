<script lang="ts">
	let { 
		logs = $bindable<string[]>([]),
		title = 'Console Output',
		maxHeight = '200px'
	}: { 
		logs?: string[];
		title?: string;
		maxHeight?: string;
	} = $props();
	
	function clear() {
		logs = [];
	}
	
	function addLog(message: string) {
		logs = [...logs, `[${new Date().toLocaleTimeString()}] ${message}`];
	}
	
	export { addLog };
</script>

<div class="bg-surface-900 rounded-lg overflow-hidden">
	<div class="flex items-center justify-between px-4 py-2 bg-surface-800 border-b border-surface-700">
		<span class="text-sm font-medium text-surface-300">{title}</span>
		<button 
			onclick={clear}
			class="text-xs text-surface-400 hover:text-surface-200 transition-colors"
		>
			Clear
		</button>
	</div>
	<div 
		class="p-4 font-mono text-sm text-green-400 overflow-y-auto"
		style="max-height: {maxHeight}"
	>
		{#if logs.length === 0}
			<span class="text-surface-500">No logs yet...</span>
		{:else}
			{#each logs as log}
				<div class="mb-1">{log}</div>
			{/each}
		{/if}
	</div>
</div>

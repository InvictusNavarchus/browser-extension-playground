<script lang="ts">
	let { 
		label, 
		value = $bindable(''),
		type = 'text',
		placeholder = '',
		id = crypto.randomUUID(),
		...rest
	}: { 
		label: string; 
		value?: string;
		type?: string;
		placeholder?: string;
		id?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div>
	<label for={id} class="label">{label}</label>
	<input 
		{id}
		{type}
		{placeholder}
		bind:value
		class="input"
		{...rest}
	/>
</div>

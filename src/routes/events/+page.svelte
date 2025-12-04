<script lang="ts">
	import { PageHeader, TestSection, ConsoleOutput } from '$lib';

	let logs = $state<string[]>([]);

	function log(message: string) {
		logs = [...logs, `[${new Date().toLocaleTimeString()}] ${message}`];
	}

	function clearLogs() {
		logs = [];
	}

	// Custom Events
	let customEventName = $state('my-custom-event');
	let customEventDetail = $state('Hello from custom event!');
	let customEventBubbles = $state(true);
	let customEventCancelable = $state(true);

	function dispatchCustomEvent() {
		const event = new CustomEvent(customEventName, {
			detail: { message: customEventDetail, timestamp: Date.now() },
			bubbles: customEventBubbles,
			cancelable: customEventCancelable
		});
		document.dispatchEvent(event);
		log(`Dispatched custom event: ${customEventName}`);
	}

	function listenForCustomEvent() {
		const handler = (e: Event) => {
			const customEvent = e as CustomEvent;
			log(`Received custom event: ${customEvent.type} - Detail: ${JSON.stringify(customEvent.detail)}`);
		};
		document.addEventListener(customEventName, handler, { once: true });
		log(`Listening for custom event: ${customEventName} (once)`);
	}

	// PostMessage
	let postMessageTarget = $state<'self' | 'iframe' | 'opener' | 'parent'>('self');
	let postMessageContent = $state('Hello via postMessage!');
	let postMessageOrigin = $state('*');

	function sendPostMessage() {
		const message = {
			type: 'test-message',
			content: postMessageContent,
			timestamp: Date.now()
		};

		switch (postMessageTarget) {
			case 'self':
				window.postMessage(message, postMessageOrigin);
				log(`Sent postMessage to self: ${JSON.stringify(message)}`);
				break;
			case 'iframe':
				const iframe = document.querySelector('iframe');
				if (iframe?.contentWindow) {
					iframe.contentWindow.postMessage(message, '*');
					log(`Sent postMessage to iframe: ${JSON.stringify(message)}`);
				} else {
					log('No iframe found!');
				}
				break;
			case 'opener':
				if (window.opener) {
					window.opener.postMessage(message, postMessageOrigin);
					log(`Sent postMessage to opener: ${JSON.stringify(message)}`);
				} else {
					log('No opener window!');
				}
				break;
			case 'parent':
				if (window.parent !== window) {
					window.parent.postMessage(message, postMessageOrigin);
					log(`Sent postMessage to parent: ${JSON.stringify(message)}`);
				} else {
					log('No parent window (this is the top frame)!');
				}
				break;
		}
	}

	// Message listener
	let messageListenerActive = $state(false);
	let messageHandler: ((e: MessageEvent) => void) | null = null;

	function toggleMessageListener() {
		if (messageListenerActive && messageHandler) {
			window.removeEventListener('message', messageHandler);
			messageHandler = null;
			messageListenerActive = false;
			log('Message listener disabled');
		} else {
			messageHandler = (e: MessageEvent) => {
				log(`Received message from ${e.origin}: ${JSON.stringify(e.data)}`);
			};
			window.addEventListener('message', messageHandler);
			messageListenerActive = true;
			log('Message listener enabled');
		}
	}

	// Window Events
	let windowEventType = $state<string>('resize');
	let windowEventListeners = $state<Map<string, EventListener>>(new Map());

	const windowEventTypes = [
		'resize',
		'scroll',
		'focus',
		'blur',
		'online',
		'offline',
		'beforeunload',
		'hashchange',
		'popstate',
		'storage',
		'visibilitychange'
	];

	function toggleWindowEventListener(eventType: string) {
		if (windowEventListeners.has(eventType)) {
			const listener = windowEventListeners.get(eventType)!;
			window.removeEventListener(eventType, listener);
			document.removeEventListener(eventType, listener);
			windowEventListeners.delete(eventType);
			windowEventListeners = new Map(windowEventListeners);
			log(`Removed listener for: ${eventType}`);
		} else {
			const listener = (e: Event) => {
				log(`Window event: ${eventType} - ${e.type}`);
			};
			if (eventType === 'visibilitychange') {
				document.addEventListener(eventType, listener);
			} else {
				window.addEventListener(eventType, listener);
			}
			windowEventListeners.set(eventType, listener);
			windowEventListeners = new Map(windowEventListeners);
			log(`Added listener for: ${eventType}`);
		}
	}

	// Keyboard Events
	let keyboardListenerActive = $state(false);
	let keyboardHandler: ((e: KeyboardEvent) => void) | null = null;
	let lastKeyPressed = $state('');

	function toggleKeyboardListener() {
		if (keyboardListenerActive && keyboardHandler) {
			document.removeEventListener('keydown', keyboardHandler);
			document.removeEventListener('keyup', keyboardHandler);
			keyboardHandler = null;
			keyboardListenerActive = false;
			log('Keyboard listener disabled');
		} else {
			keyboardHandler = (e: KeyboardEvent) => {
				lastKeyPressed = `${e.type}: ${e.key} (code: ${e.code}, ctrl: ${e.ctrlKey}, alt: ${e.altKey}, shift: ${e.shiftKey}, meta: ${e.metaKey})`;
				log(lastKeyPressed);
			};
			document.addEventListener('keydown', keyboardHandler);
			document.addEventListener('keyup', keyboardHandler);
			keyboardListenerActive = true;
			log('Keyboard listener enabled');
		}
	}

	// Mouse Events
	let mouseListenerActive = $state(false);
	let mouseHandler: ((e: MouseEvent) => void) | null = null;
	let mousePosition = $state({ x: 0, y: 0 });

	function toggleMouseListener() {
		if (mouseListenerActive && mouseHandler) {
			document.removeEventListener('mousemove', mouseHandler);
			document.removeEventListener('click', mouseHandler);
			document.removeEventListener('dblclick', mouseHandler);
			document.removeEventListener('contextmenu', mouseHandler);
			mouseHandler = null;
			mouseListenerActive = false;
			log('Mouse listener disabled');
		} else {
			mouseHandler = (e: MouseEvent) => {
				mousePosition = { x: e.clientX, y: e.clientY };
				if (e.type !== 'mousemove') {
					log(`Mouse event: ${e.type} at (${e.clientX}, ${e.clientY}) button: ${e.button}`);
				}
			};
			document.addEventListener('mousemove', mouseHandler);
			document.addEventListener('click', mouseHandler);
			document.addEventListener('dblclick', mouseHandler);
			document.addEventListener('contextmenu', mouseHandler);
			mouseListenerActive = true;
			log('Mouse listener enabled (move, click, dblclick, contextmenu)');
		}
	}

	// Touch Events
	let touchListenerActive = $state(false);
	let touchHandler: ((e: TouchEvent) => void) | null = null;

	function toggleTouchListener() {
		if (touchListenerActive && touchHandler) {
			document.removeEventListener('touchstart', touchHandler);
			document.removeEventListener('touchmove', touchHandler);
			document.removeEventListener('touchend', touchHandler);
			touchHandler = null;
			touchListenerActive = false;
			log('Touch listener disabled');
		} else {
			touchHandler = (e: TouchEvent) => {
				const touches = Array.from(e.touches).map((t) => `(${t.clientX.toFixed(0)}, ${t.clientY.toFixed(0)})`);
				log(`Touch event: ${e.type} - ${touches.length} touch(es): ${touches.join(', ')}`);
			};
			document.addEventListener('touchstart', touchHandler);
			document.addEventListener('touchmove', touchHandler);
			document.addEventListener('touchend', touchHandler);
			touchListenerActive = true;
			log('Touch listener enabled');
		}
	}

	// Broadcast Channel
	let broadcastChannelName = $state('test-channel');
	let broadcastMessage = $state('Hello via Broadcast Channel!');
	let broadcastChannel: BroadcastChannel | null = null;

	function createBroadcastChannel() {
		if (broadcastChannel) {
			broadcastChannel.close();
			log('Closed existing broadcast channel');
		}
		broadcastChannel = new BroadcastChannel(broadcastChannelName);
		broadcastChannel.onmessage = (e) => {
			log(`Broadcast received on "${broadcastChannelName}": ${JSON.stringify(e.data)}`);
		};
		log(`Created broadcast channel: ${broadcastChannelName}`);
	}

	function sendBroadcast() {
		if (!broadcastChannel) {
			log('Create a broadcast channel first!');
			return;
		}
		broadcastChannel.postMessage({
			content: broadcastMessage,
			timestamp: Date.now()
		});
		log(`Sent broadcast: ${broadcastMessage}`);
	}

	// Clipboard Events
	let clipboardListenerActive = $state(false);
	let clipboardHandler: ((e: ClipboardEvent) => void) | null = null;

	function toggleClipboardListener() {
		if (clipboardListenerActive && clipboardHandler) {
			document.removeEventListener('copy', clipboardHandler);
			document.removeEventListener('cut', clipboardHandler);
			document.removeEventListener('paste', clipboardHandler);
			clipboardHandler = null;
			clipboardListenerActive = false;
			log('Clipboard listener disabled');
		} else {
			clipboardHandler = (e: ClipboardEvent) => {
				const data = e.clipboardData?.getData('text/plain') || '[no text data]';
				log(`Clipboard event: ${e.type} - Data: ${data.substring(0, 100)}`);
			};
			document.addEventListener('copy', clipboardHandler);
			document.addEventListener('cut', clipboardHandler);
			document.addEventListener('paste', clipboardHandler);
			clipboardListenerActive = true;
			log('Clipboard listener enabled (copy, cut, paste)');
		}
	}

	// Drag and Drop Events
	let dragDropListenerActive = $state(false);
	let dragDropHandler: ((e: DragEvent) => void) | null = null;

	function toggleDragDropListener() {
		const dropZone = document.getElementById('drop-zone');
		if (!dropZone) return;

		if (dragDropListenerActive && dragDropHandler) {
			dropZone.removeEventListener('dragenter', dragDropHandler);
			dropZone.removeEventListener('dragover', dragDropHandler);
			dropZone.removeEventListener('dragleave', dragDropHandler);
			dropZone.removeEventListener('drop', dragDropHandler);
			dragDropHandler = null;
			dragDropListenerActive = false;
			log('Drag & Drop listener disabled');
		} else {
			dragDropHandler = (e: DragEvent) => {
				e.preventDefault();
				if (e.type === 'drop' && e.dataTransfer) {
					const files = Array.from(e.dataTransfer.files).map((f) => f.name);
					const text = e.dataTransfer.getData('text/plain');
					log(`Drop event: ${files.length} file(s): ${files.join(', ')} | Text: ${text || '[none]'}`);
				} else {
					log(`Drag event: ${e.type}`);
				}
			};
			dropZone.addEventListener('dragenter', dragDropHandler);
			dropZone.addEventListener('dragover', dragDropHandler);
			dropZone.addEventListener('dragleave', dragDropHandler);
			dropZone.addEventListener('drop', dragDropHandler);
			dragDropListenerActive = true;
			log('Drag & Drop listener enabled');
		}
	}
</script>

<PageHeader title="Events & Messaging" description="Test custom events, postMessage, window events, and cross-context communication">
	<button class="btn btn-secondary text-sm" onclick={clearLogs}>Clear Logs</button>
</PageHeader>

<div class="space-y-6">
	<!-- Custom Events -->
	<TestSection title="Custom Events" description="Dispatch and listen for custom DOM events">
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="space-y-3">
				<div>
					<label for="custom-event-name" class="label">Event Name</label>
					<input id="custom-event-name" type="text" class="input" bind:value={customEventName} />
				</div>
				<div>
					<label for="custom-event-detail" class="label">Event Detail</label>
					<input id="custom-event-detail" type="text" class="input" bind:value={customEventDetail} />
				</div>
				<div class="flex gap-4">
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={customEventBubbles} class="rounded" />
						<span class="text-sm">Bubbles</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={customEventCancelable} class="rounded" />
						<span class="text-sm">Cancelable</span>
					</label>
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<button class="btn btn-primary" onclick={listenForCustomEvent}>Listen (Once)</button>
				<button class="btn btn-secondary" onclick={dispatchCustomEvent}>Dispatch Event</button>
			</div>
		</div>
	</TestSection>

	<!-- PostMessage -->
	<TestSection title="PostMessage API" description="Send messages between windows and iframes">
		<div class="grid gap-4 lg:grid-cols-2">
			<div class="space-y-3">
				<div>
					<label for="post-message-target" class="label">Target</label>
					<select id="post-message-target" class="input" bind:value={postMessageTarget}>
						<option value="self">Self (window)</option>
						<option value="iframe">Iframe</option>
						<option value="opener">Opener Window</option>
						<option value="parent">Parent Window</option>
					</select>
				</div>
				<div>
					<label for="post-message-content" class="label">Message Content</label>
					<input id="post-message-content" type="text" class="input" bind:value={postMessageContent} />
				</div>
				<div>
					<label for="post-message-origin" class="label">Target Origin</label>
					<input id="post-message-origin" type="text" class="input" bind:value={postMessageOrigin} placeholder="* or https://example.com" />
				</div>
				<div class="flex gap-2">
					<button class="btn btn-primary" onclick={sendPostMessage}>Send Message</button>
					<button class="btn" class:btn-secondary={!messageListenerActive} class:btn-primary={messageListenerActive} onclick={toggleMessageListener}>
						{messageListenerActive ? '🟢 Listener Active' : 'Enable Listener'}
					</button>
				</div>
			</div>
			<div>
				<p class="label mb-2">Test Iframe</p>
				<iframe src="about:blank" class="h-32 w-full rounded-lg border border-surface-300 bg-white dark:border-surface-600 dark:bg-surface-800" title="Test iframe for postMessage"></iframe>
			</div>
		</div>
	</TestSection>

	<!-- Broadcast Channel -->
	<TestSection title="Broadcast Channel" description="Send messages between browser contexts (tabs, windows, iframes)">
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="space-y-3">
				<div>
					<label for="broadcast-channel-name" class="label">Channel Name</label>
					<input id="broadcast-channel-name" type="text" class="input" bind:value={broadcastChannelName} />
				</div>
				<div>
					<label for="broadcast-message" class="label">Message</label>
					<input id="broadcast-message" type="text" class="input" bind:value={broadcastMessage} />
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<button class="btn btn-secondary" onclick={createBroadcastChannel}>Create Channel</button>
				<button class="btn btn-primary" onclick={sendBroadcast}>Send Broadcast</button>
				<p class="text-xs text-surface-500">Open this page in another tab to test</p>
			</div>
		</div>
	</TestSection>

	<!-- Window Events -->
	<TestSection title="Window Events" description="Monitor various window and document events">
		<div class="flex flex-wrap gap-2">
			{#each windowEventTypes as eventType}
				<button
					class="btn text-sm"
					class:btn-primary={windowEventListeners.has(eventType)}
					class:btn-secondary={!windowEventListeners.has(eventType)}
					onclick={() => toggleWindowEventListener(eventType)}
				>
					{windowEventListeners.has(eventType) ? '🟢' : '⚪'} {eventType}
				</button>
			{/each}
		</div>
	</TestSection>

	<!-- Keyboard Events -->
	<TestSection title="Keyboard Events" description="Capture keyboard input events">
		<div class="flex flex-wrap items-center gap-4">
			<button class="btn" class:btn-primary={keyboardListenerActive} class:btn-secondary={!keyboardListenerActive} onclick={toggleKeyboardListener}>
				{keyboardListenerActive ? '🟢 Listening' : 'Start Listening'}
			</button>
			{#if lastKeyPressed}
				<div class="rounded-lg bg-surface-100 px-4 py-2 font-mono text-sm dark:bg-surface-800">
					{lastKeyPressed}
				</div>
			{/if}
		</div>
	</TestSection>

	<!-- Mouse Events -->
	<TestSection title="Mouse Events" description="Track mouse movements and clicks">
		<div class="flex flex-wrap items-center gap-4">
			<button class="btn" class:btn-primary={mouseListenerActive} class:btn-secondary={!mouseListenerActive} onclick={toggleMouseListener}>
				{mouseListenerActive ? '🟢 Listening' : 'Start Listening'}
			</button>
			{#if mouseListenerActive}
				<div class="rounded-lg bg-surface-100 px-4 py-2 font-mono text-sm dark:bg-surface-800">
					Position: ({mousePosition.x}, {mousePosition.y})
				</div>
			{/if}
		</div>
	</TestSection>

	<!-- Touch Events -->
	<TestSection title="Touch Events" description="Track touch interactions (mobile/touchscreen)">
		<button class="btn" class:btn-primary={touchListenerActive} class:btn-secondary={!touchListenerActive} onclick={toggleTouchListener}>
			{touchListenerActive ? '🟢 Listening' : 'Start Listening'}
		</button>
	</TestSection>

	<!-- Clipboard Events -->
	<TestSection title="Clipboard Events" description="Monitor copy, cut, and paste operations">
		<div class="space-y-3">
			<button class="btn" class:btn-primary={clipboardListenerActive} class:btn-secondary={!clipboardListenerActive} onclick={toggleClipboardListener}>
				{clipboardListenerActive ? '🟢 Listening' : 'Start Listening'}
			</button>
			<div>
				<p class="label mb-1">Test Area (try copying/pasting text)</p>
				<textarea class="input h-20" placeholder="Select and copy this text, or paste something here..."></textarea>
			</div>
		</div>
	</TestSection>

	<!-- Drag and Drop Events -->
	<TestSection title="Drag & Drop Events" description="Monitor drag and drop operations">
		<div class="space-y-3">
			<button class="btn" class:btn-primary={dragDropListenerActive} class:btn-secondary={!dragDropListenerActive} onclick={toggleDragDropListener}>
				{dragDropListenerActive ? '🟢 Listening' : 'Start Listening'}
			</button>
			<div class="flex gap-4">
				<div draggable="true" class="flex h-20 w-20 cursor-grab items-center justify-center rounded-lg border-2 border-dashed border-primary-500 bg-primary-100 text-center text-sm dark:bg-primary-900/30">
					Drag me
				</div>
				<div id="drop-zone" class="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-surface-400 bg-surface-100 p-4 text-surface-500 dark:border-surface-600 dark:bg-surface-800">
					Drop zone - drop files or draggable elements here
				</div>
			</div>
		</div>
	</TestSection>

	<!-- Console Output -->
	<ConsoleOutput bind:logs />
</div>

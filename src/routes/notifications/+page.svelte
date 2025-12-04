<script lang="ts">
	import { PageHeader, TestSection } from '$lib';

	let logs = $state<string[]>([]);

	function log(message: string) {
		logs = [...logs, `[${new Date().toLocaleTimeString()}] ${message}`];
	}

	function clearLogs() {
		logs = [];
	}

	// Notification Permission
	let notificationPermission = $state<NotificationPermission | 'unsupported'>('default');

	$effect(() => {
		if ('Notification' in window) {
			notificationPermission = Notification.permission;
		} else {
			notificationPermission = 'unsupported';
		}
	});

	async function requestNotificationPermission() {
		if (!('Notification' in window)) {
			log('Notifications not supported in this browser');
			return;
		}

		const permission = await Notification.requestPermission();
		notificationPermission = permission;
		log(`Notification permission: ${permission}`);
	}

	// Basic Notification
	let notificationTitle = $state('Test Notification');
	let notificationBody = $state('This is a test notification from the browser extension playground.');
	let notificationIcon = $state('https://via.placeholder.com/64');
	let notificationTag = $state('test-notification');
	let notificationRequireInteraction = $state(false);
	let notificationSilent = $state(false);

	function showBasicNotification() {
		if (notificationPermission !== 'granted') {
			log('Notification permission not granted');
			return;
		}

		const notification = new Notification(notificationTitle, {
			body: notificationBody,
			icon: notificationIcon,
			tag: notificationTag,
			requireInteraction: notificationRequireInteraction,
			silent: notificationSilent
		});

		notification.onclick = () => {
			log('Notification clicked');
			window.focus();
			notification.close();
		};

		notification.onclose = () => {
			log('Notification closed');
		};

		notification.onerror = (e) => {
			log(`Notification error: ${e}`);
		};

		notification.onshow = () => {
			log('Notification shown');
		};

		log(`Created notification: "${notificationTitle}"`);
	}

	// Service Worker Notification
	async function showServiceWorkerNotification() {
		if (!('serviceWorker' in navigator)) {
			log('Service Workers not supported');
			return;
		}

		try {
			const registration = await navigator.serviceWorker.ready;
			await registration.showNotification(notificationTitle, {
				body: notificationBody,
				icon: notificationIcon,
				tag: notificationTag,
				requireInteraction: notificationRequireInteraction,
				silent: notificationSilent,
				data: { url: window.location.href, timestamp: Date.now() }
			});
			log('Service Worker notification sent');
		} catch (err) {
			log(`Service Worker notification error: ${err}`);
		}
	}

	// Push API (simulated)
	let pushSubscription = $state<PushSubscription | null>(null);

	async function subscribeToPush() {
		if (!('PushManager' in window)) {
			log('Push API not supported');
			return;
		}

		try {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: new Uint8Array(65) // Dummy key for testing
			});
			pushSubscription = subscription;
			log(`Push subscription created: ${subscription.endpoint.substring(0, 50)}...`);
		} catch (err) {
			log(`Push subscription error: ${err}`);
		}
	}

	async function unsubscribeFromPush() {
		if (pushSubscription) {
			await pushSubscription.unsubscribe();
			pushSubscription = null;
			log('Push subscription cancelled');
		}
	}

	// Alerts, Confirms, Prompts
	function showAlert() {
		window.alert('This is a native alert dialog!');
		log('Alert dialog closed');
	}

	function showConfirm() {
		const result = window.confirm('Do you want to continue?');
		log(`Confirm dialog result: ${result}`);
	}

	function showPrompt() {
		const result = window.prompt('Enter your name:', 'Guest');
		log(`Prompt dialog result: ${result ?? '[cancelled]'}`);
	}

	// Badge API
	let badgeCount = $state(5);

	async function setBadge() {
		if (!('setAppBadge' in navigator)) {
			log('Badge API not supported');
			return;
		}

		try {
			await navigator.setAppBadge(badgeCount);
			log(`App badge set to: ${badgeCount}`);
		} catch (err) {
			log(`Badge error: ${err}`);
		}
	}

	async function clearBadge() {
		if (!('clearAppBadge' in navigator)) {
			log('Badge API not supported');
			return;
		}

		try {
			await navigator.clearAppBadge();
			log('App badge cleared');
		} catch (err) {
			log(`Badge error: ${err}`);
		}
	}

	// Vibration API
	let vibrationPattern = $state('200, 100, 200');

	function vibrate() {
		if (!('vibrate' in navigator)) {
			log('Vibration API not supported');
			return;
		}

		const pattern = vibrationPattern.split(',').map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n));
		const result = navigator.vibrate(pattern);
		log(`Vibration ${result ? 'started' : 'failed'}: [${pattern.join(', ')}]ms`);
	}

	function stopVibration() {
		if (!('vibrate' in navigator)) {
			log('Vibration API not supported');
			return;
		}

		navigator.vibrate(0);
		log('Vibration stopped');
	}

	// Screen Wake Lock
	let wakeLock: WakeLockSentinel | null = $state(null);

	async function requestWakeLock() {
		if (!('wakeLock' in navigator)) {
			log('Wake Lock API not supported');
			return;
		}

		try {
			wakeLock = await navigator.wakeLock.request('screen');
			wakeLock.addEventListener('release', () => {
				log('Wake lock released');
				wakeLock = null;
			});
			log('Wake lock acquired');
		} catch (err) {
			log(`Wake lock error: ${err}`);
		}
	}

	async function releaseWakeLock() {
		if (wakeLock) {
			await wakeLock.release();
			wakeLock = null;
		}
	}

	// Toast-style custom notifications
	let toasts = $state<Array<{ id: number; message: string; type: 'info' | 'success' | 'warning' | 'error' }>>([]);
	let toastCounter = 0;

	function showToast(type: 'info' | 'success' | 'warning' | 'error', message: string) {
		const id = ++toastCounter;
		toasts = [...toasts, { id, message, type }];
		log(`Toast shown: [${type}] ${message}`);

		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, 3000);
	}
</script>

<PageHeader title="Notifications" description="Test browser notifications, alerts, and user feedback APIs">
	<button class="btn btn-secondary text-sm" onclick={clearLogs}>Clear Logs</button>
</PageHeader>

<div class="space-y-6">
	<!-- Permission Status -->
	<TestSection title="Notification Permission" description="Request and check notification permission status">
		<div class="flex flex-wrap items-center gap-4">
			<div class="flex items-center gap-2">
				<span class="text-sm text-surface-600 dark:text-surface-400">Status:</span>
				{#if notificationPermission === 'granted'}
					<span class="badge-success">Granted</span>
				{:else if notificationPermission === 'denied'}
					<span class="badge-error">Denied</span>
				{:else if notificationPermission === 'unsupported'}
					<span class="badge-warning">Unsupported</span>
				{:else}
					<span class="badge-warning">Default (Not Asked)</span>
				{/if}
			</div>
			<button class="btn btn-primary" onclick={requestNotificationPermission}>Request Permission</button>
		</div>
	</TestSection>

	<!-- Basic Notification -->
	<TestSection title="Browser Notifications" description="Create and display system notifications">
		<div class="grid gap-4 lg:grid-cols-2">
			<div class="space-y-3">
				<div>
					<label for="notif-title" class="label">Title</label>
					<input id="notif-title" type="text" class="input" bind:value={notificationTitle} />
				</div>
				<div>
					<label for="notif-body" class="label">Body</label>
					<textarea id="notif-body" class="input h-20" bind:value={notificationBody}></textarea>
				</div>
				<div>
					<label for="notif-icon" class="label">Icon URL</label>
					<input id="notif-icon" type="url" class="input" bind:value={notificationIcon} />
				</div>
				<div>
					<label for="notif-tag" class="label">Tag (for grouping)</label>
					<input id="notif-tag" type="text" class="input" bind:value={notificationTag} />
				</div>
			</div>
			<div class="space-y-3">
				<div class="flex flex-col gap-2">
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={notificationRequireInteraction} class="rounded" />
						<span class="text-sm">Require Interaction</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={notificationSilent} class="rounded" />
						<span class="text-sm">Silent</span>
					</label>
				</div>
				<div class="flex flex-col gap-2 pt-2">
					<button class="btn btn-primary" onclick={showBasicNotification}>Show Basic Notification</button>
					<button class="btn btn-secondary" onclick={showServiceWorkerNotification}>Show SW Notification</button>
				</div>
			</div>
		</div>
	</TestSection>

	<!-- Push API -->
	<TestSection title="Push API" description="Subscribe to push notifications (requires service worker)">
		<div class="flex flex-wrap items-center gap-4">
			<button class="btn btn-primary" onclick={subscribeToPush} disabled={pushSubscription !== null}>Subscribe to Push</button>
			<button class="btn btn-secondary" onclick={unsubscribeFromPush} disabled={pushSubscription === null}>Unsubscribe</button>
			{#if pushSubscription}
				<span class="text-sm text-surface-500">Active subscription</span>
			{/if}
		</div>
	</TestSection>

	<!-- Native Dialogs -->
	<TestSection title="Native Dialogs" description="Test alert, confirm, and prompt dialogs">
		<div class="flex flex-wrap gap-2">
			<button class="btn btn-secondary" onclick={showAlert}>Show Alert</button>
			<button class="btn btn-secondary" onclick={showConfirm}>Show Confirm</button>
			<button class="btn btn-secondary" onclick={showPrompt}>Show Prompt</button>
		</div>
	</TestSection>

	<!-- Badge API -->
	<TestSection title="App Badge API" description="Set notification badges on PWA icons">
		<div class="flex flex-wrap items-center gap-4">
			<div class="flex items-center gap-2">
				<label for="badge-count" class="text-sm">Count:</label>
				<input id="badge-count" type="number" class="input w-20" min="0" max="99" bind:value={badgeCount} />
			</div>
			<button class="btn btn-primary" onclick={setBadge}>Set Badge</button>
			<button class="btn btn-secondary" onclick={clearBadge}>Clear Badge</button>
		</div>
	</TestSection>

	<!-- Vibration API -->
	<TestSection title="Vibration API" description="Trigger device vibration (mobile)">
		<div class="flex flex-wrap items-center gap-4">
			<div class="flex-1">
				<label for="vibration-pattern" class="label">Pattern (ms, comma-separated)</label>
				<input id="vibration-pattern" type="text" class="input" bind:value={vibrationPattern} placeholder="200, 100, 200" />
			</div>
			<button class="btn btn-primary" onclick={vibrate}>Vibrate</button>
			<button class="btn btn-secondary" onclick={stopVibration}>Stop</button>
		</div>
	</TestSection>

	<!-- Screen Wake Lock -->
	<TestSection title="Screen Wake Lock" description="Prevent the screen from turning off">
		<div class="flex flex-wrap items-center gap-4">
			<button class="btn btn-primary" onclick={requestWakeLock} disabled={wakeLock !== null}>Request Wake Lock</button>
			<button class="btn btn-secondary" onclick={releaseWakeLock} disabled={wakeLock === null}>Release Wake Lock</button>
			{#if wakeLock}
				<span class="badge-success">Wake Lock Active</span>
			{/if}
		</div>
	</TestSection>

	<!-- Custom Toast Notifications -->
	<TestSection title="Custom Toast Notifications" description="Test in-page toast notifications (commonly modified by extensions)">
		<div class="flex flex-wrap gap-2">
			<button class="btn btn-secondary" onclick={() => showToast('info', 'This is an info message')}>Info Toast</button>
			<button class="btn btn-secondary" onclick={() => showToast('success', 'Operation completed successfully!')}>Success Toast</button>
			<button class="btn btn-secondary" onclick={() => showToast('warning', 'Warning: This action cannot be undone')}>Warning Toast</button>
			<button class="btn btn-secondary" onclick={() => showToast('error', 'Error: Something went wrong')}>Error Toast</button>
		</div>
	</TestSection>

	<!-- Console Output -->
	<div class="rounded-lg bg-surface-900">
		<div class="flex items-center justify-between border-b border-surface-700 bg-surface-800 px-4 py-2">
			<span class="text-sm font-medium text-surface-300">Console Output</span>
			<button onclick={clearLogs} class="text-xs text-surface-400 transition-colors hover:text-surface-200">Clear</button>
		</div>
		<div class="max-h-48 overflow-y-auto p-4 font-mono text-sm text-green-400">
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

<!-- Toast Container -->
{#if toasts.length > 0}
	<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
		{#each toasts as toast (toast.id)}
			<div
				class="animate-slide-in rounded-lg px-4 py-3 text-white shadow-lg"
				class:bg-blue-600={toast.type === 'info'}
				class:bg-green-600={toast.type === 'success'}
				class:bg-yellow-600={toast.type === 'warning'}
				class:bg-red-600={toast.type === 'error'}
			>
				{toast.message}
			</div>
		{/each}
	</div>
{/if}

<style>
	@keyframes slide-in {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.animate-slide-in {
		animation: slide-in 0.3s ease-out;
	}
</style>

<script lang="ts">
	import { PageHeader } from '$lib';
	import { browser } from '$app/environment';
	
	let logs = $state<string[]>([]);
	
	// Fetch
	let fetchUrl = $state('https://jsonplaceholder.typicode.com/posts/1');
	let fetchMethod = $state('GET');
	let fetchBody = $state('');
	let fetchResult = $state('');
	let fetchLoading = $state(false);
	
	// XHR
	let xhrUrl = $state('https://jsonplaceholder.typicode.com/users/1');
	let xhrResult = $state('');
	let xhrLoading = $state(false);
	
	// WebSocket
	let wsUrl = $state('wss://ws.postman-echo.com/raw');
	let wsMessage = $state('Hello WebSocket!');
	let wsConnected = $state(false);
	let wsMessages = $state<string[]>([]);
	let ws: WebSocket | null = null;
	
	// Beacon
	let beaconUrl = $state('/api/beacon');
	let beaconData = $state('beacon-data-test');
	
	function log(message: string) {
		logs = [...logs, `[${new Date().toLocaleTimeString()}] ${message}`];
	}
	
	function clearLogs() {
		logs = [];
	}
	
	// Fetch API
	async function makeFetchRequest() {
		if (!browser) return;
		fetchLoading = true;
		fetchResult = '';
		log(`Fetch ${fetchMethod}: ${fetchUrl}`);
		
		try {
			const options: RequestInit = {
				method: fetchMethod,
				headers: {
					'Content-Type': 'application/json',
				},
			};
			
			if (fetchMethod !== 'GET' && fetchMethod !== 'HEAD' && fetchBody) {
				options.body = fetchBody;
			}
			
			const response = await fetch(fetchUrl, options);
			const data = await response.json();
			fetchResult = JSON.stringify(data, null, 2);
			log(`Fetch response: ${response.status} ${response.statusText}`);
		} catch (error) {
			fetchResult = `Error: ${error}`;
			log(`Fetch error: ${error}`);
		} finally {
			fetchLoading = false;
		}
	}
	
	// XMLHttpRequest
	function makeXHRRequest() {
		if (!browser) return;
		xhrLoading = true;
		xhrResult = '';
		log(`XHR GET: ${xhrUrl}`);
		
		const xhr = new XMLHttpRequest();
		xhr.open('GET', xhrUrl);
		
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) {
					try {
						const data = JSON.parse(xhr.responseText);
						xhrResult = JSON.stringify(data, null, 2);
						log(`XHR response: ${xhr.status} OK`);
					} catch {
						xhrResult = xhr.responseText;
						log(`XHR response: ${xhr.status} (non-JSON)`);
					}
				} else {
					xhrResult = `Error: ${xhr.status} ${xhr.statusText}`;
					log(`XHR error: ${xhr.status} ${xhr.statusText}`);
				}
				xhrLoading = false;
			}
		};
		
		xhr.onerror = () => {
			xhrResult = 'Network Error';
			log('XHR network error');
			xhrLoading = false;
		};
		
		xhr.send();
	}
	
	// WebSocket
	function connectWebSocket() {
		if (!browser || wsConnected) return;
		
		try {
			ws = new WebSocket(wsUrl);
			log(`WebSocket connecting to: ${wsUrl}`);
			
			ws.onopen = () => {
				wsConnected = true;
				log('WebSocket connected');
			};
			
			ws.onmessage = (event) => {
				wsMessages = [...wsMessages, `← ${event.data}`];
				log(`WebSocket received: ${event.data}`);
			};
			
			ws.onclose = () => {
				wsConnected = false;
				log('WebSocket disconnected');
			};
			
			ws.onerror = (error) => {
				log(`WebSocket error: ${error}`);
			};
		} catch (error) {
			log(`WebSocket error: ${error}`);
		}
	}
	
	function disconnectWebSocket() {
		if (ws) {
			ws.close();
			ws = null;
		}
	}
	
	function sendWebSocketMessage() {
		if (ws && wsConnected) {
			ws.send(wsMessage);
			wsMessages = [...wsMessages, `→ ${wsMessage}`];
			log(`WebSocket sent: ${wsMessage}`);
		}
	}
	
	function clearWebSocketMessages() {
		wsMessages = [];
	}
	
	// Beacon API
	function sendBeacon() {
		if (!browser) return;
		
		// Since we don't have a real endpoint, we'll demonstrate the API
		log(`navigator.sendBeacon('${beaconUrl}', '${beaconData}')`);
		
		try {
			// This will likely fail without a real endpoint
			const result = navigator.sendBeacon(beaconUrl, beaconData);
			log(`Beacon sent: ${result ? 'success' : 'failed'}`);
		} catch (error) {
			log(`Beacon error: ${error}`);
		}
	}
	
	// Image request (for tracking pixel testing)
	function loadTrackingPixel() {
		if (!browser) return;
		const img = new Image();
		const url = `https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png?t=${Date.now()}`;
		img.src = url;
		log(`Image request: ${url}`);
		img.onload = () => log('Image loaded successfully');
		img.onerror = () => log('Image failed to load');
	}
	
	// Script injection
	function loadExternalScript() {
		if (!browser) return;
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js';
		script.onload = () => log('External script loaded (lodash)');
		script.onerror = () => log('External script failed to load');
		document.head.appendChild(script);
		log('Loading external script...');
	}
</script>

<PageHeader 
	title="Network & XHR" 
	description="Test fetch API, XMLHttpRequest, WebSockets, and other network-related features."
>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Fetch API -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>🌐</span>
				Fetch API
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test modern fetch requests for API interception.
			</p>
			
			<div class="space-y-4">
				<div>
					<label for="fetch-url" class="label">URL</label>
					<input 
						id="fetch-url"
						type="url" 
						class="input" 
						bind:value={fetchUrl}
						data-testid="fetch-url"
					/>
				</div>
				
				<div>
					<label for="fetch-method" class="label">Method</label>
					<select 
						id="fetch-method"
						class="input"
						bind:value={fetchMethod}
					>
						<option value="GET">GET</option>
						<option value="POST">POST</option>
						<option value="PUT">PUT</option>
						<option value="PATCH">PATCH</option>
						<option value="DELETE">DELETE</option>
					</select>
				</div>
				
				{#if fetchMethod !== 'GET' && fetchMethod !== 'HEAD'}
					<div>
						<label for="fetch-body" class="label">Body (JSON)</label>
						<textarea 
							id="fetch-body"
							class="input min-h-20"
							placeholder={'{"key": "value"}'}
							bind:value={fetchBody}
						></textarea>
					</div>
				{/if}
				
				<button 
					class="btn-primary w-full" 
					onclick={makeFetchRequest}
					disabled={fetchLoading}
				>
					{fetchLoading ? 'Loading...' : 'Send Fetch Request'}
				</button>
				
				{#if fetchResult}
					<div class="bg-surface-900 rounded-lg p-4 max-h-48 overflow-auto">
						<pre class="text-sm text-green-400 font-mono whitespace-pre-wrap">{fetchResult}</pre>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- XMLHttpRequest -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>📡</span>
				XMLHttpRequest (XHR)
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test legacy XHR requests for compatibility.
			</p>
			
			<div class="space-y-4">
				<div>
					<label for="xhr-url" class="label">URL</label>
					<input 
						id="xhr-url"
						type="url" 
						class="input" 
						bind:value={xhrUrl}
						data-testid="xhr-url"
					/>
				</div>
				
				<button 
					class="btn-primary w-full" 
					onclick={makeXHRRequest}
					disabled={xhrLoading}
				>
					{xhrLoading ? 'Loading...' : 'Send XHR Request'}
				</button>
				
				{#if xhrResult}
					<div class="bg-surface-900 rounded-lg p-4 max-h-48 overflow-auto">
						<pre class="text-sm text-green-400 font-mono whitespace-pre-wrap">{xhrResult}</pre>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- WebSocket -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>🔌</span>
				WebSocket
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test WebSocket connections and messages.
			</p>
			
			<div class="space-y-4">
				<div>
					<label for="ws-url" class="label">WebSocket URL</label>
					<input 
						id="ws-url"
						type="url" 
						class="input" 
						bind:value={wsUrl}
						disabled={wsConnected}
						data-testid="ws-url"
					/>
				</div>
				
				<div class="flex gap-2">
					{#if !wsConnected}
						<button class="btn-success flex-1" onclick={connectWebSocket}>
							Connect
						</button>
					{:else}
						<button class="btn-danger flex-1" onclick={disconnectWebSocket}>
							Disconnect
						</button>
					{/if}
				</div>
				
				<div class="flex items-center gap-2">
					<span class={['w-3 h-3 rounded-full', wsConnected ? 'bg-green-500' : 'bg-red-500'].join(' ')}></span>
					<span class="text-sm text-surface-600">{wsConnected ? 'Connected' : 'Disconnected'}</span>
				</div>
				
				{#if wsConnected}
					<div>
						<label for="ws-message" class="label">Message</label>
						<div class="flex gap-2">
							<input 
								id="ws-message"
								type="text" 
								class="input flex-1" 
								bind:value={wsMessage}
								data-testid="ws-message"
							/>
							<button class="btn-primary" onclick={sendWebSocketMessage}>
								Send
							</button>
						</div>
					</div>
				{/if}
				
				<div class="bg-surface-900 rounded-lg p-4 max-h-40 overflow-y-auto">
					<div class="flex justify-between items-center mb-2">
						<span class="text-xs text-surface-500">Messages</span>
						<button class="text-xs text-surface-400 hover:text-surface-200" onclick={clearWebSocketMessages}>
							Clear
						</button>
					</div>
					{#if wsMessages.length === 0}
						<p class="text-surface-500 text-sm">No messages yet...</p>
					{:else}
						{#each wsMessages as msg}
							<div class="text-sm font-mono text-green-400">{msg}</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
		
		<!-- Other Network Features -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>🔧</span>
				Other Network Features
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test beacons, tracking pixels, and script loading.
			</p>
			
			<div class="space-y-4">
				<!-- Beacon API -->
				<div class="border-b border-surface-200 pb-4">
					<p class="text-sm font-medium text-surface-700 mb-2">Beacon API</p>
					<div class="flex gap-2 mb-2">
						<input 
							type="text" 
							class="input flex-1" 
							placeholder="Beacon data"
							bind:value={beaconData}
						/>
						<button class="btn-primary" onclick={sendBeacon}>
							Send Beacon
						</button>
					</div>
					<p class="text-xs text-surface-500">Sends data asynchronously (page unload safe)</p>
				</div>
				
				<!-- Tracking Pixel -->
				<div class="border-b border-surface-200 pb-4">
					<p class="text-sm font-medium text-surface-700 mb-2">Tracking Pixel / Image Request</p>
					<button class="btn-secondary" onclick={loadTrackingPixel}>
						Load Image
					</button>
					<p class="text-xs text-surface-500 mt-2">Simulates tracking pixel loading</p>
				</div>
				
				<!-- External Script -->
				<div>
					<p class="text-sm font-medium text-surface-700 mb-2">External Script Loading</p>
					<button class="btn-secondary" onclick={loadExternalScript}>
						Load External Script
					</button>
					<p class="text-xs text-surface-500 mt-2">Loads lodash from CDN</p>
				</div>
			</div>
		</div>
	</div>
	
	<!-- CORS Test Section -->
	<div class="card p-6 mt-6">
		<h3 class="section-subtitle flex items-center gap-2">
			<span>🔒</span>
			Common API Endpoints for Testing
		</h3>
		<p class="text-surface-600 text-sm mb-4">
			Quick-access buttons to test various public APIs.
		</p>
		
		<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
			<button 
				class="btn-secondary text-sm"
				onclick={() => { fetchUrl = 'https://jsonplaceholder.typicode.com/posts/1'; makeFetchRequest(); }}
			>
				JSONPlaceholder
			</button>
			<button 
				class="btn-secondary text-sm"
				onclick={() => { fetchUrl = 'https://api.github.com/users/github'; makeFetchRequest(); }}
			>
				GitHub API
			</button>
			<button 
				class="btn-secondary text-sm"
				onclick={() => { fetchUrl = 'https://httpbin.org/get'; makeFetchRequest(); }}
			>
				HTTPBin GET
			</button>
			<button 
				class="btn-secondary text-sm"
				onclick={() => { fetchUrl = 'https://api.ipify.org?format=json'; makeFetchRequest(); }}
			>
				Get IP Address
			</button>
		</div>
	</div>

	<!-- Activity Log -->
	<div class="card p-6 mt-6">
		<div class="flex items-center justify-between mb-4">
			<h3 class="section-subtitle flex items-center gap-2 mb-0">
				<span>📟</span>
				Network Activity Log
			</h3>
			<button class="btn-secondary text-sm" onclick={clearLogs}>
				Clear
			</button>
		</div>
		
		<div class="bg-surface-900 rounded-lg overflow-hidden">
			<div class="p-4 font-mono text-sm text-green-400 max-h-48 overflow-y-auto">
				{#if logs.length === 0}
					<span class="text-surface-500">No network activity yet...</span>
				{:else}
					{#each logs as log}
						<div class="mb-1">{log}</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</PageHeader>

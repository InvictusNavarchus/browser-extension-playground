<script lang="ts">
	import { PageHeader } from '$lib';
	import { browser } from '$app/environment';
	
	let logs = $state<string[]>([]);
	
	// LocalStorage
	let localKey = $state('testKey');
	let localValue = $state('testValue');
	let localStorageItems = $state<{key: string; value: string}[]>([]);
	
	// SessionStorage
	let sessionKey = $state('sessionKey');
	let sessionValue = $state('sessionValue');
	let sessionStorageItems = $state<{key: string; value: string}[]>([]);
	
	// Cookies
	let cookieName = $state('testCookie');
	let cookieValue = $state('cookieValue');
	let cookieExpiry = $state(7);
	let cookiesList = $state<{name: string; value: string}[]>([]);
	
	// IndexedDB
	let idbKey = $state('idb-key');
	let idbValue = $state('idb-value');
	let idbItems = $state<{key: string; value: string}[]>([]);
	
	function log(message: string) {
		logs = [...logs, `[${new Date().toLocaleTimeString()}] ${message}`];
	}
	
	function clearLogs() {
		logs = [];
	}

	// LocalStorage functions
	function setLocalStorage() {
		if (browser) {
			localStorage.setItem(localKey, localValue);
			log(`localStorage.setItem('${localKey}', '${localValue}')`);
			refreshLocalStorage();
		}
	}
	
	function getLocalStorage() {
		if (browser) {
			const value = localStorage.getItem(localKey);
			log(`localStorage.getItem('${localKey}') = '${value}'`);
		}
	}
	
	function removeLocalStorage() {
		if (browser) {
			localStorage.removeItem(localKey);
			log(`localStorage.removeItem('${localKey}')`);
			refreshLocalStorage();
		}
	}
	
	function clearLocalStorage() {
		if (browser) {
			localStorage.clear();
			log('localStorage.clear()');
			refreshLocalStorage();
		}
	}
	
	function refreshLocalStorage() {
		if (browser) {
			const items: {key: string; value: string}[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key) {
					items.push({ key, value: localStorage.getItem(key) || '' });
				}
			}
			localStorageItems = items;
		}
	}
	
	// SessionStorage functions
	function setSessionStorage() {
		if (browser) {
			sessionStorage.setItem(sessionKey, sessionValue);
			log(`sessionStorage.setItem('${sessionKey}', '${sessionValue}')`);
			refreshSessionStorage();
		}
	}
	
	function getSessionStorage() {
		if (browser) {
			const value = sessionStorage.getItem(sessionKey);
			log(`sessionStorage.getItem('${sessionKey}') = '${value}'`);
		}
	}
	
	function removeSessionStorage() {
		if (browser) {
			sessionStorage.removeItem(sessionKey);
			log(`sessionStorage.removeItem('${sessionKey}')`);
			refreshSessionStorage();
		}
	}
	
	function clearSessionStorage() {
		if (browser) {
			sessionStorage.clear();
			log('sessionStorage.clear()');
			refreshSessionStorage();
		}
	}
	
	function refreshSessionStorage() {
		if (browser) {
			const items: {key: string; value: string}[] = [];
			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i);
				if (key) {
					items.push({ key, value: sessionStorage.getItem(key) || '' });
				}
			}
			sessionStorageItems = items;
		}
	}
	
	// Cookie functions
	function setCookie() {
		if (browser) {
			const date = new Date();
			date.setTime(date.getTime() + (cookieExpiry * 24 * 60 * 60 * 1000));
			document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)};expires=${date.toUTCString()};path=/`;
			log(`Set cookie: ${cookieName}=${cookieValue} (expires in ${cookieExpiry} days)`);
			refreshCookies();
		}
	}
	
	function deleteCookie() {
		if (browser) {
			document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
			log(`Deleted cookie: ${cookieName}`);
			refreshCookies();
		}
	}
	
	function refreshCookies() {
		if (browser) {
			const cookies: {name: string; value: string}[] = [];
			document.cookie.split(';').forEach(cookie => {
				const [name, value] = cookie.trim().split('=');
				if (name) {
					cookies.push({ name, value: decodeURIComponent(value || '') });
				}
			});
			cookiesList = cookies;
		}
	}
	
	// IndexedDB functions
	let db: IDBDatabase | null = null;
	const DB_NAME = 'ExtensionLabDB';
	const STORE_NAME = 'testStore';
	
	function openDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, 1);
			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result);
			request.onupgradeneeded = (event) => {
				const database = (event.target as IDBOpenDBRequest).result;
				if (!database.objectStoreNames.contains(STORE_NAME)) {
					database.createObjectStore(STORE_NAME, { keyPath: 'key' });
				}
			};
		});
	}
	
	async function setIndexedDB() {
		if (browser) {
			try {
				db = await openDB();
				const transaction = db.transaction(STORE_NAME, 'readwrite');
				const store = transaction.objectStore(STORE_NAME);
				store.put({ key: idbKey, value: idbValue });
				log(`IndexedDB: Set '${idbKey}' = '${idbValue}'`);
				await refreshIndexedDB();
			} catch (error) {
				log(`IndexedDB error: ${error}`);
			}
		}
	}
	
	async function getIndexedDB() {
		if (browser) {
			try {
				db = await openDB();
				const transaction = db.transaction(STORE_NAME, 'readonly');
				const store = transaction.objectStore(STORE_NAME);
				const request = store.get(idbKey);
				request.onsuccess = () => {
					const result = request.result;
					log(`IndexedDB: Get '${idbKey}' = '${result?.value || 'not found'}'`);
				};
			} catch (error) {
				log(`IndexedDB error: ${error}`);
			}
		}
	}
	
	async function deleteIndexedDB() {
		if (browser) {
			try {
				db = await openDB();
				const transaction = db.transaction(STORE_NAME, 'readwrite');
				const store = transaction.objectStore(STORE_NAME);
				store.delete(idbKey);
				log(`IndexedDB: Deleted '${idbKey}'`);
				await refreshIndexedDB();
			} catch (error) {
				log(`IndexedDB error: ${error}`);
			}
		}
	}
	
	async function clearIndexedDB() {
		if (browser) {
			try {
				db = await openDB();
				const transaction = db.transaction(STORE_NAME, 'readwrite');
				const store = transaction.objectStore(STORE_NAME);
				store.clear();
				log('IndexedDB: Cleared all items');
				await refreshIndexedDB();
			} catch (error) {
				log(`IndexedDB error: ${error}`);
			}
		}
	}
	
	async function refreshIndexedDB() {
		if (browser) {
			try {
				db = await openDB();
				const transaction = db.transaction(STORE_NAME, 'readonly');
				const store = transaction.objectStore(STORE_NAME);
				const request = store.getAll();
				request.onsuccess = () => {
					idbItems = request.result.map((item: {key: string; value: string}) => ({
						key: item.key,
						value: item.value
					}));
				};
			} catch (error) {
				log(`IndexedDB error: ${error}`);
			}
		}
	}
	
	// Initialize on mount
	$effect(() => {
		if (browser) {
			refreshLocalStorage();
			refreshSessionStorage();
			refreshCookies();
			refreshIndexedDB();
		}
	});
</script>

<PageHeader 
	title="Storage APIs" 
	description="Test localStorage, sessionStorage, IndexedDB, and cookie manipulation."
>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- LocalStorage -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>📦</span>
				LocalStorage
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test persistent browser storage that survives page reloads.
			</p>
			
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label for="local-key" class="label">Key</label>
						<input 
							id="local-key"
							type="text" 
							class="input" 
							bind:value={localKey}
							data-testid="local-key"
						/>
					</div>
					<div>
						<label for="local-value" class="label">Value</label>
						<input 
							id="local-value"
							type="text" 
							class="input" 
							bind:value={localValue}
							data-testid="local-value"
						/>
					</div>
				</div>
				
				<div class="flex flex-wrap gap-2">
					<button class="btn-primary" onclick={setLocalStorage}>Set</button>
					<button class="btn-secondary" onclick={getLocalStorage}>Get</button>
					<button class="btn-danger" onclick={removeLocalStorage}>Remove</button>
					<button class="btn-danger" onclick={clearLocalStorage}>Clear All</button>
				</div>
				
				<div class="bg-surface-100 rounded-lg p-4 max-h-40 overflow-y-auto">
					<p class="text-xs text-surface-500 mb-2">Current Items ({localStorageItems.length}):</p>
					{#if localStorageItems.length === 0}
						<p class="text-surface-400 text-sm">No items</p>
					{:else}
						{#each localStorageItems as item}
							<div class="text-sm font-mono">
								<span class="text-primary-600">{item.key}</span>: <span class="text-surface-600">{item.value}</span>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
		
		<!-- SessionStorage -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>🗃️</span>
				SessionStorage
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test session-based storage that clears when the tab closes.
			</p>
			
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label for="session-key" class="label">Key</label>
						<input 
							id="session-key"
							type="text" 
							class="input" 
							bind:value={sessionKey}
							data-testid="session-key"
						/>
					</div>
					<div>
						<label for="session-value" class="label">Value</label>
						<input 
							id="session-value"
							type="text" 
							class="input" 
							bind:value={sessionValue}
							data-testid="session-value"
						/>
					</div>
				</div>
				
				<div class="flex flex-wrap gap-2">
					<button class="btn-primary" onclick={setSessionStorage}>Set</button>
					<button class="btn-secondary" onclick={getSessionStorage}>Get</button>
					<button class="btn-danger" onclick={removeSessionStorage}>Remove</button>
					<button class="btn-danger" onclick={clearSessionStorage}>Clear All</button>
				</div>
				
				<div class="bg-surface-100 rounded-lg p-4 max-h-40 overflow-y-auto">
					<p class="text-xs text-surface-500 mb-2">Current Items ({sessionStorageItems.length}):</p>
					{#if sessionStorageItems.length === 0}
						<p class="text-surface-400 text-sm">No items</p>
					{:else}
						{#each sessionStorageItems as item}
							<div class="text-sm font-mono">
								<span class="text-primary-600">{item.key}</span>: <span class="text-surface-600">{item.value}</span>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
		
		<!-- Cookies -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>🍪</span>
				Cookies
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test cookie creation, reading, and deletion.
			</p>
			
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label for="cookie-name" class="label">Name</label>
						<input 
							id="cookie-name"
							type="text" 
							class="input" 
							bind:value={cookieName}
							data-testid="cookie-name"
						/>
					</div>
					<div>
						<label for="cookie-value" class="label">Value</label>
						<input 
							id="cookie-value"
							type="text" 
							class="input" 
							bind:value={cookieValue}
							data-testid="cookie-value"
						/>
					</div>
				</div>
				
				<div>
					<label for="cookie-expiry" class="label">Expiry (days)</label>
					<input 
						id="cookie-expiry"
						type="number" 
						class="input w-24" 
						min="1"
						max="365"
						bind:value={cookieExpiry}
					/>
				</div>
				
				<div class="flex flex-wrap gap-2">
					<button class="btn-primary" onclick={setCookie}>Set Cookie</button>
					<button class="btn-danger" onclick={deleteCookie}>Delete Cookie</button>
					<button class="btn-secondary" onclick={refreshCookies}>Refresh</button>
				</div>
				
				<div class="bg-surface-100 rounded-lg p-4 max-h-40 overflow-y-auto">
					<p class="text-xs text-surface-500 mb-2">Current Cookies ({cookiesList.length}):</p>
					{#if cookiesList.length === 0}
						<p class="text-surface-400 text-sm">No cookies</p>
					{:else}
						{#each cookiesList as cookie}
							<div class="text-sm font-mono">
								<span class="text-primary-600">{cookie.name}</span>: <span class="text-surface-600">{cookie.value}</span>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
		
		<!-- IndexedDB -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>🗄️</span>
				IndexedDB
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test IndexedDB for complex data storage.
			</p>
			
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-2">
					<div>
						<label for="idb-key" class="label">Key</label>
						<input 
							id="idb-key"
							type="text" 
							class="input" 
							bind:value={idbKey}
							data-testid="idb-key"
						/>
					</div>
					<div>
						<label for="idb-value" class="label">Value</label>
						<input 
							id="idb-value"
							type="text" 
							class="input" 
							bind:value={idbValue}
							data-testid="idb-value"
						/>
					</div>
				</div>
				
				<div class="flex flex-wrap gap-2">
					<button class="btn-primary" onclick={setIndexedDB}>Set</button>
					<button class="btn-secondary" onclick={getIndexedDB}>Get</button>
					<button class="btn-danger" onclick={deleteIndexedDB}>Delete</button>
					<button class="btn-danger" onclick={clearIndexedDB}>Clear All</button>
				</div>
				
				<div class="bg-surface-100 rounded-lg p-4 max-h-40 overflow-y-auto">
					<p class="text-xs text-surface-500 mb-2">Current Items ({idbItems.length}):</p>
					{#if idbItems.length === 0}
						<p class="text-surface-400 text-sm">No items</p>
					{:else}
						{#each idbItems as item}
							<div class="text-sm font-mono">
								<span class="text-primary-600">{item.key}</span>: <span class="text-surface-600">{item.value}</span>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Activity Log -->
	<div class="card p-6 mt-6">
		<div class="flex items-center justify-between mb-4">
			<h3 class="section-subtitle flex items-center gap-2 mb-0">
				<span>📟</span>
				Storage Activity Log
			</h3>
			<button class="btn-secondary text-sm" onclick={clearLogs}>
				Clear
			</button>
		</div>
		
		<div class="bg-surface-900 rounded-lg overflow-hidden">
			<div class="p-4 font-mono text-sm text-green-400 max-h-48 overflow-y-auto">
				{#if logs.length === 0}
					<span class="text-surface-500">No storage activity yet...</span>
				{:else}
					{#each logs as log}
						<div class="mb-1">{log}</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</PageHeader>

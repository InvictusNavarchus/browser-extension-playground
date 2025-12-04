<script lang="ts">
	import { PageHeader, TestSection } from '$lib';

	let logs = $state<string[]>([]);

	function log(message: string) {
		logs = [...logs, `[${new Date().toLocaleTimeString()}] ${message}`];
	}

	function clearLogs() {
		logs = [];
	}

	// Basic Login Form
	let loginEmail = $state('');
	let loginPassword = $state('');
	let loginRemember = $state(false);

	function handleLogin(e: Event) {
		e.preventDefault();
		log(`Login attempt: email="${loginEmail}", remember=${loginRemember}`);
		// Simulate login
		setTimeout(() => {
			log('Login successful (simulated)');
		}, 500);
	}

	// Registration Form
	let regName = $state('');
	let regEmail = $state('');
	let regPassword = $state('');
	let regConfirmPassword = $state('');
	let regTerms = $state(false);

	function handleRegister(e: Event) {
		e.preventDefault();
		if (regPassword !== regConfirmPassword) {
			log('Registration error: Passwords do not match');
			return;
		}
		log(`Registration attempt: name="${regName}", email="${regEmail}"`);
		setTimeout(() => {
			log('Registration successful (simulated)');
		}, 500);
	}

	// OAuth Simulation
	const oauthProviders = [
		{ name: 'Google', color: 'bg-red-600', icon: '🔴' },
		{ name: 'Facebook', color: 'bg-blue-600', icon: '🔵' },
		{ name: 'GitHub', color: 'bg-gray-800', icon: '⚫' },
		{ name: 'Twitter', color: 'bg-sky-500', icon: '🐦' },
		{ name: 'Microsoft', color: 'bg-blue-500', icon: '🟦' },
		{ name: 'Apple', color: 'bg-black', icon: '🍎' }
	];

	function handleOAuthLogin(provider: string) {
		log(`OAuth login initiated: ${provider}`);
		// Simulate OAuth popup
		const popup = window.open(
			'about:blank',
			'oauth-popup',
			'width=500,height=600,left=100,top=100'
		);
		if (popup) {
			popup.document.write(`
				<html>
					<head><title>${provider} Login</title></head>
					<body style="font-family: sans-serif; padding: 20px; text-align: center;">
						<h2>Simulated ${provider} OAuth</h2>
						<p>This would normally be the ${provider} login page.</p>
						<button onclick="window.opener.postMessage({type:'oauth-success',provider:'${provider}'},window.location.origin);window.close();">
							Simulate Success
						</button>
						<button onclick="window.close();">Cancel</button>
					</body>
				</html>
			`);
			log(`OAuth popup opened for ${provider}`);
		} else {
			log('Popup blocked by browser');
		}
	}

	// Listen for OAuth callback
	$effect(() => {
		const handler = (e: MessageEvent) => {
			if (e.data?.type === 'oauth-success') {
				log(`OAuth success callback received from ${e.data.provider}`);
			}
		};
		window.addEventListener('message', handler);
		return () => window.removeEventListener('message', handler);
	});

	// Two-Factor Authentication
	let tfaCode = $state('');
	let tfaMethod = $state<'totp' | 'sms' | 'email'>('totp');

	function handleTfaVerify(e: Event) {
		e.preventDefault();
		log(`2FA verification: method=${tfaMethod}, code=${tfaCode}`);
		if (tfaCode.length === 6) {
			setTimeout(() => log('2FA verification successful (simulated)'), 500);
		} else {
			log('2FA code must be 6 digits');
		}
	}

	function requestTfaCode() {
		log(`Requesting new ${tfaMethod.toUpperCase()} code...`);
		setTimeout(() => log(`${tfaMethod.toUpperCase()} code sent (simulated)`), 1000);
	}

	// Session Management
	interface Session {
		id: string;
		device: string;
		location: string;
		lastActive: string;
		current: boolean;
	}

	let sessions = $state<Session[]>([
		{ id: '1', device: 'Chrome on Windows', location: 'New York, US', lastActive: 'Now', current: true },
		{ id: '2', device: 'Safari on iPhone', location: 'Los Angeles, US', lastActive: '2 hours ago', current: false },
		{ id: '3', device: 'Firefox on Linux', location: 'London, UK', lastActive: '1 day ago', current: false }
	]);

	function revokeSession(sessionId: string) {
		sessions = sessions.filter((s) => s.id !== sessionId);
		log(`Session revoked: ${sessionId}`);
	}

	function revokeAllSessions() {
		const currentSession = sessions.find((s) => s.current);
		sessions = currentSession ? [currentSession] : [];
		log('All other sessions revoked');
	}

	// Password Reset
	let resetEmail = $state('');

	function handlePasswordReset(e: Event) {
		e.preventDefault();
		log(`Password reset requested for: ${resetEmail}`);
		setTimeout(() => log('Password reset email sent (simulated)'), 500);
	}

	// Credentials API
	let credUsername = $state('');
	let credPassword = $state('');

	async function storeCredential() {
		if (!('credentials' in navigator)) {
			log('Credentials API not supported');
			return;
		}

		try {
			// @ts-expect-error - PasswordCredential may not be in all TS environments
			const cred = new window.PasswordCredential({
				id: credUsername,
				password: credPassword,
				name: credUsername
			});
			await navigator.credentials.store(cred);
			log(`Credential stored for: ${credUsername}`);
		} catch (err) {
			log(`Credential storage error: ${err}`);
		}
	}

	async function getCredential() {
		if (!('credentials' in navigator)) {
			log('Credentials API not supported');
			return;
		}

		try {
			const cred = await navigator.credentials.get({
				// @ts-expect-error - password option may not be in TS types
				password: true,
				mediation: 'optional'
			});
			if (cred) {
				log(`Retrieved credential: ${cred.id} (type: ${cred.type})`);
			} else {
				log('No credential retrieved');
			}
		} catch (err) {
			log(`Credential retrieval error: ${err}`);
		}
	}

	// WebAuthn / Passkeys
	async function registerPasskey() {
		if (!('credentials' in navigator) || !('PublicKeyCredential' in window)) {
			log('WebAuthn not supported');
			return;
		}

		try {
			const challenge = new Uint8Array(32);
			crypto.getRandomValues(challenge);

			const createOptions: CredentialCreationOptions = {
				publicKey: {
					challenge,
					rp: {
						name: 'Browser Extension Playground',
						id: window.location.hostname
					},
					user: {
						id: new Uint8Array(16),
						name: 'test@example.com',
						displayName: 'Test User'
					},
					pubKeyCredParams: [
						{ type: 'public-key', alg: -7 },
						{ type: 'public-key', alg: -257 }
					],
					authenticatorSelection: {
						authenticatorAttachment: 'platform',
						userVerification: 'preferred',
						residentKey: 'preferred'
					},
					timeout: 60000
				}
			};

			const credential = await navigator.credentials.create(createOptions);
			if (credential) {
				log(`Passkey registered: ${credential.id.substring(0, 20)}...`);
			}
		} catch (err) {
			log(`Passkey registration error: ${err}`);
		}
	}

	async function authenticateWithPasskey() {
		if (!('credentials' in navigator) || !('PublicKeyCredential' in window)) {
			log('WebAuthn not supported');
			return;
		}

		try {
			const challenge = new Uint8Array(32);
			crypto.getRandomValues(challenge);

			const getOptions: CredentialRequestOptions = {
				publicKey: {
					challenge,
					timeout: 60000,
					userVerification: 'preferred',
					rpId: window.location.hostname
				}
			};

			const credential = await navigator.credentials.get(getOptions);
			if (credential) {
				log(`Passkey authentication successful: ${credential.id.substring(0, 20)}...`);
			}
		} catch (err) {
			log(`Passkey authentication error: ${err}`);
		}
	}

	// JWT Token Display
	let jwtToken = $state(
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
	);

	function decodeJwt() {
		try {
			const parts = jwtToken.split('.');
			if (parts.length !== 3) {
				log('Invalid JWT format');
				return;
			}
			const header = JSON.parse(atob(parts[0]));
			const payload = JSON.parse(atob(parts[1]));
			log(`JWT Header: ${JSON.stringify(header)}`);
			log(`JWT Payload: ${JSON.stringify(payload)}`);
		} catch {
			log('Failed to decode JWT');
		}
	}
</script>

<PageHeader title="Authentication" description="Test login forms, OAuth flows, credentials API, and session management">
	<button class="btn btn-secondary text-sm" onclick={clearLogs}>Clear Logs</button>
</PageHeader>

<div class="space-y-6">
	<!-- Basic Login Form -->
	<TestSection title="Login Form" description="Standard email/password login with autocomplete attributes">
		<form onsubmit={handleLogin} class="max-w-md space-y-4">
			<div>
				<label for="login-email" class="label">Email</label>
				<input
					id="login-email"
					type="email"
					class="input"
					autocomplete="email"
					bind:value={loginEmail}
					placeholder="user@example.com"
					required
				/>
			</div>
			<div>
				<label for="login-password" class="label">Password</label>
				<input
					id="login-password"
					type="password"
					class="input"
					autocomplete="current-password"
					bind:value={loginPassword}
					placeholder="••••••••"
					required
				/>
			</div>
			<label class="flex items-center gap-2">
				<input type="checkbox" bind:checked={loginRemember} class="rounded" />
				<span class="text-sm">Remember me</span>
			</label>
			<div class="flex gap-2">
				<button type="submit" class="btn btn-primary">Sign In</button>
				<a href="#reset" class="btn btn-secondary">Forgot Password?</a>
			</div>
		</form>
	</TestSection>

	<!-- Registration Form -->
	<TestSection title="Registration Form" description="User registration with password confirmation">
		<form onsubmit={handleRegister} class="max-w-md space-y-4">
			<div>
				<label for="reg-name" class="label">Full Name</label>
				<input
					id="reg-name"
					type="text"
					class="input"
					autocomplete="name"
					bind:value={regName}
					placeholder="John Doe"
					required
				/>
			</div>
			<div>
				<label for="reg-email" class="label">Email</label>
				<input
					id="reg-email"
					type="email"
					class="input"
					autocomplete="email"
					bind:value={regEmail}
					placeholder="user@example.com"
					required
				/>
			</div>
			<div>
				<label for="reg-password" class="label">Password</label>
				<input
					id="reg-password"
					type="password"
					class="input"
					autocomplete="new-password"
					bind:value={regPassword}
					placeholder="••••••••"
					minlength="8"
					required
				/>
			</div>
			<div>
				<label for="reg-confirm" class="label">Confirm Password</label>
				<input
					id="reg-confirm"
					type="password"
					class="input"
					autocomplete="new-password"
					bind:value={regConfirmPassword}
					placeholder="••••••••"
					required
				/>
			</div>
			<label class="flex items-center gap-2">
				<input type="checkbox" bind:checked={regTerms} required class="rounded" />
				<span class="text-sm">I agree to the Terms of Service</span>
			</label>
			<button type="submit" class="btn btn-primary">Create Account</button>
		</form>
	</TestSection>

	<!-- OAuth Providers -->
	<TestSection title="OAuth / Social Login" description="Simulate OAuth authentication flows">
		<div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
			{#each oauthProviders as provider}
				<button class="btn {provider.color} text-white" onclick={() => handleOAuthLogin(provider.name)}>
					<span class="mr-2">{provider.icon}</span>
					Sign in with {provider.name}
				</button>
			{/each}
		</div>
	</TestSection>

	<!-- Two-Factor Authentication -->
	<TestSection title="Two-Factor Authentication" description="Test 2FA verification flows">
		<form onsubmit={handleTfaVerify} class="max-w-md space-y-4">
			<div>
				<span class="label">2FA Method</span>
				<div class="flex gap-4">
					<label class="flex items-center gap-2">
						<input type="radio" name="tfa-method" value="totp" bind:group={tfaMethod} />
						<span class="text-sm">Authenticator App</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="radio" name="tfa-method" value="sms" bind:group={tfaMethod} />
						<span class="text-sm">SMS</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="radio" name="tfa-method" value="email" bind:group={tfaMethod} />
						<span class="text-sm">Email</span>
					</label>
				</div>
			</div>
			<div>
				<label for="tfa-code" class="label">Verification Code</label>
				<div class="flex gap-2">
					<input
						id="tfa-code"
						type="text"
						class="input"
						autocomplete="one-time-code"
						bind:value={tfaCode}
						placeholder="123456"
						maxlength="6"
						pattern="[0-9]{6}"
						required
					/>
					<button type="button" class="btn btn-secondary" onclick={requestTfaCode}>
						Resend Code
					</button>
				</div>
			</div>
			<button type="submit" class="btn btn-primary">Verify</button>
		</form>
	</TestSection>

	<!-- Session Management -->
	<TestSection title="Session Management" description="View and manage active sessions">
		<div class="space-y-4">
			<div class="space-y-2">
				{#each sessions as session}
					<div class="flex items-center justify-between rounded-lg bg-surface-100 p-3 dark:bg-surface-800">
						<div>
							<div class="flex items-center gap-2">
								<span class="font-medium">{session.device}</span>
								{#if session.current}
									<span class="badge-success">Current</span>
								{/if}
							</div>
							<div class="text-sm text-surface-500">
								{session.location} • {session.lastActive}
							</div>
						</div>
						{#if !session.current}
							<button class="btn btn-secondary text-sm" onclick={() => revokeSession(session.id)}>Revoke</button>
						{/if}
					</div>
				{/each}
			</div>
			<button class="btn btn-secondary" onclick={revokeAllSessions}>Revoke All Other Sessions</button>
		</div>
	</TestSection>

	<!-- Password Reset -->
	<TestSection title="Password Reset" description="Request password reset email">
		<form id="reset" onsubmit={handlePasswordReset} class="max-w-md space-y-4">
			<div>
				<label for="reset-email" class="label">Email Address</label>
				<input
					id="reset-email"
					type="email"
					class="input"
					autocomplete="email"
					bind:value={resetEmail}
					placeholder="user@example.com"
					required
				/>
			</div>
			<button type="submit" class="btn btn-primary">Send Reset Link</button>
		</form>
	</TestSection>

	<!-- Credentials API -->
	<TestSection title="Credentials API" description="Test browser credential storage and retrieval">
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="space-y-3">
				<div>
					<label for="cred-username" class="label">Username</label>
					<input
						id="cred-username"
						type="text"
						class="input"
						bind:value={credUsername}
						placeholder="username"
					/>
				</div>
				<div>
					<label for="cred-password" class="label">Password</label>
					<input
						id="cred-password"
						type="password"
						class="input"
						bind:value={credPassword}
						placeholder="••••••••"
					/>
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<button class="btn btn-primary" onclick={storeCredential}>Store Credential</button>
				<button class="btn btn-secondary" onclick={getCredential}>Get Saved Credential</button>
			</div>
		</div>
	</TestSection>

	<!-- WebAuthn / Passkeys -->
	<TestSection title="WebAuthn / Passkeys" description="Test passwordless authentication with passkeys">
		<div class="flex flex-wrap gap-2">
			<button class="btn btn-primary" onclick={registerPasskey}>Register Passkey</button>
			<button class="btn btn-secondary" onclick={authenticateWithPasskey}>Sign in with Passkey</button>
		</div>
	</TestSection>

	<!-- JWT Token -->
	<TestSection title="JWT Token Decoder" description="Decode and inspect JWT tokens">
		<div class="space-y-3">
			<div>
				<label for="jwt-token" class="label">JWT Token</label>
				<textarea id="jwt-token" class="input h-24 font-mono text-xs" bind:value={jwtToken}></textarea>
			</div>
			<button class="btn btn-primary" onclick={decodeJwt}>Decode Token</button>
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

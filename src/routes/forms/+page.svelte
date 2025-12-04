<script lang="ts">
	import { PageHeader } from '$lib';
	
	let logs = $state<string[]>([]);
	
	// Form states
	let textValue = $state('');
	let emailValue = $state('');
	let passwordValue = $state('');
	let numberValue = $state(0);
	let rangeValue = $state(50);
	let dateValue = $state('');
	let timeValue = $state('');
	let colorValue = $state('#3b82f6');
	let searchValue = $state('');
	let urlValue = $state('');
	let telValue = $state('');
	let checkboxValue = $state(false);
	let radioValue = $state('option1');
	let selectValue = $state('');
	let multiSelectValue = $state<string[]>([]);
	let textareaValue = $state('');
	
	// Credit card form
	let cardNumber = $state('');
	let cardExpiry = $state('');
	let cardCVC = $state('');
	let cardName = $state('');
	
	// Login form
	let loginEmail = $state('');
	let loginPassword = $state('');
	let rememberMe = $state(false);
	
	// Registration form
	let regUsername = $state('');
	let regEmail = $state('');
	let regPassword = $state('');
	let regConfirmPassword = $state('');
	let acceptTerms = $state(false);
	
	function log(message: string) {
		logs = [...logs, `[${new Date().toLocaleTimeString()}] ${message}`];
	}
	
	function clearLogs() {
		logs = [];
	}
	
	function handleSubmit(formName: string) {
		log(`Form submitted: ${formName}`);
	}
	
	function formatCardNumber(value: string): string {
		return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
	}
	
	function handleCardNumberInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = input.value.replace(/\D/g, '').substring(0, 16);
		cardNumber = formatCardNumber(value);
	}
	
	function handleExpiryInput(e: Event) {
		const input = e.target as HTMLInputElement;
		let value = input.value.replace(/\D/g, '').substring(0, 4);
		if (value.length > 2) {
			value = value.substring(0, 2) + '/' + value.substring(2);
		}
		cardExpiry = value;
	}
</script>

<PageHeader 
	title="Forms & Inputs" 
	description="Test form filling, auto-complete, password management, and various input types."
>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- All Input Types -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>📝</span>
				Input Types Gallery
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test various HTML5 input types for auto-fill and form manipulation.
			</p>
			
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit('Input Gallery'); }} class="space-y-4">
				<div>
					<label for="text-input" class="label">Text Input</label>
					<input 
						id="text-input"
						type="text" 
						class="input" 
						placeholder="Enter text..."
						bind:value={textValue}
						autocomplete="name"
						data-testid="text-input"
					/>
				</div>
				
				<div>
					<label for="email-input" class="label">Email Input</label>
					<input 
						id="email-input"
						type="email" 
						class="input" 
						placeholder="email@example.com"
						bind:value={emailValue}
						autocomplete="email"
						data-testid="email-input"
					/>
				</div>
				
				<div>
					<label for="password-input" class="label">Password Input</label>
					<input 
						id="password-input"
						type="password" 
						class="input" 
						placeholder="••••••••"
						bind:value={passwordValue}
						autocomplete="new-password"
						data-testid="password-input"
					/>
				</div>
				
				<div>
					<label for="number-input" class="label">Number Input</label>
					<input 
						id="number-input"
						type="number" 
						class="input" 
						min="0"
						max="100"
						bind:value={numberValue}
						data-testid="number-input"
					/>
				</div>
				
				<div>
					<label for="range-input" class="label">Range Input: {rangeValue}</label>
					<input 
						id="range-input"
						type="range" 
						class="w-full" 
						min="0"
						max="100"
						bind:value={rangeValue}
						data-testid="range-input"
					/>
				</div>
				
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="date-input" class="label">Date Input</label>
						<input 
							id="date-input"
							type="date" 
							class="input" 
							bind:value={dateValue}
							data-testid="date-input"
						/>
					</div>
					<div>
						<label for="time-input" class="label">Time Input</label>
						<input 
							id="time-input"
							type="time" 
							class="input" 
							bind:value={timeValue}
							data-testid="time-input"
						/>
					</div>
				</div>
				
				<div>
					<label for="color-input" class="label">Color Input</label>
					<div class="flex gap-2 items-center">
						<input 
							id="color-input"
							type="color" 
							class="h-10 w-20 rounded cursor-pointer" 
							bind:value={colorValue}
							data-testid="color-input"
						/>
						<span class="text-sm text-surface-500">{colorValue}</span>
					</div>
				</div>
				
				<div>
					<label for="search-input" class="label">Search Input</label>
					<input 
						id="search-input"
						type="search" 
						class="input" 
						placeholder="Search..."
						bind:value={searchValue}
						data-testid="search-input"
					/>
				</div>
				
				<div>
					<label for="url-input" class="label">URL Input</label>
					<input 
						id="url-input"
						type="url" 
						class="input" 
						placeholder="https://example.com"
						bind:value={urlValue}
						autocomplete="url"
						data-testid="url-input"
					/>
				</div>
				
				<div>
					<label for="tel-input" class="label">Telephone Input</label>
					<input 
						id="tel-input"
						type="tel" 
						class="input" 
						placeholder="+1 (555) 000-0000"
						bind:value={telValue}
						autocomplete="tel"
						data-testid="tel-input"
					/>
				</div>
				
				<button type="submit" class="btn-primary w-full">Submit Input Gallery</button>
			</form>
		</div>
		
		<!-- Selection Inputs -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>☑️</span>
				Selection Inputs
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test checkboxes, radio buttons, and select elements.
			</p>
			
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit('Selection Form'); }} class="space-y-6">
				<!-- Checkbox -->
				<div>
					<p class="label">Checkbox</p>
					<label class="flex items-center gap-2 cursor-pointer">
						<input 
							type="checkbox" 
							class="w-4 h-4 rounded text-primary-600"
							bind:checked={checkboxValue}
							data-testid="checkbox-input"
						/>
						<span class="text-surface-700">I agree to the terms</span>
					</label>
				</div>
				
				<!-- Radio Buttons -->
				<div>
					<p class="label">Radio Buttons</p>
					<div class="space-y-2">
						{#each ['option1', 'option2', 'option3'] as option}
							<label class="flex items-center gap-2 cursor-pointer">
								<input 
									type="radio" 
									name="radio-group"
									value={option}
									class="w-4 h-4 text-primary-600"
									bind:group={radioValue}
									data-testid="radio-{option}"
								/>
								<span class="text-surface-700">Option {option.slice(-1)}</span>
							</label>
						{/each}
					</div>
				</div>
				
				<!-- Select -->
				<div>
					<label for="select-input" class="label">Select Dropdown</label>
					<select 
						id="select-input"
						class="input"
						bind:value={selectValue}
						data-testid="select-input"
					>
						<option value="">Choose an option...</option>
						<option value="opt1">Option 1</option>
						<option value="opt2">Option 2</option>
						<option value="opt3">Option 3</option>
						<option value="opt4">Option 4</option>
					</select>
				</div>
				
				<!-- Multi-select -->
				<div>
					<label for="multi-select" class="label">Multi-Select (Ctrl/Cmd + Click)</label>
					<select 
						id="multi-select"
						multiple
						class="input h-32"
						bind:value={multiSelectValue}
						data-testid="multi-select"
					>
						<option value="item1">Item 1</option>
						<option value="item2">Item 2</option>
						<option value="item3">Item 3</option>
						<option value="item4">Item 4</option>
						<option value="item5">Item 5</option>
					</select>
				</div>
				
				<!-- Textarea -->
				<div>
					<label for="textarea-input" class="label">Textarea</label>
					<textarea 
						id="textarea-input"
						class="input min-h-24"
						placeholder="Enter multiple lines of text..."
						bind:value={textareaValue}
						data-testid="textarea-input"
					></textarea>
				</div>
				
				<button type="submit" class="btn-primary w-full">Submit Selection Form</button>
			</form>
		</div>
		
		<!-- Login Form -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>🔐</span>
				Login Form
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Standard login form for password manager testing.
			</p>
			
			<form 
				onsubmit={(e) => { e.preventDefault(); handleSubmit('Login'); log(`Login attempt: ${loginEmail}`); }}
				class="space-y-4"
				autocomplete="on"
				data-form-type="login"
			>
				<div>
					<label for="login-email" class="label">Email Address</label>
					<input 
						id="login-email"
						type="email" 
						class="input" 
						placeholder="you@example.com"
						bind:value={loginEmail}
						autocomplete="email"
						required
						data-testid="login-email"
					/>
				</div>
				
				<div>
					<label for="login-password" class="label">Password</label>
					<input 
						id="login-password"
						type="password" 
						class="input" 
						placeholder="••••••••"
						bind:value={loginPassword}
						autocomplete="current-password"
						required
						data-testid="login-password"
					/>
				</div>
				
				<label class="flex items-center gap-2 cursor-pointer">
					<input 
						type="checkbox"
						class="w-4 h-4 rounded text-primary-600"
						bind:checked={rememberMe}
						data-testid="remember-me"
					/>
					<span class="text-surface-700 text-sm">Remember me</span>
				</label>
				
				<button type="submit" class="btn-primary w-full">Sign In</button>
				
				<div class="text-center text-sm">
					<a href="#forgot" class="text-primary-600 hover:underline">Forgot password?</a>
				</div>
			</form>
		</div>
		
		<!-- Registration Form -->
		<div class="card p-6">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>📋</span>
				Registration Form
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Account creation form for password generation testing.
			</p>
			
			<form 
				onsubmit={(e) => { e.preventDefault(); handleSubmit('Registration'); log(`Registration: ${regUsername}`); }}
				class="space-y-4"
				autocomplete="on"
				data-form-type="registration"
			>
				<div>
					<label for="reg-username" class="label">Username</label>
					<input 
						id="reg-username"
						type="text" 
						class="input" 
						placeholder="johndoe"
						bind:value={regUsername}
						autocomplete="username"
						required
						data-testid="reg-username"
					/>
				</div>
				
				<div>
					<label for="reg-email" class="label">Email Address</label>
					<input 
						id="reg-email"
						type="email" 
						class="input" 
						placeholder="you@example.com"
						bind:value={regEmail}
						autocomplete="email"
						required
						data-testid="reg-email"
					/>
				</div>
				
				<div>
					<label for="reg-password" class="label">Password</label>
					<input 
						id="reg-password"
						type="password" 
						class="input" 
						placeholder="Create a strong password"
						bind:value={regPassword}
						autocomplete="new-password"
						required
						minlength="8"
						data-testid="reg-password"
					/>
				</div>
				
				<div>
					<label for="reg-confirm" class="label">Confirm Password</label>
					<input 
						id="reg-confirm"
						type="password" 
						class="input" 
						placeholder="Confirm your password"
						bind:value={regConfirmPassword}
						autocomplete="new-password"
						required
						data-testid="reg-confirm"
					/>
				</div>
				
				<label class="flex items-start gap-2 cursor-pointer">
					<input 
						type="checkbox"
						class="w-4 h-4 rounded text-primary-600 mt-0.5"
						bind:checked={acceptTerms}
						required
						data-testid="accept-terms"
					/>
					<span class="text-surface-700 text-sm">I accept the Terms of Service and Privacy Policy</span>
				</label>
				
				<button type="submit" class="btn-primary w-full">Create Account</button>
			</form>
		</div>
		
		<!-- Credit Card Form -->
		<div class="card p-6 lg:col-span-2">
			<h3 class="section-subtitle flex items-center gap-2">
				<span>💳</span>
				Payment / Credit Card Form
			</h3>
			<p class="text-surface-600 text-sm mb-4">
				Test credit card form auto-fill and formatting.
			</p>
			
			<form 
				onsubmit={(e) => { e.preventDefault(); handleSubmit('Payment'); log('Payment form submitted'); }}
				class="max-w-md space-y-4"
				autocomplete="on"
				data-form-type="payment"
			>
				<div>
					<label for="card-name" class="label">Cardholder Name</label>
					<input 
						id="card-name"
						type="text" 
						class="input" 
						placeholder="John Doe"
						bind:value={cardName}
						autocomplete="cc-name"
						required
						data-testid="card-name"
					/>
				</div>
				
				<div>
					<label for="card-number" class="label">Card Number</label>
					<input 
						id="card-number"
						type="text" 
						class="input font-mono" 
						placeholder="1234 5678 9012 3456"
						value={cardNumber}
						oninput={handleCardNumberInput}
						autocomplete="cc-number"
						inputmode="numeric"
						required
						maxlength="19"
						data-testid="card-number"
					/>
				</div>
				
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="card-expiry" class="label">Expiry Date</label>
						<input 
							id="card-expiry"
							type="text" 
							class="input font-mono" 
							placeholder="MM/YY"
							value={cardExpiry}
							oninput={handleExpiryInput}
							autocomplete="cc-exp"
							inputmode="numeric"
							required
							maxlength="5"
							data-testid="card-expiry"
						/>
					</div>
					<div>
						<label for="card-cvc" class="label">CVC</label>
						<input 
							id="card-cvc"
							type="text" 
							class="input font-mono" 
							placeholder="123"
							bind:value={cardCVC}
							autocomplete="cc-csc"
							inputmode="numeric"
							required
							maxlength="4"
							data-testid="card-cvc"
						/>
					</div>
				</div>
				
				<button type="submit" class="btn-success w-full">
					💳 Pay Now
				</button>
			</form>
		</div>
	</div>

	<!-- Activity Log -->
	<div class="card p-6 mt-6">
		<div class="flex items-center justify-between mb-4">
			<h3 class="section-subtitle flex items-center gap-2 mb-0">
				<span>📟</span>
				Form Activity Log
			</h3>
			<button class="btn-secondary text-sm" onclick={clearLogs}>
				Clear
			</button>
		</div>
		
		<div class="bg-surface-900 rounded-lg overflow-hidden">
			<div class="p-4 font-mono text-sm text-green-400 max-h-48 overflow-y-auto">
				{#if logs.length === 0}
					<span class="text-surface-500">No form activity yet...</span>
				{:else}
					{#each logs as log}
						<div class="mb-1">{log}</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</PageHeader>

# Authentication Guide

The Authentication page provides comprehensive testing for login flows, credential management, and authentication-related extension features.

## Overview

**Route**: `/auth`

Test your extension's ability to interact with login forms, OAuth flows, credential storage, and modern authentication methods like WebAuthn.

## Test Sections

### 1. Login Form

Standard email/password login form.

**Fields:**
- Email input (`autocomplete="email"`)
- Password input (`autocomplete="current-password"`)
- "Remember me" checkbox
- Submit button
- Forgot password link

**How to Use:**
1. Fill in credentials
2. Toggle "Remember me"
3. Click "Sign In"
4. View submission in console

**Extension Testing:**
```javascript
// Detect login forms
function findLoginForms() {
  const forms = document.querySelectorAll('form');
  return Array.from(forms).filter(form => {
    const hasPassword = form.querySelector('input[type="password"]');
    const hasEmail = form.querySelector('input[type="email"]') || 
                     form.querySelector('input[autocomplete*="username"]');
    return hasPassword && hasEmail;
  });
}

// Monitor login submissions
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    const password = form.querySelector('input[type="password"]');
    if (password) {
      console.log('Login form submitted');
      // Extension can offer to save credentials
    }
  });
});
```

### 2. Registration Form

New user registration form.

**Fields:**
- Full name (`autocomplete="name"`)
- Email (`autocomplete="email"`)
- Password (`autocomplete="new-password"`)
- Confirm password
- Terms acceptance checkbox

**How to Use:**
1. Fill in all fields
2. Ensure passwords match
3. Accept terms
4. Click "Create Account"

**Extension Testing:**
```javascript
// Password strength checker
function checkPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  return { score, checks };
}

// Monitor new password fields
document.querySelectorAll('input[autocomplete="new-password"]').forEach(input => {
  input.addEventListener('input', () => {
    const strength = checkPasswordStrength(input.value);
    console.log('Password strength:', strength);
  });
});
```

### 3. OAuth / Social Login

Simulate OAuth authentication flows.

**Providers Tested:**
- Google
- Facebook
- GitHub
- Twitter
- Microsoft
- Apple

**How to Use:**
1. Click a provider button
2. OAuth popup opens (simulated)
3. Complete simulated auth flow
4. View callback in console

**Extension Testing:**
```javascript
// Intercept OAuth redirects
const oauthDomains = [
  'accounts.google.com',
  'facebook.com/dialog/oauth',
  'github.com/login/oauth',
  'api.twitter.com/oauth',
  'login.microsoftonline.com',
  'appleid.apple.com'
];

// Monitor for OAuth windows
const originalOpen = window.open;
window.open = function(url, ...args) {
  if (url && oauthDomains.some(d => url.includes(d))) {
    console.log('OAuth flow detected:', url);
  }
  return originalOpen.call(window, url, ...args);
};

// Listen for OAuth callbacks
window.addEventListener('message', (e) => {
  if (e.data?.type?.includes('oauth')) {
    console.log('OAuth callback:', e.data);
  }
});
```

### 4. Two-Factor Authentication

Test 2FA verification flows.

**Methods:**
- TOTP (Authenticator app)
- SMS
- Email

**How to Use:**
1. Select 2FA method
2. Enter 6-digit code
3. Click "Verify"
4. Request new code if needed

**Extension Testing:**
```javascript
// Detect OTP fields
function findOTPFields() {
  return document.querySelectorAll([
    'input[autocomplete="one-time-code"]',
    'input[name*="otp"]',
    'input[name*="2fa"]',
    'input[name*="code"]',
    'input[maxlength="6"][type="text"]'
  ].join(','));
}

// Auto-fill OTP from SMS (Android)
if ('OTPCredential' in window) {
  navigator.credentials.get({
    otp: { transport: ['sms'] }
  }).then(otp => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (input) input.value = otp.code;
  });
}
```

### 5. Session Management

View and manage active sessions.

**Features:**
- List active sessions
- Current session indicator
- Device and location info
- Revoke individual sessions
- Revoke all other sessions

**How to Use:**
1. View session list
2. Click "Revoke" on any session
3. Click "Revoke All Other Sessions"

**Extension Testing:**
```javascript
// Extensions can help users manage sessions
class SessionManager {
  constructor() {
    this.sessions = [];
  }
  
  async fetchSessions() {
    // Would normally fetch from API
    return this.sessions;
  }
  
  async revokeSession(sessionId) {
    console.log('Revoking session:', sessionId);
    // API call to revoke
  }
  
  getCurrentSession() {
    return this.sessions.find(s => s.current);
  }
}
```

### 6. Password Reset

Test password reset flow.

**How to Use:**
1. Enter email address
2. Click "Send Reset Link"
3. View confirmation in console

### 7. Credentials API

Browser-native credential storage.

**Features:**
- Store username/password
- Retrieve saved credentials
- Credential picker UI

**How to Use:**
1. Enter username and password
2. Click "Store Credential"
3. Click "Get Saved Credential" to retrieve

**Extension Testing:**
```javascript
// Store credentials
async function storeCredential(username, password) {
  if (!('credentials' in navigator)) return false;
  
  const cred = new PasswordCredential({
    id: username,
    password: password,
    name: username
  });
  
  await navigator.credentials.store(cred);
  return true;
}

// Retrieve credentials
async function getCredential() {
  if (!('credentials' in navigator)) return null;
  
  return await navigator.credentials.get({
    password: true,
    mediation: 'optional' // 'silent', 'optional', or 'required'
  });
}

// Auto-fill on page load
window.addEventListener('load', async () => {
  const cred = await getCredential();
  if (cred) {
    document.querySelector('#username').value = cred.id;
    document.querySelector('#password').value = cred.password;
  }
});
```

### 8. WebAuthn / Passkeys

Modern passwordless authentication.

**Features:**
- Register new passkey
- Authenticate with passkey
- Platform authenticator (fingerprint/face)
- Security key support

**How to Use:**
1. Click "Register Passkey"
2. Complete biometric/security key prompt
3. Click "Sign in with Passkey" to authenticate

**Extension Testing:**
```javascript
// Register passkey
async function registerPasskey() {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: {
        name: 'My Extension',
        id: location.hostname
      },
      user: {
        id: new Uint8Array(16),
        name: 'user@example.com',
        displayName: 'User'
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },  // ES256
        { type: 'public-key', alg: -257 } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        residentKey: 'preferred'
      },
      timeout: 60000
    }
  });
  
  return credential;
}

// Authenticate with passkey
async function authenticateWithPasskey() {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      rpId: location.hostname,
      userVerification: 'preferred',
      timeout: 60000
    }
  });
  
  return assertion;
}
```

### 9. JWT Token Decoder

Decode and inspect JWT tokens.

**How to Use:**
1. Paste JWT token
2. Click "Decode Token"
3. View header and payload

**Extension Testing:**
```javascript
// JWT decoder utility
function decodeJWT(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  
  return {
    header: JSON.parse(atob(parts[0])),
    payload: JSON.parse(atob(parts[1])),
    signature: parts[2]
  };
}

// Check if JWT is expired
function isJWTExpired(token) {
  const { payload } = decodeJWT(token);
  if (!payload.exp) return false;
  return Date.now() >= payload.exp * 1000;
}
```

## Common Extension Patterns

### Pattern 1: Password Manager
```javascript
class PasswordManager {
  async detectLoginForm() {
    const passwordField = document.querySelector('input[type="password"]');
    if (!passwordField) return null;
    
    const form = passwordField.closest('form');
    const usernameField = form?.querySelector(
      'input[type="email"], input[type="text"][autocomplete*="user"]'
    );
    
    return { form, usernameField, passwordField };
  }
  
  async autoFill(credentials) {
    const { usernameField, passwordField } = await this.detectLoginForm();
    
    if (usernameField) {
      usernameField.value = credentials.username;
      usernameField.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    if (passwordField) {
      passwordField.value = credentials.password;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  
  async offerSave(credentials) {
    // Show extension popup to save credentials
    console.log('Offer to save:', credentials.username);
  }
}
```

### Pattern 2: OAuth Interceptor
```javascript
class OAuthInterceptor {
  constructor() {
    this.interceptPopups();
    this.listenForCallbacks();
  }
  
  interceptPopups() {
    const original = window.open;
    window.open = (url, ...args) => {
      if (this.isOAuthURL(url)) {
        this.handleOAuthStart(url);
      }
      return original.call(window, url, ...args);
    };
  }
  
  isOAuthURL(url) {
    const oauthPatterns = [
      /accounts\.google\.com/,
      /facebook\.com\/.*oauth/,
      /github\.com\/login\/oauth/
    ];
    return oauthPatterns.some(p => p.test(url));
  }
  
  listenForCallbacks() {
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'oauth_callback') {
        this.handleOAuthComplete(e.data);
      }
    });
  }
}
```

## Tips

1. **Autocomplete**: Always use proper autocomplete attributes
2. **Security**: Never log actual passwords in production
3. **Credential API**: Respect user's credential management preferences
4. **WebAuthn**: Test on multiple devices and browsers
5. **Session Security**: Implement proper session timeout handling

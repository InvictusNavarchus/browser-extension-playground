# Forms Testing Guide

The Forms page provides comprehensive testing for form-related browser extension features including autofill, validation, and input handling.

## Overview

**Route**: `/forms`

Test your extension's ability to interact with various form elements, handle autofill scenarios, and process form submissions.

## Test Sections

### 1. Input Types Gallery

A comprehensive collection of all HTML input types for testing.

**Available Input Types:**

| Type | Description | Common Extension Use |
|------|-------------|---------------------|
| `text` | Standard text input | Autofill, validation |
| `password` | Password field | Password managers |
| `email` | Email input | Email validation |
| `number` | Numeric input | Number formatting |
| `tel` | Phone number | Phone formatting |
| `url` | URL input | Link validation |
| `search` | Search box | Search suggestions |
| `date` | Date picker | Date formatting |
| `time` | Time picker | Time formatting |
| `datetime-local` | Date and time | Scheduling |
| `month` | Month picker | Date selection |
| `week` | Week picker | Week selection |
| `color` | Color picker | Theme tools |
| `range` | Slider | Value adjustment |
| `file` | File upload | File handling |
| `checkbox` | Checkbox | Toggle states |
| `radio` | Radio button | Single selection |

**Extension Testing:**
```javascript
// Find all input fields by type
const passwords = document.querySelectorAll('input[type="password"]');
const emails = document.querySelectorAll('input[type="email"]');
```

### 2. Autocomplete Attributes

Test browser and extension autofill behavior with proper autocomplete attributes.

**Autocomplete Values Tested:**

| Attribute | Purpose |
|-----------|---------|
| `name` | Full name |
| `given-name` | First name |
| `family-name` | Last name |
| `email` | Email address |
| `tel` | Phone number |
| `street-address` | Street address |
| `address-line1` | Address line 1 |
| `address-line2` | Address line 2 |
| `city` / `address-level2` | City |
| `state` / `address-level1` | State/Province |
| `postal-code` | ZIP/Postal code |
| `country` | Country |
| `cc-name` | Credit card name |
| `cc-number` | Credit card number |
| `cc-exp` | Card expiration |
| `cc-csc` | Card security code |
| `username` | Username |
| `current-password` | Current password |
| `new-password` | New password |
| `one-time-code` | OTP/2FA code |

**How to Use:**
1. Click on an input field
2. Observe browser autofill suggestions
3. Test your extension's autofill overlay/suggestions
4. Verify correct field detection

**Extension Testing:**
```javascript
// Detect autofill-enabled fields
const autofillFields = document.querySelectorAll('[autocomplete]');
autofillFields.forEach(field => {
  console.log(field.name, field.autocomplete);
});
```

### 3. Form Validation

Test client-side validation with various constraint attributes.

**Validation Attributes:**
- `required` - Field must be filled
- `minlength` / `maxlength` - Text length limits
- `min` / `max` - Numeric limits
- `pattern` - Regex pattern matching
- `type` - Type-specific validation (email, url, etc.)

**How to Use:**
1. Try submitting empty required fields
2. Enter invalid data (wrong email format, etc.)
3. Observe validation messages
4. Test your extension's custom validation

**Extension Testing:**
```javascript
// Check field validity
const form = document.querySelector('form');
const inputs = form.querySelectorAll('input');

inputs.forEach(input => {
  console.log(input.name, {
    valid: input.validity.valid,
    valueMissing: input.validity.valueMissing,
    typeMismatch: input.validity.typeMismatch,
    patternMismatch: input.validity.patternMismatch
  });
});
```

### 4. Login Form

A standard login form for testing credential-related extensions.

**Fields:**
- Email input with `autocomplete="email"`
- Password input with `autocomplete="current-password"`
- "Remember me" checkbox
- Submit button

**Extension Testing:**
- Password manager autofill
- Credential detection
- Form submission interception

### 5. Registration Form

Multi-field registration form for comprehensive testing.

**Fields:**
- Full name (`autocomplete="name"`)
- Email (`autocomplete="email"`)
- Password (`autocomplete="new-password"`)
- Confirm password
- Terms checkbox
- Submit button

### 6. Multi-Step Form

Test form wizard patterns common in modern applications.

**Steps:**
1. Personal information
2. Contact details
3. Preferences
4. Review & submit

**Extension Testing:**
- Handle dynamically shown/hidden fields
- Track form progress
- Validate across steps

### 7. Search Forms

Test search input handling and suggestions.

**Features:**
- Search input with `type="search"`
- Autocomplete suggestions (datalist)
- Search button
- Clear button (`type="reset"`)

## Form Events

The page logs these events to help test extension behavior:

| Event | When Fired |
|-------|------------|
| `input` | Value changes |
| `change` | Value committed |
| `focus` | Field gains focus |
| `blur` | Field loses focus |
| `submit` | Form submitted |
| `reset` | Form reset |
| `invalid` | Validation fails |

## Common Extension Patterns

### Pattern 1: Autofill Detection
```javascript
// Detect when browser autofills a field
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('animationstart', (e) => {
    if (e.animationName === 'onAutoFillStart') {
      console.log('Autofill detected on:', input.name);
    }
  });
});

// CSS to detect autofill:
// input:-webkit-autofill { animation: onAutoFillStart 0.1s; }
```

### Pattern 2: Form Submission Interception
```javascript
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Process form data
    console.log('Form data:', data);
    
    // Optionally continue submission
    // form.submit();
  });
});
```

### Pattern 3: Password Field Detection
```javascript
function findPasswordFields() {
  const passwordFields = [];
  
  // Explicit password type
  document.querySelectorAll('input[type="password"]').forEach(el => {
    passwordFields.push(el);
  });
  
  // Hidden password fields (some sites hide the type)
  document.querySelectorAll('input').forEach(el => {
    if (el.autocomplete?.includes('password')) {
      passwordFields.push(el);
    }
  });
  
  return [...new Set(passwordFields)];
}
```

### Pattern 4: Credit Card Field Detection
```javascript
function findCreditCardFields() {
  const ccSelectors = [
    '[autocomplete*="cc-"]',
    '[name*="card"]',
    '[name*="credit"]',
    '[id*="card"]',
    '[placeholder*="card"]'
  ];
  
  return document.querySelectorAll(ccSelectors.join(','));
}
```

## Tips

1. **Test Real Autofill**: Use your browser's saved addresses/passwords
2. **Multiple Profiles**: Test with different autofill profiles
3. **Validation Timing**: Test validation on submit vs. on blur
4. **Hidden Fields**: Check for hidden inputs that may contain sensitive data
5. **Dynamic Forms**: Test with fields that appear/disappear based on selections

# Design Document: User Authentication System

## Overview

The User Authentication System provides secure registration, login, session management, and profile storage for the Ubora General Enterprises DAGAA e-commerce application. Built on React, TypeScript, and TanStack Router, the system integrates seamlessly with existing components (Navigation, checkout page) to protect checkout functionality and personalize the user experience.

The system follows a client-side architecture with browser-based session storage, implementing industry-standard security practices including password hashing and secure credential handling. Authentication state is managed through React Context, enabling reactive UI updates across all components.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │ Navigation │  │ Login/       │  │ Checkout Page    │    │
│  │ Component  │  │ Register     │  │ (Protected)      │    │
│  │            │  │ Forms        │  │                  │    │
│  └─────┬──────┘  └──────┬───────┘  └────────┬─────────┘    │
│        │                │                   │               │
│        └────────────────┼───────────────────┘               │
│                         │                                    │
│                  ┌──────▼───────────┐                       │
│                  │  Auth Context    │                       │
│                  │  Provider        │                       │
│                  └──────┬───────────┘                       │
│                         │                                    │
│         ┌───────────────┼───────────────┐                  │
│         │               │               │                  │
│  ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼─────────┐        │
│  │ Validation  │ │ Auth       │ │ Session       │        │
│  │ Module      │ │ Service    │ │ Manager       │        │
│  └─────────────┘ └─────┬──────┘ └──────┬────────┘        │
│                        │                │                  │
│                  ┌─────▼────────────────▼──┐              │
│                  │  User Store             │              │
│                  │  (Browser Storage)      │              │
│                  └─────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

1. **Auth Context Provider**: Central authentication state management, provides auth state and operations to all components
2. **Validation Module**: Pure functions for email and password validation
3. **Auth Service**: Handles registration, login, logout operations and password hashing
4. **Session Manager**: Manages session persistence in browser storage
5. **User Store**: Interfaces with browser storage for user data persistence
6. **Protected Routes**: Route guards that enforce authentication requirements
7. **Navigation Component**: Displays login status and provides access to auth actions
8. **Login/Register Forms**: User interfaces for authentication operations

## Components and Interfaces

### 1. Auth Context

**Purpose**: Centralized authentication state management accessible throughout the application.

**State Shape**:
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface User {
  id: string;
  email: string;
  profile: UserProfile;
}

interface UserProfile {
  fullName: string;
  phone: string;
  addresses: string[];
}
```

**Operations**:
```typescript
interface AuthContextValue {
  // State
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  
  // Operations
  register(email: string, password: string, profile: UserProfile): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  checkAuth(): Promise<void>;
}

type AuthResult = 
  | { success: true; user: User }
  | { success: false; error: string };
```

### 2. Validation Module

**Purpose**: Pure validation functions for user input.

**Interface**:
```typescript
interface ValidationResult {
  valid: boolean;
  error?: string;
}

function validateEmail(email: string): ValidationResult;
function validatePassword(password: string): ValidationResult;
```

**Email Validation Rules**:
- Must contain exactly one @ symbol
- Must have characters before and after @
- Must have a domain (characters after @, containing at least one dot)
- Cannot contain whitespace
- Accepts letters, numbers, dots, hyphens, underscores

**Password Validation Rules**:
- Minimum 8 characters
- Accepts letters (upper/lowercase), numbers, special characters

### 3. Auth Service

**Purpose**: Handles authentication operations and password security.

**Interface**:
```typescript
interface AuthService {
  registerUser(email: string, password: string, profile: UserProfile): Promise<AuthResult>;
  authenticateUser(email: string, password: string): Promise<AuthResult>;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
}
```

**Implementation Notes**:
- Uses bcrypt.js (or similar) for password hashing in the browser
- Generates unique user IDs using UUID v4
- Coordinates with User Store for persistence
- Returns standardized error messages per requirements

### 4. Session Manager

**Purpose**: Manages session persistence and restoration across page loads.

**Interface**:
```typescript
interface SessionManager {
  createSession(user: User): Promise<void>;
  getSession(): Promise<User | null>;
  clearSession(): Promise<void>;
  validateSession(): Promise<boolean>;
}

interface SessionData {
  userId: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}
```

**Storage Strategy**:
- Uses localStorage for session persistence
- Stores session token and user ID
- Session expires after 7 days of inactivity
- Validates session on app initialization

### 5. User Store

**Purpose**: Persistent storage for user accounts and profiles.

**Interface**:
```typescript
interface UserStore {
  createUser(user: UserRecord): Promise<void>;
  getUserByEmail(email: string): Promise<UserRecord | null>;
  getUserById(id: string): Promise<UserRecord | null>;
  userExists(email: string): Promise<boolean>;
  updateProfile(userId: string, profile: Partial<UserProfile>): Promise<void>;
}

interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;
  createdAt: number;
}
```

**Storage Implementation**:
- Uses localStorage with key prefix `ubora_users_`
- Maintains email index for uniqueness enforcement
- Stores all data as JSON
- Key format: `ubora_users_<userId>` for user records, `ubora_email_index` for email-to-ID mapping

### 6. Protected Route Component

**Purpose**: Enforces authentication requirements for protected pages.

**Interface**:
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element;
```

**Behavior**:
- Checks authentication status from Auth Context
- Redirects to login if unauthenticated, storing intended destination
- Renders children if authenticated
- Handles loading state during authentication check

### 7. Login and Registration Forms

**Login Form Fields**:
- Email (text input)
- Password (password input)
- Submit button
- Link to registration form

**Registration Form Fields**:
- Email (text input)
- Password (password input)
- Full Name (text input)
- Phone Number (tel input)
- Delivery Address (text input)
- Submit button
- Link to login form

**Form Behavior**:
- Real-time validation feedback
- Displays validation errors adjacent to fields
- Disables submit button while submitting
- Shows loading state during async operations
- Clears errors when user corrects input

## Data Models

### User Model

```typescript
interface User {
  id: string;              // UUID v4
  email: string;           // Unique identifier, validated format
  passwordHash: string;    // Bcrypt hash, never plain text
  profile: UserProfile;
  createdAt: number;       // Unix timestamp
}
```

### User Profile Model

```typescript
interface UserProfile {
  fullName: string;        // Required, min 1 character
  phone: string;           // Required, format validated
  addresses: string[];     // At least one address required
}
```

### Session Model

```typescript
interface Session {
  userId: string;          // References User.id
  email: string;           // Cached for quick access
  createdAt: number;       // Unix timestamp
  expiresAt: number;       // Unix timestamp (createdAt + 7 days)
  sessionToken: string;    // Random token for validation
}
```

### Form State Models

```typescript
interface LoginFormState {
  email: string;
  password: string;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
  isSubmitting: boolean;
}

interface RegistrationFormState {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  errors: {
    email?: string;
    password?: string;
    fullName?: string;
    phone?: string;
    address?: string;
    general?: string;
  };
  isSubmitting: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Note**: This authentication system is primarily composed of UI interactions, side effects, and storage operations which are not suitable for property-based testing. However, the validation logic contains pure functions with universal properties that benefit from PBT. The properties below focus exclusively on these validation functions.

### Property 1: Valid emails must contain @ and domain structure

*For any* string that contains exactly one @ symbol with non-empty text before and after it, and the text after @ contains at least one dot with non-empty segments, the email validator SHALL return `valid: true`.

**Validates: Requirements 2.1, 2.4**

### Property 2: Invalid email formats are rejected

*For any* string that lacks an @ symbol, contains multiple @ symbols, has whitespace, or lacks proper domain structure, the email validator SHALL return `valid: false` with an appropriate error message.

**Validates: Requirements 2.2, 2.3**

### Property 3: Passwords meeting length requirement are accepted

*For any* string containing 8 or more characters (regardless of character type), the password validator SHALL return `valid: true`.

**Validates: Requirements 3.1, 3.3, 3.4**

### Property 4: Short passwords are rejected

*For any* string containing fewer than 8 characters, the password validator SHALL return `valid: false` with error message "Password must be at least 8 characters long".

**Validates: Requirements 3.2**

### Property 5: Email validation is consistent

*For any* email string, repeated validation calls SHALL produce identical results (idempotence).

**Validates: Requirements 2.1-2.4**

### Property 6: Password validation is consistent

*For any* password string, repeated validation calls SHALL produce identical results (idempotence).

**Validates: Requirements 3.1-3.4**

## Error Handling

### Validation Errors

**Email Validation Errors**:
- Empty email: "Please enter a valid email address"
- Missing @: "Please enter a valid email address"
- Missing domain: "Please enter a valid email address"
- Contains whitespace: "Please enter a valid email address"
- Multiple @ symbols: "Please enter a valid email address"

**Password Validation Errors**:
- Length < 8: "Password must be at least 8 characters long"

### Authentication Errors

**Registration Errors**:
- Email already exists: "An account with this email already exists"
- Network failure: "Unable to connect. Please try again."
- Storage failure: "Something went wrong. Please try again."
- Unknown error: "Something went wrong. Please try again."

**Login Errors**:
- Invalid credentials: "Invalid email or password" (same message for both email not found and incorrect password for security)
- Network failure: "Unable to connect. Please try again."
- Storage failure: "Something went wrong. Please try again."
- Unknown error: "Something went wrong. Please try again."

### Session Errors

**Session Restoration Failures**:
- Expired session: Clear session silently, require re-login
- Corrupted session data: Clear session silently, require re-login
- Missing user data: Clear session silently, require re-login

**Strategy**: Session errors are handled gracefully without user-visible messages. The system simply clears invalid sessions and treats the user as unauthenticated.

### Form Error Display

**Display Rules**:
1. Show validation errors adjacent to the relevant field
2. Display multiple errors simultaneously when present
3. Clear field errors when user modifies the field
4. Show general errors (network, server) above the form
5. Maintain error visibility until user takes corrective action

**Error Priority**:
1. Validation errors (immediate feedback)
2. Business logic errors (email exists)
3. Network/system errors (after submission attempt)

## Testing Strategy

### Unit Tests

Unit tests will verify specific behavior and edge cases using example-based testing:

**Validation Module**:
- Valid email formats (standard cases)
- Invalid email formats (missing @, whitespace, multiple @)
- Valid passwords (8+ characters with various character types)
- Invalid passwords (< 8 characters)

**Auth Service**:
- Successful registration with valid data
- Registration failure with existing email
- Successful login with correct credentials
- Login failure with incorrect credentials
- Password hashing produces different output for same input (due to salt)

**Session Manager**:
- Session creation and storage
- Session restoration from storage
- Session expiration after 7 days
- Session clearing on logout

**User Store**:
- User creation and retrieval
- Email uniqueness enforcement
- Profile updates

**Protected Routes**:
- Authenticated user can access protected content
- Unauthenticated user redirected to login
- Redirect back to intended page after login

### Property-Based Tests

Property-based tests will validate universal properties of the validation functions using a PBT library (fast-check for TypeScript):

**Library Selection**: fast-check (TypeScript property-based testing library)

**Configuration**: Each property test must run a minimum of 100 iterations to ensure comprehensive coverage of the input space.

**Test Tagging**: Each property-based test must include a comment referencing the design property:
```typescript
// Feature: user-authentication, Property 1: Valid emails must contain @ and domain structure
```

**Validation Properties** (Properties 1-6):
- Test email validation with generated valid emails (Property 1)
- Test email validation with generated invalid emails (Property 2)
- Test password validation with generated strings ≥8 chars (Property 3)
- Test password validation with generated strings <8 chars (Property 4)
- Test email validation idempotence (Property 5)
- Test password validation idempotence (Property 6)

### Integration Tests

Integration tests will verify component interactions:

**Authentication Flow**:
- Complete registration flow (form → validation → service → storage → session)
- Complete login flow (form → validation → service → session)
- Logout flow (action → session clear → redirect)

**UI Integration**:
- Navigation updates when auth state changes
- Protected route enforcement with TanStack Router
- Form submission with validation errors
- Checkout page pre-fill with user profile data

**Storage Integration**:
- User data persists across browser refresh
- Session restoration after page reload
- Multiple users can be stored without conflicts

### Test Coverage Goals

- **Unit tests**: 100% coverage of validation logic, auth service, session manager
- **Property tests**: All 6 validation properties implemented
- **Integration tests**: All user flows (register, login, logout, protected access)
- **UI tests**: All error states and success states rendered correctly

### Manual Testing Checklist

While not part of automated testing, manual verification should include:
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Mobile responsiveness of forms
- Accessibility (keyboard navigation, screen readers)
- Visual design consistency with existing components

## Integration with Existing Components

### Navigation Component Updates

**Current State**: Navigation displays static links without auth awareness.

**Required Changes**:
1. Consume Auth Context to access `isAuthenticated` and `user`
2. Conditionally render "Login" button when unauthenticated
3. Conditionally render user name/email and "Logout" button when authenticated
4. Update state reactively when auth changes (already handled by React Context)

**Implementation**:
```typescript
const { isAuthenticated, user, logout } = useAuth();

{!isAuthenticated ? (
  <Link to="/login">Login</Link>
) : (
  <>
    <span>{user?.profile.fullName || user?.email}</span>
    <button onClick={logout}>Logout</button>
  </>
)}
```

### Checkout Page Updates

**Current State**: Checkout page is publicly accessible with empty form fields.

**Required Changes**:
1. Wrap route with `ProtectedRoute` component to enforce authentication
2. Consume Auth Context to access user profile data
3. Pre-fill customer information fields from `user.profile`
4. Handle redirect to login if unauthenticated

**Implementation**:
```typescript
// In route definition
export const Route = createFileRoute("/checkout")({
  component: () => (
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  ),
});

// In Checkout component
const { user } = useAuth();

// Initialize form with profile data
const [form, setForm] = useState({
  fullName: user?.profile.fullName || "",
  phone: user?.profile.phone || "",
  address: user?.profile.addresses[0] || "",
});
```

### Router Configuration

**Required Changes**:
1. Add `/login` route for login form
2. Add `/register` route for registration form
3. Configure redirect behavior for protected routes
4. Handle post-login navigation to intended destination

**TanStack Router Configuration**:
```typescript
// Store intended destination before redirect
const search = useSearch();
const redirectTo = search.redirect || "/";

// After successful login
navigate({ to: redirectTo });
```

## Security Considerations

### Password Security

1. **Hashing Algorithm**: Use bcrypt with cost factor 10 (balance of security and performance)
2. **Never Log Passwords**: Exclude password fields from all logging and error reporting
3. **Clear Password Fields**: Clear password input fields after failed attempts
4. **No Password Transmission**: Hash passwords before any storage operation

### Session Security

1. **Session Expiration**: 7-day expiration with no automatic renewal (require re-login)
2. **Session Validation**: Verify session integrity on every page load
3. **Logout on Tampering**: Clear session if validation fails
4. **No Sensitive Data**: Store only user ID and email in session, fetch profile on demand

### Email Privacy

1. **Error Message Uniformity**: Use identical error messages for "email not found" and "password incorrect" to prevent email enumeration
2. **Case-Insensitive Email**: Normalize emails to lowercase before storage and comparison

### Browser Storage

1. **No Sensitive Data in Storage**: Never store passwords or password hashes in browser storage
2. **Validate on Read**: Always validate data structure when reading from storage
3. **Graceful Degradation**: Handle corrupted or missing storage data gracefully

### Input Sanitization

1. **Validation Before Processing**: Validate all inputs before any business logic
2. **Trim Whitespace**: Trim leading/trailing whitespace from all inputs except passwords
3. **Escape Display**: Escape user-provided data when displaying in UI (React handles this automatically)

## Performance Considerations

### Optimization Strategies

1. **Lazy Password Hashing**: Hash passwords asynchronously to avoid blocking UI
2. **Debounced Validation**: Debounce validation feedback by 300ms during typing
3. **Memoized Context**: Memoize Auth Context value to prevent unnecessary re-renders
4. **Indexed Email Lookup**: Maintain email index in storage for O(1) email existence checks

### Expected Performance Metrics

- Password hash generation: <100ms on modern browsers
- Session restoration: <50ms from localStorage
- Email validation: <1ms (pure computation)
- Password validation: <1ms (pure computation)
- User lookup by email: <10ms (localStorage read + JSON parse)

## Future Enhancements

This design implements the MVP authentication system. Future enhancements may include:

1. **Password Reset**: Email-based password recovery
2. **Email Verification**: Verify email ownership during registration
3. **Remember Me**: Optional extended session duration
4. **Profile Editing**: User interface for updating profile information
5. **Multiple Addresses**: UI for managing multiple delivery addresses
6. **Social Login**: OAuth integration (Google, Facebook)
7. **Two-Factor Authentication**: SMS or authenticator app 2FA
8. **Backend Integration**: Replace browser storage with secure backend API

These enhancements are out of scope for the current implementation but the architecture is designed to accommodate them with minimal refactoring.

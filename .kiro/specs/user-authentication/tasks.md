# Implementation Plan: User Authentication System

## Overview

This implementation plan breaks down the User Authentication System into incremental coding tasks. Each task builds on previous work, starting with foundational components and progressing through authentication logic, UI integration, and testing. The plan follows a bottom-up approach: validation → storage → auth service → session management → UI components → route protection → integration.

## Tasks

- [ ] 1. Set up authentication infrastructure and types
  - Create `src/types/auth.ts` with all TypeScript interfaces (User, UserProfile, AuthState, AuthResult, ValidationResult, etc.)
  - Create directory structure: `src/auth/` with subdirectories for validation, services, context
  - Install required dependencies: `bcryptjs`, `uuid`, `@types/bcryptjs`, `fast-check` (for property-based testing)
  - _Requirements: All (foundational types)_

- [ ] 2. Implement validation module
  - [ ] 2.1 Create email validation function
    - Implement `validateEmail(email: string): ValidationResult` in `src/auth/validation/emailValidator.ts`
    - Check for single @ symbol, non-empty local and domain parts, domain contains dot
    - Reject whitespace and invalid characters
    - Return error message "Please enter a valid email address" for invalid inputs
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 2.2 Write property tests for email validation
    - **Property 1: Valid emails must contain @ and domain structure**
    - **Property 2: Invalid email formats are rejected**
    - **Property 5: Email validation is consistent**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
    - Use fast-check to generate valid and invalid email formats, run 100+ iterations

  - [ ] 2.3 Create password validation function
    - Implement `validatePassword(password: string): ValidationResult` in `src/auth/validation/passwordValidator.ts`
    - Check minimum 8 character length
    - Accept all character types (letters, numbers, special characters)
    - Return error message "Password must be at least 8 characters long" for short passwords
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 2.4 Write property tests for password validation
    - **Property 3: Passwords meeting length requirement are accepted**
    - **Property 4: Short passwords are rejected**
    - **Property 6: Password validation is consistent**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
    - Use fast-check to generate strings of varying lengths, run 100+ iterations

  - [ ]* 2.5 Write unit tests for validation edge cases
    - Test specific edge cases: empty strings, very long strings, special characters in emails
    - Test boundary cases: exactly 8 characters, 7 characters
    - _Requirements: 2.1-2.4, 3.1-3.4_

- [ ] 3. Implement User Store with browser storage
  - [ ] 3.1 Create User Store service
    - Implement `UserStore` class in `src/auth/services/userStore.ts`
    - Implement `createUser`, `getUserByEmail`, `getUserById`, `userExists`, `updateProfile` methods
    - Use localStorage with key prefix `ubora_users_`
    - Maintain email-to-ID index in `ubora_email_index` key
    - Handle JSON serialization/deserialization with error handling
    - _Requirements: 1.3, 6.1, 6.2, 6.3, 6.4, 10.1, 10.2, 10.3, 10.4_

  - [ ]* 3.2 Write unit tests for User Store
    - Test user creation, retrieval by email and ID
    - Test email uniqueness enforcement
    - Test profile updates
    - Test error handling for corrupted data
    - _Requirements: 1.3, 6.1-6.4, 10.1-10.4_

- [ ] 4. Implement Session Manager
  - [ ] 4.1 Create Session Manager service
    - Implement `SessionManager` class in `src/auth/services/sessionManager.ts`
    - Implement `createSession`, `getSession`, `clearSession`, `validateSession` methods
    - Store session data in localStorage with key `ubora_session`
    - Generate random session tokens using UUID
    - Set 7-day expiration (current timestamp + 7 days)
    - Validate expiration on session retrieval
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.2_

  - [ ]* 4.2 Write unit tests for Session Manager
    - Test session creation and retrieval
    - Test session expiration after 7 days
    - Test session validation with corrupted data
    - Test session clearing
    - _Requirements: 5.1-5.5, 8.2_

- [ ] 5. Implement Auth Service with password hashing
  - [ ] 5.1 Create Auth Service
    - Implement `AuthService` class in `src/auth/services/authService.ts`
    - Implement `registerUser` method: validate email uniqueness, hash password, create user, return success/error
    - Implement `authenticateUser` method: check email exists, verify password, return user or error
    - Implement `hashPassword` using bcrypt with cost factor 10
    - Implement `verifyPassword` using bcrypt compare
    - Use UUID v4 for user ID generation
    - Coordinate with UserStore for persistence
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 4.3, 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 5.2 Write unit tests for Auth Service
    - Test successful registration with valid data
    - Test registration failure with existing email (error: "An account with this email already exists")
    - Test successful login with correct credentials
    - Test login failure with non-existent email (error: "Invalid email or password")
    - Test login failure with incorrect password (error: "Invalid email or password")
    - Test password hashing produces different outputs for same input (salt verification)
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3, 11.1-11.5_

- [ ] 6. Checkpoint - Verify core authentication logic
  - Ensure all tests pass for validation, storage, session, and auth service
  - Verify password hashing works correctly
  - Ask the user if questions arise

- [ ] 7. Create Auth Context Provider
  - [ ] 7.1 Implement Auth Context
    - Create `AuthContext` and `AuthProvider` in `src/auth/context/AuthContext.tsx`
    - Implement state: `isAuthenticated`, `user`, `isLoading`
    - Implement operations: `register`, `login`, `logout`, `checkAuth`
    - Use `useEffect` to call `checkAuth` on mount to restore session
    - Integrate AuthService, SessionManager for operations
    - Handle async operations with loading states
    - Return standardized AuthResult from operations
    - _Requirements: 1.1, 1.5, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 8.1, 8.3, 8.4_

  - [ ] 7.2 Create useAuth custom hook
    - Export `useAuth` hook in `src/auth/context/AuthContext.tsx`
    - Return AuthContextValue from context
    - Throw error if used outside AuthProvider
    - _Requirements: All (provides access to auth state)_

  - [ ]* 7.3 Write integration tests for Auth Context
    - Test registration flow: call register → verify user created → verify session created
    - Test login flow: call login → verify user authenticated → verify session created
    - Test logout flow: call logout → verify session cleared → verify user null
    - Test session restoration on mount
    - _Requirements: 1.1, 1.5, 4.1, 5.1, 8.1-8.4_

- [ ] 8. Create Login form component
  - [ ] 8.1 Implement Login form UI
    - Create `LoginForm` component in `src/components/auth/LoginForm.tsx`
    - Add email and password input fields with labels
    - Add submit button with loading state
    - Add link to registration form
    - Style consistently with existing checkout form design
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 8.2 Integrate validation and error handling
    - Use `validateEmail` and `validatePassword` on form inputs
    - Display validation errors adjacent to fields
    - Clear errors when user modifies input (debounce 300ms)
    - Display authentication errors from Auth Context
    - Show all errors simultaneously when present
    - Disable submit button during submission
    - _Requirements: 4.1, 4.2, 4.3, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 8.3 Connect form to Auth Context
    - Call `login` from useAuth on form submit
    - Handle success: navigate to redirect destination or home
    - Handle failure: display error message from AuthResult
    - Implement redirect logic: check for `?redirect` query param, default to "/"
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 8.4 Write unit tests for Login form
    - Test form renders with all fields
    - Test validation errors display correctly
    - Test form submission calls login with correct arguments
    - Test redirect after successful login
    - Test error messages display for failed login
    - _Requirements: 4.1-4.4, 9.1-9.5_

- [ ] 9. Create Registration form component
  - [ ] 9.1 Implement Registration form UI
    - Create `RegistrationForm` component in `src/components/auth/RegistrationForm.tsx`
    - Add input fields: email, password, full name, phone, delivery address
    - Add submit button with loading state
    - Add link to login form
    - Style consistently with existing checkout form design
    - _Requirements: 1.1, 1.2, 6.1, 6.2, 6.3, 6.4_

  - [ ] 9.2 Integrate validation and error handling
    - Use `validateEmail` and `validatePassword` on form inputs
    - Add validation for required fields (name, phone, address must not be empty)
    - Display validation errors adjacent to fields
    - Clear errors when user modifies input (debounce 300ms)
    - Display registration errors from Auth Context
    - Show all errors simultaneously when present
    - Disable submit button during submission
    - _Requirements: 1.1, 1.2, 2.1-2.4, 3.1-3.4, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 9.3 Connect form to Auth Context
    - Call `register` from useAuth on form submit
    - Build UserProfile object from form fields (addresses as array with single address)
    - Handle success: automatically log in user and navigate to home or checkout
    - Handle failure: display error message from AuthResult
    - _Requirements: 1.1, 1.2, 1.5, 6.1, 6.2, 6.3, 6.4_

  - [ ]* 9.4 Write unit tests for Registration form
    - Test form renders with all required fields
    - Test validation errors display correctly for all fields
    - Test form submission calls register with correct arguments
    - Test automatic login after successful registration
    - Test error messages display for failed registration (email exists)
    - _Requirements: 1.1, 1.2, 6.1-6.4, 9.1-9.5_

- [ ] 10. Create route definitions for auth pages
  - [ ] 10.1 Create login page route
    - Create `src/routes/login.tsx` using createFileRoute
    - Render LoginForm component
    - Add route to router configuration
    - _Requirements: 4.1, 12.4_

  - [ ] 10.2 Create registration page route
    - Create `src/routes/register.tsx` using createFileRoute
    - Render RegistrationForm component
    - Add route to router configuration
    - _Requirements: 1.1_

  - [ ] 10.3 Handle authenticated user redirects
    - In both login and register routes, check if user is already authenticated
    - If authenticated, redirect to home page immediately
    - Prevent logged-in users from accessing login/register pages
    - _Requirements: 4.4, 1.5_

- [ ] 11. Implement Protected Route component
  - [ ] 11.1 Create ProtectedRoute component
    - Create `ProtectedRoute` component in `src/components/auth/ProtectedRoute.tsx`
    - Use `useAuth` to check authentication status
    - Show loading spinner while `isLoading` is true
    - If not authenticated, redirect to `/login?redirect={currentPath}`
    - If authenticated, render children
    - _Requirements: 7.1, 7.3, 7.4_

  - [ ] 11.2 Apply ProtectedRoute to checkout page
    - Wrap checkout route with ProtectedRoute in `src/routes/checkout.tsx`
    - Ensure redirect parameter is passed correctly
    - Test that unauthenticated users are redirected to login
    - Test that authenticated users can access checkout
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 11.3 Write unit tests for ProtectedRoute
    - Test component shows loading state initially
    - Test unauthenticated user redirected to login with correct redirect param
    - Test authenticated user sees protected content
    - _Requirements: 7.1-7.4_

- [ ] 12. Update Navigation component with auth integration
  - [ ] 12.1 Integrate auth state into Navigation
    - Import and use `useAuth` hook in `src/components/Navigation.tsx`
    - Conditionally render "Login" button when `!isAuthenticated`
    - Conditionally render user name/email and "Logout" button when `isAuthenticated`
    - Update both mobile and desktop navigation layouts
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 12.2 Implement logout functionality
    - Attach `logout` function from useAuth to logout button
    - Handle logout click: call logout, wait for completion
    - Verify Navigation updates automatically after logout (React Context handles this)
    - _Requirements: 8.1, 8.3, 12.3, 12.5_

  - [ ] 12.3 Add navigation to login page
    - Link "Login" button to `/login` route
    - Ensure navigation closes (mobile) after clicking login
    - _Requirements: 12.4_

  - [ ]* 12.4 Write integration tests for Navigation updates
    - Test Navigation shows "Login" when unauthenticated
    - Test Navigation shows user name and "Logout" when authenticated
    - Test logout button calls logout function
    - Test Navigation updates reactively when auth state changes
    - _Requirements: 12.1-12.5_

- [ ] 13. Integrate user profile with checkout page
  - [ ] 13.1 Pre-fill checkout form with user profile
    - In `src/routes/checkout.tsx`, use `useAuth` to access user profile
    - Initialize form state with `user.profile.fullName`, `user.profile.phone`, `user.profile.addresses[0]`
    - Handle case where user exists but profile fields are empty (use empty strings as fallback)
    - Ensure form is still editable after pre-fill
    - _Requirements: 6.5_

  - [ ]* 13.2 Write integration tests for checkout pre-fill
    - Test checkout form pre-fills with authenticated user's profile data
    - Test checkout form handles missing profile data gracefully
    - Test user can still edit pre-filled fields
    - _Requirements: 6.5_

- [ ] 14. Wrap application with Auth Provider
  - [ ] 14.1 Add AuthProvider to app root
    - Wrap the root component/router with `AuthProvider` in `src/main.tsx` or app entry point
    - Ensure AuthProvider wraps RouterProvider so context is available to all routes
    - Verify auth state is accessible throughout the app
    - _Requirements: All (enables auth context)_

  - [ ] 14.2 Test session restoration on app load
    - Manually test: register, refresh page, verify still logged in
    - Manually test: login, refresh page, verify still logged in
    - Manually test: logout, refresh page, verify still logged out
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 15. Final checkpoint - End-to-end testing and polish
  - [ ] 15.1 Test complete registration flow
    - Navigate to register page → fill form → submit → verify auto-login → verify Navigation updates
    - _Requirements: 1.1-1.5, 6.1-6.4, 12.1-12.5_

  - [ ] 15.2 Test complete login flow
    - Logout → navigate to login → fill form → submit → verify Navigation updates
    - _Requirements: 4.1-4.4, 12.1-12.5_

  - [ ] 15.3 Test protected checkout flow
    - Logout → navigate to checkout → verify redirect to login → login → verify redirect back to checkout → verify profile pre-fill
    - _Requirements: 7.1-7.4, 6.5_

  - [ ] 15.4 Test error handling flows
    - Try registering with existing email → verify error message
    - Try logging in with wrong password → verify error message
    - Try invalid email formats → verify validation errors
    - Try short passwords → verify validation errors
    - _Requirements: 1.2, 2.2, 3.2, 4.2, 4.3, 9.1-9.5_

  - [ ] 15.5 Test session persistence
    - Login → refresh page → verify still logged in
    - Login → close tab → reopen → navigate to site → verify still logged in
    - _Requirements: 5.1-5.5_

  - [ ] 15.6 Review and polish
    - Verify consistent styling across all auth components
    - Verify responsive design on mobile and desktop
    - Verify accessibility (keyboard navigation, ARIA labels)
    - Clean up any console warnings or errors
    - Ensure all tests pass
    - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional testing tasks that can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property-based tests use fast-check library with 100+ iterations per test
- Unit tests validate specific examples and edge cases
- Integration tests verify component interactions and complete user flows
- The implementation follows a bottom-up approach: pure functions → services → UI → integration

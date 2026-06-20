# Design Document: Product Package Tiers

## Overview

This design implements a multi-tier product catalog system for Ubora General Enterprises, transitioning from a single 12,000 TZS product to three distinct packages: Starter (4,000 TZS), Standard (8,000 TZS), and Premium (15,000 TZS). All packages share core content (benefits, testimonials, FAQs, video, rating, reviews) but maintain unique pricing, names, descriptions, and primary product images.

The architecture leverages React component composition to minimize duplication while enabling independent package selection and checkout. State management follows TanStack Router's search parameters for URL-driven state, allowing customers to share package-specific URLs.

## Architecture

### Data Layer

The feature modifies the existing product data model to support multiple packages while maintaining backward compatibility with shared attributes:

```typescript
// Package represents a distinct product tier
interface Package {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

// Product now contains packages and shared content
interface Product {
  id: string;
  rating: number;
  reviewCount: number;
  currency: string;
  videoUrl: string;
  benefits: Benefit[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  packages: Package[];
}
```

### State Management

Package selection flows through TanStack Router's search parameters:

```typescript
interface CheckoutSearch {
  packageId?: string;
  quantity?: number;
  step?: 'info' | 'payment';
}
```

This approach enables:
- URL-driven state persistence (users can bookmark/share package links)
- Browser back/forward navigation support
- Natural separation between route state and component state
- SEO-friendly architecture (each package accessible via unique URL)

### Component Hierarchy

```
App
├── Home (/)
│   ├── HeroVideo (shared)
│   ├── PackageTiers (new)
│   │   ├── PackageCard (new)
│   │   │   ├── ProductCarousel (modified for single package)
│   │   │   └── ProductInfo (modified for package-specific display)
│   │   └── PackageCard (x3)
│   ├── Benefits (shared)
│   ├── Testimonials (shared)
│   ├── FAQ (shared)
│   └── StickyBuy (removed from home)
│
├── Checkout (/checkout?packageId=...)
│   ├── OrderSummary (modified for package)
│   ├── QuantitySelector
│   └── PaymentMethod
│
└── Success (/success?order=...)
```

## Components and Interfaces

### 1. PackageTiers Component (New)

**Purpose:** Display all three packages in tier order with visual hierarchy.

**Props:**
```typescript
interface PackageTiersProps {
  packages: Package[];
  sharedProduct: Omit<Product, 'packages'>;
}
```

**Responsibilities:**
- Render three `PackageCard` components in tier order (Starter → Standard → Premium)
- Apply visual emphasis to Premium tier (recommended badge)
- Handle package card interactions
- Maintain responsive grid layout (1 column mobile, 3 columns desktop)

**Design Decisions:**
- Grid layout with consistent card sizing enables visual comparison
- Recommended badge on Premium highlights upsell opportunity without being pushy
- Cards are equal height for visual harmony
- Animations stagger based on card position for visual interest

### 2. PackageCard Component (New)

**Purpose:** Display a single package with its unique attributes and purchase action.

**Props:**
```typescript
interface PackageCardProps {
  package: Package;
  isRecommended?: boolean;
  sharedProduct: Omit<Product, 'packages'>;
  onSelect: (packageId: string) => void;
}
```

**Key Features:**
- Product image carousel (single featured image, optional carousel)
- Package name, price, description
- Shared rating/review badge
- "Select Package" or "View Details" button
- Optional tier indicator (Starter/Standard/Premium)
- Highlight visual styling for recommended tier

**Behavior:**
- Clicking "Select Package" navigates to `/checkout?packageId={packageId}`
- Hover states provide visual feedback
- Animations on mount (staggered for visual interest)
- Accessible focus states and keyboard navigation

### 3. ProductInfo Component (Modified)

**Current:** Displays single product details

**Changes:**
- Accept `package: Package` parameter instead of full product
- Display package-specific name, price, description
- Keep rating/review count as props (from shared product)
- Remove highlights (move to PackageCard or remove)

**Updated Props:**
```typescript
interface ProductInfoProps {
  package: Package;
  rating: number;
  reviewCount: number;
}
```

### 4. OrderSummary Component (Modified)

**Current:** Accepts `Product` type

**Changes:**
- Accept `package: Package` and `rating/reviewCount` separately
- Display package-specific image and name
- Calculate subtotal using package price
- Show package tier in summary (optional)

**Updated Props:**
```typescript
interface OrderSummaryProps {
  package: Package;
  quantity: number;
  rating: number;
  reviewCount: number;
}
```

### 5. StickyBuy Component (Modified or Removed)

**Current State:** Fixed button showing single product price

**Option A (Recommended):** Remove from home page
- Home displays all packages, each with its own "Select Package" button
- Sticky buy only appears on checkout page
- Cleaner UX, no confusion about which package is being purchased

**Option B (Alternative):** Keep on home but disable
- Show as informational only
- Price displays as "varies by package"
- Direct users to select a package above

**Recommendation:** Implement Option A for clarity.

## Data Models

### Package Schema

```typescript
const packages: Package[] = [
  {
    id: "dagaa-starter",
    name: "Starter Package",
    price: 4_000,
    image: "/images/dagaa-1.jpg",
    description: "Perfect for individuals or small households. Get premium DAGAA at an affordable price. Ideal for trying our product or occasional use.",
  },
  {
    id: "dagaa-standard",
    name: "Standard Package",
    price: 8_000,
    image: "/images/dagaa-4.jpg",
    description: "Our most popular choice. Great for regular household use. Balanced quantity and quality for daily cooking and meals.",
  },
  {
    id: "dagaa-premium",
    name: "Premium Package",
    price: 15_000,
    image: "/images/dagaa-6.jpg",
    description: "Maximum quality and quantity. Perfect for bulk needs, families, or commercial use. Best value for serious DAGAA lovers.",
  },
];

const sharedProduct = {
  id: "ubora-dagaa",
  rating: 4.8,
  reviewCount: 856,
  currency: "TZS",
  videoUrl: "/images/dagaa-video.mp4",
  benefits: [
    { id: "b1", icon: "spark", title: "Lake Victoria Fresh", ... },
    // ... rest of benefits
  ],
  testimonials: [
    // ... 4 testimonials
  ],
  faqs: [
    // ... FAQs
  ],
};
```

### Product Data Structure Update

Current `src/data/product.ts`:
```typescript
// BEFORE: Single product
export const product: Product = { ... };

// AFTER: Product system with packages
export const productTierSystem = {
  packages,
  shared: sharedProduct,
};

export const getPackageById = (id: string): Package | undefined =>
  productTierSystem.packages.find(p => p.id === id);

export const getDefaultPackage = (): Package =>
  productTierSystem.packages[0]; // Starter
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Package Data Consistency and Retrieval

*For any* package in the system, when that package is retrieved multiple times, it SHALL return identical values for id, name, price, image, and description across all retrievals. If the same package exists in different contexts (home page, checkout, order summary), it SHALL display the same package attributes in all contexts.

**Validates: Requirements 1.5, 7.1, 7.4**

### Property 2: Shared Attributes Uniform Across All Packages

*For any* two packages in the system, they SHALL share identical values for rating, reviewCount, videoUrl, benefits array, testimonials array, and FAQs array. No package SHALL have a different set of benefits, testimonials, or FAQs than any other package.

**Validates: Requirements 3.1-3.5, 8.1-8.3, 9.5**

### Property 3: Package Descriptions Uniqueness

*For any* two distinct packages in the system, their descriptions SHALL be different from each other. No two packages SHALL have identical description text.

**Validates: Requirements 2.4**

### Property 4: Package Price Isolation During Updates

*For any* pair of distinct packages, updating the price of one package SHALL not change the price of the other package. Package prices SHALL remain independent and isolated.

**Validates: Requirements 7.2**

### Property 5: Package Selection Flow Correctness

*For any* package selected by a customer on the home page, when that customer navigates to the checkout page with that package's ID, the order summary SHALL display the exact same package name, price, and image that were shown on the home page card.

**Validates: Requirements 5.2, 5.5, 6.1, 6.4**

## Error Handling

### 1. Invalid Package ID

**Scenario:** Customer navigates with invalid `packageId` query parameter

**Handling:**
- Validate `packageId` against available packages in `useEffect`
- If invalid, redirect to home page and display toast: "Package not found. Please select another."
- Log error with package ID for debugging

**Code Pattern:**
```typescript
useEffect(() => {
  const pkg = getPackageById(searchParams.packageId);
  if (searchParams.packageId && !pkg) {
    navigate({ to: "/" });
    toast.error("Package not found.");
  }
}, [searchParams.packageId]);
```

### 2. Missing Shared Product Data

**Scenario:** Shared product data (benefits, testimonials) fails to load

**Handling:**
- Render skeleton loaders for shared sections
- After 5-second timeout, display error message: "Unable to load product details"
- Provide "Retry" button to reload data
- Packages remain selectable even if shared data is missing

### 3. Checkout Without Package Selection

**Scenario:** User navigates directly to `/checkout` without selecting a package

**Handling:**
- Detect missing `packageId` in checkout route
- Redirect to home page with message: "Please select a package first"
- Store attempted checkout location for potential recovery

### 4. Payment Processing Failure

**Scenario:** Payment method selection or processing fails

**Handling:**
- Disable submit button if payment method is invalid
- Show error message below payment section
- Allow user to retry payment method selection
- Display support contact info for persistent failures

## Testing Strategy

### Unit Tests

#### PackageCard Component
- **Test:** Render PackageCard with starter package, verify name, price, and image display correctly
- **Test:** Click "Select Package" button, verify navigation to `/checkout?packageId=dagaa-starter`
- **Test:** Verify recommended badge appears only on Premium tier card
- **Test:** Verify each package card shows rating 4.8 and reviewCount 856

#### Package Data
- **Test:** Verify all packages have unique IDs (dagaa-starter, dagaa-standard, dagaa-premium)
- **Test:** Verify all packages reference identical benefits array
- **Test:** Verify all packages reference identical testimonials array
- **Test:** Verify all packages reference identical FAQs array
- **Test:** Verify all packages have videoUrl === "/images/dagaa-video.mp4"

#### OrderSummary Component
- **Test:** Pass Starter package (4,000 TZS) with quantity 1, verify subtotal displays as 4,000 TZS
- **Test:** Pass Standard package (8,000 TZS) with quantity 3, verify subtotal displays as 24,000 TZS
- **Test:** Verify OrderSummary displays package name (not hardcoded value)
- **Test:** Verify OrderSummary displays correct package image

### Integration Tests

#### Home Page Package Display
- Render home page
- Verify exactly three PackageCard components appear
- Verify packages display in order: Starter (4,000), Standard (8,000), Premium (15,000)
- Verify each package card displays its unique name, price, image, and description
- Verify package descriptions are different from each other

#### Checkout Flow - Package Switching
- Select Starter package, navigate to checkout
- Verify OrderSummary shows: Starter Package, 4,000 TZS, dagaa-1 image
- Navigate back, select Premium package, navigate to checkout
- Verify OrderSummary shows: Premium Package, 15,000 TZS, dagaa-6 image (not Starter data)

#### Shared Content Consistency
- Navigate to checkout with Starter package
- Scroll to Benefits section
- Navigate back, select Premium, navigate to checkout
- Scroll to Benefits section
- Verify Benefits content is identical in both views

#### Price Accuracy in Checkout
- For each package (Starter, Standard, Premium):
  - Navigate to checkout with that package
  - Verify displayed price matches package price (4,000 / 8,000 / 15,000)
  - Verify payment methods are available
  - Verify final order summary shows correct package price × quantity

### Property-Based Tests

#### Property 1: Package Data Consistency and Retrieval (PBT)

**Test:** For any package ID in the system, retrieving it multiple times returns identical data

```typescript
fc.property(
  fc.constantFrom('dagaa-starter', 'dagaa-standard', 'dagaa-premium'),
  (packageId: string) => {
    const pkg1 = getPackageById(packageId);
    const pkg2 = getPackageById(packageId);
    const pkg3 = getPackageById(packageId);
    
    assert(pkg1.id === pkg2.id && pkg2.id === pkg3.id);
    assert(pkg1.name === pkg2.name && pkg2.name === pkg3.name);
    assert(pkg1.price === pkg2.price && pkg2.price === pkg3.price);
    assert(pkg1.image === pkg2.image && pkg2.image === pkg3.image);
    assert(pkg1.description === pkg2.description && pkg2.description === pkg3.description);
  }
);
```

**Validates: Requirements 1.5, 7.1, 7.4**
**Minimum iterations:** 100
**Tag: Feature: product-package-tiers, Property 1: Package Data Consistency and Retrieval**

---

#### Property 2: Shared Attributes Uniform Across All Packages (PBT)

**Test:** For any two packages, their shared attributes (rating, reviewCount, videoUrl, benefits, testimonials, faqs) are identical

```typescript
fc.property(
  fc.tuple(
    fc.constantFrom('dagaa-starter', 'dagaa-standard', 'dagaa-premium'),
    fc.constantFrom('dagaa-starter', 'dagaa-standard', 'dagaa-premium')
  ),
  ([packageId1, packageId2]: [string, string]) => {
    const pkg1 = getPackageById(packageId1);
    const pkg2 = getPackageById(packageId2);
    
    assert(pkg1.rating === pkg2.rating);
    assert(pkg1.reviewCount === pkg2.reviewCount);
    assert(pkg1.videoUrl === pkg2.videoUrl);
    assert(deepEqual(pkg1.benefits, pkg2.benefits));
    assert(deepEqual(pkg1.testimonials, pkg2.testimonials));
    assert(deepEqual(pkg1.faqs, pkg2.faqs));
  }
);
```

**Validates: Requirements 3.1-3.5, 8.1-8.3, 9.5**
**Minimum iterations:** 100
**Tag: Feature: product-package-tiers, Property 2: Shared Attributes Uniform Across All Packages**

---

#### Property 3: Package Descriptions Uniqueness (PBT)

**Test:** For any two distinct packages, their descriptions are different

```typescript
fc.property(
  fc.tuple(
    fc.constantFrom('dagaa-starter', 'dagaa-standard', 'dagaa-premium'),
    fc.constantFrom('dagaa-starter', 'dagaa-standard', 'dagaa-premium')
  ),
  ([packageId1, packageId2]: [string, string]) => {
    if (packageId1 === packageId2) return; // Skip identical pairs
    
    const pkg1 = getPackageById(packageId1);
    const pkg2 = getPackageById(packageId2);
    
    assert(pkg1.description !== pkg2.description);
  }
);
```

**Validates: Requirements 2.4**
**Minimum iterations:** 100
**Tag: Feature: product-package-tiers, Property 3: Package Descriptions Uniqueness**

---

#### Property 4: Package Price Isolation During Updates (PBT)

**Test:** Updating one package's price does not affect other packages

```typescript
fc.property(
  fc.tuple(
    fc.constantFrom('dagaa-starter', 'dagaa-standard', 'dagaa-premium'),
    fc.constantFrom('dagaa-starter', 'dagaa-standard', 'dagaa-premium'),
    fc.integer({ min: 1000, max: 50000 })
  ),
  ([packageId1, packageId2, newPrice]: [string, string, number]) => {
    if (packageId1 === packageId2) return; // Skip identical pairs
    
    // Get original price of package2
    const pkg2Original = getPackageById(packageId2);
    const originalPrice2 = pkg2Original.price;
    
    // Update package1 price
    updatePackagePrice(packageId1, newPrice);
    
    // Verify package2 price unchanged
    const pkg2After = getPackageById(packageId2);
    assert(pkg2After.price === originalPrice2);
  }
);
```

**Validates: Requirements 7.2**
**Minimum iterations:** 100
**Tag: Feature: product-package-tiers, Property 4: Package Price Isolation During Updates**

---

#### Property 5: Package Selection Flow Correctness (PBT)

**Test:** For any package selected from home page, checkout displays the same package data

```typescript
fc.property(
  fc.constantFrom('dagaa-starter', 'dagaa-standard', 'dagaa-premium'),
  (packageId: string) => {
    const cardPackage = getPackageById(packageId);
    
    // Simulate navigation to checkout with this packageId
    const checkoutPackage = getPackageFromCheckout(packageId);
    
    assert(cardPackage.name === checkoutPackage.name);
    assert(cardPackage.price === checkoutPackage.price);
    assert(cardPackage.image === checkoutPackage.image);
  }
);
```

**Validates: Requirements 5.2, 5.5, 6.1, 6.4**
**Minimum iterations:** 100
**Tag: Feature: product-package-tiers, Property 5: Package Selection Flow Correctness**

---

### Testing Approach Summary

- **Unit Tests (20-25 tests)**: Focus on component rendering, price calculations, and individual package data
- **Integration Tests (8-10 tests)**: Focus on end-to-end flows (home → checkout → success)
- **Property Tests (5 tests, 500+ iterations total)**: Verify universal properties hold across all packages
- **Expected Coverage**: 95%+ line coverage, all acceptance criteria covered

**Test Framework Stack:**
- **Unit/Integration:** Vitest or Jest
- **Property-Based:** fast-check (JavaScript/TypeScript)
- **React Testing:** React Testing Library
- **E2E (Optional):** Playwright or Cypress




Design a **high-fidelity, production-ready, multi-tenant B2B SaaS Pharmacy Management Platform** for **desktop, tablet, and mobile**. The product must combine **Pharmacy Management**, **Point of Sale (POS)**, **Shift Management**, **Inventory**, **Purchasing**, and **Reporting** in one scalable system.

Use a visual style **inspired by modern pharmacy dashboard references**: a **dark pharmacy-green sidebar**, **soft neutral/light-gray page background**, **rounded white cards**, **compact KPI widgets**, **clean tables**, and a **professional medical-retail feel**. Keep that overall dashboard mood, but improve it with:
- cleaner spacing
- stronger typography hierarchy
- more premium visual polish
- better responsive behavior
- clearer feature separation
- more realistic pharmacy workflows
- stronger B2B SaaS structure

The result should feel like a **serious operating system for pharmacy businesses**, not a generic e-commerce dashboard or a simple admin template.

---

## Product Positioning

This application is **not a single-store dashboard**. It is a **multi-tenant SaaS platform** where each pharmacy business is a **tenant/workspace** with its own:
- organization profile
- branches
- users
- permissions
- data
- settings
- subscription/package
- enabled features

Design the experience as a **scalable B2B SaaS product** with a **feature-based modular structure**, tenant-aware navigation, branch-aware workflows, and future-ready expansion.

---

## Core Product Requirements

- **Multi-tenant SaaS architecture**
- **Multi-branch ready**
- **Bilingual English + Arabic**
- **Arabic layouts must support full RTL**
- Main users are **Owner** and **Pharmacist on shift**
- Two clearly separated but connected product domains:
  1. **Medicines**
  2. **Cosmetics**
- Supports **orders from companies and representatives**
- Includes **intelligent search and advanced filtering**
- Supports **barcode scanner workflow** in the UI
- Supports **receipt printer workflow** in POS layouts
- Designed with **modular features** and scalable SaaS navigation

---

## Information Architecture

Organize the product as a **feature-based system**, not just disconnected pages.

### SaaS Platform Management Layer
- Auth
- Organization / Workspace
- Onboarding / Setup
- Branches
- Users & Roles
- Subscription / Billing
- Feature availability / locked states
- Settings

### Pharmacy Operations Layer
- Dashboard
- POS
- Medicines
- Cosmetics
- Inventory
- Purchasing
- Suppliers / Companies
- Representatives
- Orders
- Stock Transfers
- Expiry & Batch Tracking
- Shifts
- Reports

The UI should clearly show that the platform can grow as new branches, modules, and premium features are added.

---

## Reference Style Direction

Use a visual style close to **modern pharmacy admin dashboard references**:
- dark green vertical sidebar
- clean top header
- light neutral background
- rounded white cards
- compact KPI cards
- table-first back-office design
- green status accents
- clean medical-retail aesthetic

Keep that style close **in spirit**, but enhance it with:
- more polished spacing and alignment
- stronger readability for dense operational data
- more premium badges, filters, tabs, and forms
- more deliberate empty states and status states
- better tablet/mobile responsiveness
- a more refined, trustworthy SaaS look

Avoid:
- playful consumer-app styling
- generic e-commerce visuals
- cluttered dashboards with weak hierarchy
- overly decorative medical visuals

The visual tone should be:
- modern
- operational
- trustworthy
- premium
- pharmacy-specific
- SaaS-ready

---

## UX Goals

Design for users working in real pharmacy conditions:
- fast transactions under pressure
- quick product lookup
- easy stock review
- strong visibility for low stock and near-expiry items
- quick branch-aware decisions
- clear shift workflows
- easy scanning of dense operational data

The interface must balance:
- **speed for POS operations**
- **clarity for inventory and reports**
- **structure for SaaS administration**

---

## Required Screens and Modules

### 1) Authentication
Create a clean bilingual login experience.

Include:
- Login screen
- Language switcher
- English / Arabic support
- professional pharmacy branding
- future-ready role-aware access patterns

---

### 2) SaaS Onboarding / Workspace Setup
Design a first-time tenant onboarding flow.

Include:
- organization/workspace setup
- pharmacy basic information
- first branch setup
- subscription/package awareness
- guided setup progress
- empty states for first product, first branch, first shift

This should feel like a real SaaS onboarding experience.

---

### 3) Dashboard
Create a KPI-driven pharmacy business dashboard.

Include:
- total sales
- profit
- low stock count
- near-expiry count
- expired items
- open shift status
- branch overview
- top-selling products
- recent activity
- sales trend chart
- branch switcher/filter
- quick actions: open POS, start shift, add product, create purchase order

The dashboard should feel close to a modern pharmacy admin reference but improved with stronger hierarchy and production-level polish.

---

### 4) POS / Checkout
Create a **separate focused POS experience** that is visually related to the dashboard but much more operational, faster, and action-driven.

Design it for:
- barcode scanner input
- keyboard-heavy desktop use
- touch-friendly tablet use

Include:
- large barcode input
- intelligent product search
- quick toggle between **Medicines** and **Cosmetics**
- fast product grid or quick results list
- cart panel
- quantity adjustments
- line-item editing
- discount support
- customer info
- multiple payment methods
- hold/resume sale
- return/refund flow
- receipt preview
- printer-aware receipt workflow
- current shift indicator
- branch awareness

The POS must feel fast, compact, and highly usable for pharmacy staff.

---

### 5) Medicines Module
Create a dedicated medicines management section with pharmacy-specific structure.

Include list/table views and details for:
- product name
- barcode
- scientific name
- trade name
- category
- supplier/company
- representative
- batch number
- expiry date
- purchase price
- selling price
- stock quantity
- reorder level
- branch availability
- prescription-required flag
- controlled medicine flag placeholder

Use clear status indicators for:
- low stock
- near expiry
- expired
- branch availability

---

### 6) Cosmetics Module
Create a separate but visually consistent cosmetics section.

Include:
- product name
- barcode
- brand
- category
- supplier/company
- purchase price
- selling price
- stock quantity
- reorder level
- branch availability

This should feel lighter than the medicines module but still connected to the same system.

---

### 7) Add / Edit Product
Create structured product forms.

Requirements:
- medicines form should be more pharmacy-specific
- cosmetics form should be lighter and retail-focused
- use grouped sections or tabs
- support branch availability
- support supplier/company and representative selection
- support batch and expiry for medicines
- include image upload placeholder where useful
- include validation-friendly layouts

---

### 8) Intelligent Search and Filter System
This is a core product feature. Design it as one of the strongest UX patterns in the platform.

Include:
- global search
- barcode search
- medicines/cosmetics filter
- category filter
- company filter
- representative filter
- branch filter
- stock status filter
- expiry / near-expiry filter
- availability filter
- price range
- sort options
- saved filters
- advanced filter drawer or panel

This should feel premium, fast, and powerful for internal operations.

---

### 9) Purchasing / Orders
Design workflows for handling orders from:
- **companies**
- **representatives**

Include:
- suppliers / companies list
- representatives list
- purchase order creation
- order detail screens
- order status tracking
- received items flow
- invoice / delivery details
- payment status
- branch destination
- order history

Clearly distinguish **company-based orders** from **representative-based orders**, while keeping the workflow consistent.

---

### 10) Inventory, Stock, and Expiry Management
Design a robust stock management experience.

Include:
- stock movements
- stock adjustments
- low stock alerts
- near-expiry table
- expired stock table
- batch-level tracking for medicines
- branch inventory overview
- branch transfers
- stock history

Highlight urgency clearly for expiry-related workflows.

---

### 11) Shift Management
Design a real pharmacy shift workflow.

Include:
- open shift
- start cash
- current shift status panel
- cash in / cash out
- shift sales summary
- end shift summary
- shortage / overage
- printable closing report layout
- close shift confirmation

Make this area practical and audit-friendly.

---

### 12) Reports
Create professional report screens for:
- sales
- profit
- stock
- low stock
- expiry
- purchases
- branch comparison
- shift summaries
- product performance

Use:
- filters
- export placeholders
- branch-aware analytics
- date range controls
- clear chart/table combinations

---

### 13) Branch Management
Because this is SaaS and multi-branch ready, create branch management screens.

Include:
- branch list
- add/edit branch
- branch status
- branch details
- branch inventory overview
- branch filter/switcher
- transfer-related context

This should feel foundational to the platform architecture.

---

### 14) Users, Roles, and Permissions
Create B2B SaaS access-control screens.

Include:
- users list
- invite user
- role assignment
- owner and pharmacist roles
- permission placeholders
- branch-scoped access awareness

Use layouts that can scale later to more roles.

---

### 15) Subscription / Billing / Feature Availability
Since the platform is SaaS, include plan awareness in the UI.

Include:
- subscription/package screen
- current plan overview
- usage/limits placeholders
- feature availability states
- locked premium features
- upgrade prompt patterns
- billing/settings placeholders

Examples of plan-gated features can include:
- multi-branch access
- advanced reports
- representative order workflows
- branch transfers
- audit logs
- advanced printer settings

---

### 16) Settings
Create a structured settings area.

Include:
- organization settings
- branch settings
- language preferences
- receipt/printer settings
- barcode settings
- profile settings
- VAT/tax placeholders
- feature configuration placeholders

---

## Responsive Requirements

Design for three breakpoints / device modes:

### Desktop
- primary full operational experience
- dashboard-heavy
- full POS
- dense data tables
- advanced filters and reports

### Tablet
- comfortable in-store operational experience
- POS-friendly touch layout
- stock lookup and receiving workflows
- simplified but still powerful management views

### Mobile
- optimized for:
  - quick dashboard checks
  - stock lookup
  - order checks
  - shift status
  - low stock / expiry review
  - quick actions
- do not simply shrink desktop screens
- redesign layouts intelligently for smaller screens

---

## Design System Requirements

Create a reusable design system for the product.

Include:
- sidebar navigation
- top navigation/header
- branch switcher
- language switcher
- cards
- KPI widgets
- tables
- tabs
- forms
- modals
- drawers
- filter panels
- badges
- chips/status pills
- charts
- search bars
- date pickers
- dropdowns
- bilingual typography support
- RTL-ready components

The system should be scalable and suitable for future expansion.

---

## SaaS-Specific UX Patterns

Reflect the SaaS nature of the app in the UI by including:
- workspace identity / organization context
- onboarding states
- feature-gated states
- upgrade prompts
- locked feature cards
- branch-aware filtering
- reusable modular navigation
- tenant-aware settings structure
- empty states for new tenants

Make the product feel like a real B2B SaaS platform with clean feature boundaries.

---

## Visual and Content Quality Constraints

- Do not make this look like a generic online shop dashboard.
- Do not make it feel consumer-oriented.
- Do not overuse decorative medical imagery.
- Keep the layout realistic for real pharmacy operations.
- Use dense but readable information design.
- Prioritize clarity, speed, and trust.
- Make medicines and cosmetics clearly distinct in the UI.
- Make search/filter interactions feel advanced and premium.
- Make POS clearly optimized for barcode, speed, and receipt printing.
- Make dashboard and reports suitable for a real business owner.

---

## Keywords for Style Guidance

Use these keywords internally while designing:
- modern pharmacy dashboard
- medical retail SaaS
- premium B2B admin
- green-accent operational UI
- pharmacy POS system
- bilingual Arabic English
- RTL-ready enterprise interface
- multi-branch inventory platform
- pharmacy operations dashboard
- intelligent product search

---

## Deliverables

Generate:
- high-fidelity screens
- reusable design system
- desktop, tablet, and mobile layouts
- SaaS management layer screens
- pharmacy operational layer screens
- dashboard, POS, medicines, cosmetics, inventory, orders, reports, shifts, branches, users, subscription, and settings

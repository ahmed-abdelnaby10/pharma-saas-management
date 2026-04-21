Design a modern web-based Platform Admin dashboard for the SaaS owner of a multi-tenant Pharmacy Management System.

Important:
- Do NOT design the tenant pharmacy app
- Focus ONLY on the internal Platform Admin experience for the SaaS owner and internal operations team
- This is a B2B SaaS control center to manage pharmacy clients, subscriptions, plans, invoices, free trials, feature access, support, and account lifecycle

==================================================
PRODUCT CONTEXT
==================================================

This Platform Admin is for the SaaS owner to manage pharmacy businesses that subscribe to the system.

Each pharmacy client is a tenant.

The SaaS owner needs to:
- view all tenants
- manage plans
- manage subscriptions
- start and extend free trials
- activate, suspend, reactivate, cancel, or archive tenants
- view invoices and billing status
- grant or revoke feature access per tenant
- override plan limits
- view account usage
- monitor system health and platform KPIs
- support customers
- inspect audit logs
- optionally impersonate tenant owners for support

This is an enterprise internal admin system, not a marketing site and not a pharmacy POS app.

==================================================
DESIGN STYLE
==================================================

Create a premium SaaS admin design with:
- clean, modern, enterprise-grade UI
- desktop-first layout
- light theme
- white and soft gray surfaces
- subtle green / teal accents inspired by pharmacy and healthcare
- spacious layout
- sharp hierarchy
- rounded cards
- polished tables
- modern charts
- dense but readable data UI
- design system consistency
- reusable components
- realistic admin dashboard styling
- suitable for implementation in React + TypeScript later

The design should feel like:
- Stripe admin
- Linear quality
- modern SaaS ops dashboard
- polished internal tool
- highly usable for operations, billing, and support teams

==================================================
PRIMARY USER ROLES
==================================================

Design for these internal platform roles:
- Super Admin
- Billing Admin
- Support Agent
- Operations Admin

Show permission-aware actions where useful, such as:
- some users can manage billing
- some can suspend/reactivate tenants
- some can view only
- some can impersonate for support

==================================================
INFORMATION ARCHITECTURE
==================================================

Create the Platform Admin with this navigation:

Main nav:
- Dashboard
- Tenants
- Subscriptions
- Plans
- Invoices
- Feature Overrides
- Usage & Limits
- Support
- Audit Logs
- System Metrics
- Settings

Optional secondary sections:
- Notifications
- Queue Monitor
- OCR Usage
- Staff / Internal Admin Users

==================================================
MAIN SCREENS TO DESIGN
==================================================

Create high-fidelity desktop screens for the following:

1) Platform Dashboard
Purpose:
overall SaaS control center

Include:
- KPI cards:
  - total tenants
  - active tenants
  - trialing tenants
  - suspended tenants
  - past due tenants
  - MRR
  - ARR
  - overdue invoices
- charts:
  - revenue trend
  - subscriptions by month
  - tenant status distribution
- widgets:
  - trials ending soon
  - overdue invoices
  - recent signups
  - recent account suspensions
  - feature usage summary
  - support alerts
- quick actions:
  - create tenant
  - start free trial
  - create invoice
  - assign plan
  - suspend tenant

2) Tenants List
Purpose:
manage all pharmacy clients

Include:
- powerful searchable table
- columns:
  - tenant name
  - owner
  - plan
  - status
  - trial end
  - renewal date
  - branches used
  - users used
  - MRR
  - unpaid balance
  - last activity
- filters:
  - by status
  - by plan
  - by billing status
  - by trialing/active/suspended
  - by branch count
  - by date joined
- bulk actions:
  - assign plan
  - suspend
  - reactivate
  - extend trial
- row actions menu:
  - view details
  - edit
  - invoices
  - subscription
  - feature overrides
  - impersonate

3) Tenant Details Page
Purpose:
single customer control center

Layout:
left summary panel + main content tabs

Header includes:
- tenant name
- status badge
- current plan
- billing status
- buttons:
  - suspend
  - reactivate
  - extend trial
  - change plan
  - add feature override
  - impersonate

Summary panel:
- owner info
- company info
- created date
- branches count
- users count
- current usage summary
- last login / last activity
- unpaid balance

Tabs:
- Overview
- Subscription
- Invoices
- Features
- Usage
- Activity
- Notes
- Audit

Overview tab:
- account summary cards
- recent activity
- support notes
- lifecycle timeline

Subscription tab:
- current plan
- billing cycle
- trial start / end
- renewal date
- status
- payment status
- upgrade / downgrade history

Invoices tab:
- invoice table
- statuses:
  - draft
  - open
  - paid
  - overdue
  - void
- actions:
  - view invoice
  - download PDF
  - mark as paid
  - resend

Features tab:
- enabled features from plan
- overridden features
- usage limits
- override expiration
- toggles or controls for temporary enable/disable

Usage tab:
- branches used vs max
- users used vs max
- OCR pages used vs quota
- storage / API usage placeholders
- progress bars and warning states

Activity / Audit tab:
- lifecycle events
- plan changes
- trial changes
- support actions
- feature override changes
- billing activity
- impersonation logs

4) Subscriptions Page
Purpose:
see and manage all subscriptions

Include:
- list/table of subscriptions
- filters by status and plan
- statuses:
  - trialing
  - active
  - past due
  - canceled
  - expired
- columns:
  - tenant
  - plan
  - billing cycle
  - status
  - trial end
  - renewal
  - cancel at period end
  - amount
- side drawer or detail panel for editing subscription
- actions:
  - change plan
  - start trial
  - extend trial
  - activate
  - cancel
  - suspend for non-payment

5) Plans & Features Page
Purpose:
define commercial plans

Include:
- plan cards or table
- plans like:
  - Starter
  - Growth
  - Pro
  - Enterprise
- each plan shows:
  - price monthly/yearly
  - included features
  - limits
- detail editor for:
  - features list
  - max branches
  - max users
  - max monthly OCR pages
  - advanced reports
  - multi-branch
  - branch transfers
  - OCR import
  - prescription tracking
  - batch tracking
  - expiry tracking

6) Invoices & Billing Page
Purpose:
manage billing operations

Include:
- invoices table
- filters:
  - paid
  - unpaid
  - overdue
  - due soon
  - by month
  - by plan
- invoice details drawer/page
- summary cards:
  - total billed
  - total paid
  - overdue amount
  - unpaid invoices count
- actions:
  - create invoice
  - resend invoice
  - mark paid
  - void
  - export
- realistic invoice detail design with line items, totals, dates, status badge

7) Feature Overrides Page
Purpose:
control tenant-specific exceptions

Include:
- tenant selector or searchable table
- view of:
  - feature key
  - default from plan
  - override state
  - limit override
  - start date
  - end date
  - reason
- examples:
  - enable OCR temporarily
  - increase max users
  - extend branch limit
  - disable advanced reports
- actions:
  - add override
  - edit
  - expire
  - remove

8) Usage & Limits Page
Purpose:
monitor consumption and quota risks

Include:
- tenant usage table
- columns:
  - tenant
  - plan
  - branches used/max
  - users used/max
  - OCR used/max
  - warning state
- progress bars
- color-coded warning indicators
- top over-limit or near-limit customers

9) Support Tools Page
Purpose:
help internal support team

Include:
- support search for tenant
- quick tenant lookup
- support timeline
- internal notes
- recent support actions
- impersonation entry point
- account health snapshot
- open incidents placeholder
- customer communication history placeholder

10) Audit Logs Page
Purpose:
full internal accountability

Include:
- searchable log table
- columns:
  - timestamp
  - actor
  - role
  - action
  - target tenant
  - module
  - result
- filters:
  - by actor
  - by action
  - by date
  - by module
  - by tenant
- event detail side panel

11) System Metrics Page
Purpose:
platform operations overview

Include:
- API health cards
- worker / queue status
- OCR pipeline usage
- failed jobs
- processing times
- active sessions
- platform-wide event volume
- placeholder charts for infrastructure monitoring

==================================================
COMPONENTS TO DESIGN
==================================================

Create reusable admin components:
- top app shell
- left sidebar navigation
- page header
- KPI stat cards
- advanced data table
- filter toolbar
- search input
- status badges
- usage progress bars
- charts
- right-side details drawer
- modal forms
- tabs
- audit timeline
- notes panel
- empty states
- warning banners
- confirmation dialogs
- role-based action buttons

==================================================
DATA / UX DETAILS
==================================================

Use realistic SaaS admin data and states:
- trial ending in 3 days
- overdue invoice
- suspended tenant
- tenant near branch limit
- tenant over OCR quota
- past due subscription
- enterprise client with override
- feature temporarily enabled until a date

Status badges should look polished:
- Trialing
- Active
- Suspended
- Past Due
- Canceled
- Archived
- Paid
- Overdue
- Draft
- Open

Include useful admin UX patterns:
- sticky table headers
- filters and saved views
- action menus
- details side panel
- bulk actions
- warning alerts
- success/error toast placeholders
- confirmation modal for risky actions like suspend tenant

==================================================
FIGMA OUTPUT EXPECTATION
==================================================

Create:
- a cohesive multi-page Platform Admin UI
- desktop screens only
- reusable component patterns
- consistent typography, spacing, color, and tables
- clear admin hierarchy
- polished visual design ready to inspire product implementation

Again:
ONLY create the Platform Admin for the SaaS owner.
DO NOT create the pharmacy tenant app.
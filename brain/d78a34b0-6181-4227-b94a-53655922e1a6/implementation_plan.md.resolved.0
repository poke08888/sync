# Implementation Plan - KOC Reporting System

## Goal Description
Build a premium, high-performance web application for tracking KOC (Key Opinion Consumer) livestream metrics. The system will provide a comprehensive dashboard, KOC management tools, and detailed analytics reports.

## User Review Required
> [!IMPORTANT]
> **Styling Strategy**: We will use **Vanilla CSS** with CSS Variables and CSS Modules to ensure maximum flexibility and a custom premium feel, adhering to the "No Tailwind" rule unless requested.
> **Tech Stack**: Next.js 14+ (App Router), TypeScript.
> **Icons**: Lucide React.
> **Charts**: Recharts or Chart.js (via react-chartjs-2).

## Proposed Changes

### Project Setup
#### [NEW] [koc-reporting-system](file:///Users/kevin/Code/koc-reporting-system)
- Initialize Next.js application.
- Configure `eslint`, `typescript`.
- Setup `styles/globals.css` with HSL color variables for a dark, premium theme (Glassmorphism).

### Core Components
#### [NEW] [Layout](file:///Users/kevin/Code/koc-reporting-system/src/components/layout)
- `Sidebar.tsx`: Navigation menu with hover effects.
- `Header.tsx`: Global search and user profile.
- `MainLayout.tsx`: Wrapper for page content.

### Features

#### 1. Dashboard (`/`)
- **Metrics**: Display cards for Revenue, Ads, Live Hours, etc.
- **Charts**: 
  - Revenue Trend (Line Chart)
  - Ads vs Organic (Pie/Bar Chart)
- **Filters**: Day/Week/Month toggle.

#### 2. KOC Management (`/kocs`)
- **List View**: Table of KOCs with summary stats.
- **Add KOC**: Form to input KOC details (Name, ID, Link, Phone, Address).
- **Import**: Excel upload for bulk KOC creation.

#### 3. Data Upload (`/upload`)
- **Reporting Data**: Excel upload to ingest daily/weekly performance metrics.
- **Parsing**: Logic to read Excel columns and map to system metrics.

#### 4. KOC Detail (`/kocs/[id]`)
- **Profile**: KOC info.
- **Specific Analytics**: Deep dive into a single KOC's performance.

## Verification Plan

### Automated Tests
- Build verification: `npm run build`.
- Lint check: `npm run lint`.

### Manual Verification
- **Dashboard**: Verify charts render and respond to time filters.
- **Upload**: Test Excel upload with sample data and check if metrics update.
- **Responsiveness**: Check layout on different screen sizes.

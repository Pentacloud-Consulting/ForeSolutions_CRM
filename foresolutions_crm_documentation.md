# ForeSolutions Custom CRM - System Documentation

This document provides a comprehensive overview of the ForeSolutions Custom CRM, specifically tailored for B2B technology and telematics operations. It details the architecture, data models, features, and operational workflows of the platform.

## 1. Architecture & Tech Stack

The CRM is built as a modern, serverless web application designed for high performance and real-time data synchronization.

- **Frontend Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (customized with a unified CSS variable design system in `globals.css`)
- **State Management**: React Context API (`DataContext.tsx`) providing a unified global state for all CRM modules.
- **Database**: MongoDB (Atlas) accessed via Mongoose ORM.
- **API Layer**: Next.js Serverless Route Handlers (`/api/crm` and `/api/crm/action`) handling all CRUD operations via a centralized action dispatcher.
- **Deployment**: Vercel

---

## 2. Core Data Models

The system architecture revolves around several key entities defined in `src/lib/models.ts` and strongly typed via TypeScript interfaces in `src/lib/types.ts`.

### CRM Core
- **Lead**: Initial inquiries or prospective clients. Tracks basic contact info, budget, requirement type, and status (`New`, `Contacted`, `Qualified`, `Lost`).
- **Account**: Business entities or companies. Created when a Lead is converted.
- **Contact**: Individual people associated with an Account.
- **Project (Deal)**: The core operational entity. Represents an active business opportunity or contract with a client. Tracks deal value, status (`Planning`, `In Progress`, `Closed Won`, `Closed Lost`), and timelines.

### B2B Technology & Telematics (ForeSolutions Specific)
- **InventoryProduct**: The global catalog of hardware, software, and services offered by ForeSolutions. Tracks `productName`, `category` (Hardware, Software, Service, Subscription), `billingType` (One-Off, Monthly, Annual), and `unitPrice`.
- **DealInventoryItem**: Specific products allocated to a particular Deal (Project). This forms the basis of all financial calculations and quoting.
- **QuotationModel**: Snapshots of the Deal Inventory generated for client approval. Includes frozen pricing, line items, and VAT calculations.
- **PurchaseOrder**: Documents generated for vendors to procure hardware or services required for a specific Deal. Tracks vendor details, delivery costs, and stock types.

---

## 3. Key Workflows

### A. Lead Conversion Workflow
1. A new `Lead` is captured in the system.
2. Once the lead is qualified, the user triggers a "Convert" action.
3. The system automatically provisions three linked records: an `Account` (the business), a `Contact` (the individual), and a `Project` (the specific Deal).
4. The original Lead is marked as `Converted`.

### B. Global Inventory Management
- Administrators manage a centralized product catalog (`InventoryProduct`) via the **Inventory** module.
- Products are categorized and assigned standard unit prices and billing frequencies, ensuring standardized quoting across the sales team.

### C. Deal Inventory & Quoting Workflow
1. Inside a specific Deal (Project), the user accesses the **Deal Inventory** tab.
2. Users add items from the Global Inventory to the Deal, specifying quantities.
3. The system dynamically calculates sub-totals and the overall `projectContractValue` based on the items in the Deal.
4. **Generate Quotation**: The user finalizes the deal items and clicks "Generate Quote". The system creates a `QuotationModel` record and renders a professional, print-ready document (`TechQuotationPrintLayout`) formatted for A4 printing/PDF export.

### D. Purchase Order (PO) Workflow
1. Once a Quotation is confirmed by the client, the user proceeds to generate a Purchase Order.
2. The user selects the required hardware/items from the Deal Inventory, assigns them to a specific vendor, and adds delivery costs.
3. The system creates a `PurchaseOrder` record.
4. A professional, print-ready PO document (`TechPOPrintLayout`) is generated, detailing the vendor address, delivery location, items, rates, and VAT calculations.

---

## 4. State Management & API

The CRM utilizes an optimistic UI pattern powered by `DataContext.tsx` to ensure a snappy user experience.

- **Initial Load**: On application mount, `DataContext` makes a single `GET` request to `/api/crm` to fetch the entire database state into memory.
- **Mutations**: When a user performs an action (e.g., adds a lead), `DataContext`:
  1. Instantly updates the local React state (Optimistic UI update).
  2. Dispatches a background `POST` request to `/api/crm/action` with a specific action type (e.g., `addLead`) and payload.
- **Database Synchronization**: The serverless route parses the action, performs the corresponding Mongoose operation (e.g., `Lead.create()`), and persists the data to MongoDB Atlas.

> [!NOTE] 
> **Database Case Sensitivity**
> MongoDB Atlas databases are strictly case-sensitive. The environment variable `MONGODB_URI` must perfectly match the case of the database created in the Atlas console (e.g., `ForeSOlution`) to ensure data persists correctly.

---

## 5. Security & Permissions

- **Role-Based Access**: The CRM includes a rudimentary permission system (`src/lib/permissions.ts`) designed to restrict certain actions (like deleting financial records) based on user roles (`Admin`, `Manager`, `Sales`).
- **Environment Variables**: Sensitive connection strings (`MONGODB_URI`) are excluded from version control and securely injected at runtime via Vercel environment variables or local `.env.local` files.

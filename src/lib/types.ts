// ============================================================
// PENTAHOUSE CRM — Type Definitions
// ============================================================

export type UserRole = 'admin' | 'sales' | 'project_manager' | 'accountant';

export interface User {
  username: string;
  role: UserRole;
  displayName: string;
}

// ── Leads ──────────────────────────────────────────────────
export type LeadSource = 'Referral' | 'Walk-in' | 'Social Media' | 'Website' | 'Other';
export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Follow Up'
  | 'Site Visit Scheduled'
  | 'Proposal Sent'
  | 'Qualified'
  | 'Lost'
  | 'Converted';

export interface Lead {
  id: string;
  leadName: string;
  companyName: string;
  industry: string;
  mobile: string;
  alternateMobile: string;
  email: string;
  address: string;
  city: string;
  interestedIn: string;
  budget: number | null;
  leadSource: LeadSource;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ── Accounts ───────────────────────────────────────────────
export interface Account {
  id: string;
  clientName: string;
  companyRegistrationNumber: string;
  vatNumber: string;
  industry: string;
  website: string;
  mobile: string;
  alternateMobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  notes: string;
  convertedFromLeadId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Contacts ───────────────────────────────────────────────
export interface Contact {
  id: string;
  contactName: string;
  mobile: string;
  email: string;
  designation: string;
  address: string;
  linkedAccountId: string | null;
  convertedFromLeadId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Projects ───────────────────────────────────────────────
export type DealType =
  | 'Hardware'
  | 'Software License'
  | 'Service Contract'
  | 'Blended';

export type ProjectStatus =
  | 'Prospecting'
  | 'Qualification'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export interface Project {
  id: string;
  projectId: string; // e.g., DEAL-0001
  projectName: string;
  accountId: string | null;
  contactId: string | null;
  convertedFromLeadId: string | null;
  dealType: DealType;
  expectedCloseDate: string;
  contractTermMonths: number | null;
  startDate: string;
  endDate: string;
  dealValue: number | null;
  status: ProjectStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Materials (Child of Project) ───────────────────────────
export type MaterialCategory =
  | 'Construction Materials'
  | 'Wood Materials'
  | 'Plumbing Materials'
  | 'Electrical Materials'
  | 'Steel Work'
  | 'Interior'
  | 'POP'
  | 'Paints'
  | 'Tiles & Granite';

export type MaterialUnit =
  | 'Kg'
  | 'Ton'
  | 'Bag'
  | 'Load'
  | 'Piece'
  | 'Sq.ft'
  | 'Box'
  | 'Litre';

export interface Material {
  id: string;
  projectId: string;
  materialCategory: MaterialCategory;
  materialName: string;
  quantity: number | null;
  unit: MaterialUnit;
  rate: number | null;
  totalAmount: number; // auto = quantity × rate
  purchaseDate: string;
  vendorName: string;
  invoiceNumber: string;
  billAttachment: string; // filename only
  remarks: string;
  createdAt: string;
}

// ── Payment Delivered (Child of Project) ───────────────────
export type PaymentDeliveredType =
  | 'Mestri'
  | 'Carpenter'
  | 'Plumbing'
  | 'Electrician'
  | 'Steel Work'
  | 'POP'
  | 'Painter'
  | 'CPVC';

export type PaymentMode = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';

export interface PaymentDelivered {
  id: string;
  projectId: string;
  paymentType: PaymentDeliveredType;
  date: string;
  amount: number | null;
  paymentMode: PaymentMode;
  paidTo: string;
  description: string;
  attachment: string;
  createdAt: string;
}

// ── One-Time Payments (Child of Project) ───────────────────
export type OneTimeExpenseType =
  | 'Government Work'
  | 'Plan Approval'
  | 'Architecture Plan'
  | 'Borewell'
  | 'Borewell Motor'
  | 'Water Connection'
  | 'Electric Meter'
  | 'Meter Cable'
  | 'Road Cutting';

export interface OneTimePayment {
  id: string;
  projectId: string;
  expenseType: OneTimeExpenseType;
  date: string;
  amount: number | null;
  vendorName: string;
  paymentMode: PaymentMode;
  remarks: string;
  attachment: string;
  createdAt: string;
}

// ── Payment Received (Child of Project) ────────────────────
export interface PaymentReceived {
  id: string;
  projectId: string;
  paymentDate: string;
  amountReceived: number | null;
  paymentMode: PaymentMode;
  referenceNumber: string;
  remarks: string;
  attachment: string;
  createdAt: string;
}

// ── Project Documents (Child of Project) ────────────────────
export interface ProjectDocument {
  id: string;
  projectId: string;
  documentName: string;
  documentDate: string;
  attachment: string;
  createdAt: string;
}

// ── Other Materials (Child of Project) ────────────────────
export interface OtherMaterial {
  id: string;
  projectId: string;
  materialName: string;
  date: string;
  amount: number | null;
  createdAt: string;
}

// ── Interior Materials (Child of Project) ────────────────────
export type InteriorMaterialCategory = 
  | 'Kitchen' 
  | 'Wardrobes' 
  | 'Dressing Table' 
  | 'Dining Cabinet' 
  | 'TV Unit' 
  | 'Wood Paneling' 
  | 'Shoe Rack'
  | 'POP';

export interface InteriorMaterial {
  id: string;
  projectId: string;
  category: InteriorMaterialCategory;
  subCategory: string;
  measurement: string;
  area: number;
  costPerSqft: number;
  totalAmount: number; // auto = area × costPerSqft
  date: string;
  vendorName: string;
  notes: string;
  createdAt: string;
}

// ── Quotation (Tech/Services) ────────────────────────────────
export interface QuotationLineItem {
  id: string;
  item: string;
  description: string;
  qty: number;
  billingType: 'Monthly' | 'One-Off' | 'Annual';
  unitPrice: number;
  totalValue: number; // For monthly, might be Qty * UnitPrice * 12
}

export interface Quotation {
  id: string;
  projectId: string;
  quotationNumber: string; // e.g. QT-000041
  clientName: string;
  projectName: string;
  reference: string;
  items: QuotationLineItem[];
  totalMonthlyRecurring: number;
  totalOneOff: number;
  totalFirstYear: number;
  grandTotalIncVat: number;
  quotationDate: string;
  createdAt: string;
}

// ── Purchase Order ───────────────────────────────────────────
export interface PurchaseOrderLineItem {
  id: string;
  itemDescription: string;
  stockType: 'Sale' | 'Rent' | 'Service';
  qty: number;
  rate: number;
  vatPercent: number;
  vatAmount: number;
  amount: number;
}

export interface PurchaseOrder {
  id: string;
  projectId: string;
  poNumber: string; // e.g. PO-Z001360
  vendorName: string;
  vendorAddress: string;
  deliverTo: string;
  poDate: string;
  terms: string;
  reference: string;
  deliveryCost: number;
  items: PurchaseOrderLineItem[];
  subTotal: number;
  totalVat: number;
  grandTotal: number;
  createdAt: string;
}

// ── Financial Summary (computed) ───────────────────────────
export interface FinancialSummary {
  projectContractValue: number;
  totalMaterialsCost: number;
  totalLabourCost: number;
  totalOneTimeExpenses: number;
  totalOtherMaterialsCost: number;
  totalInteriorMaterialsCost: number;
  totalProjectCost: number;
  totalAmountReceived: number;
  outstandingAmount: number;
  profitLoss: number;
  materialsByCategory: Record<string, number>;
}

// ── Global Inventory ─────────────────────────────────────────
export interface InventoryProduct {
  id: string;
  productName: string;
  category: string;
  billingType: 'One-Off' | 'Monthly Recurring';
  unit: string;
  unitPrice: number;
  stockQuantity: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ── Deal Inventory (Child of Project/Deal) ─────────────────
export interface DealInventoryItem {
  id: string;
  projectId: string; // The Deal ID
  productId: string; // Refers to InventoryProduct.id
  quantity: number;
  totalAmount: number; // auto = quantity × InventoryProduct.unitPrice
  notes: string;
  addedAt: string;
}

// ── CRM Data Store ─────────────────────────────────────────
export interface CRMData {
  leads: Lead[];
  accounts: Account[];
  contacts: Contact[];
  projects: Project[];
  materials: Material[];
  paymentsDelivered: PaymentDelivered[];
  oneTimePayments: OneTimePayment[];
  paymentsReceived: PaymentReceived[];
  projectDocuments: ProjectDocument[];
  otherMaterials: OtherMaterial[];
  interiorMaterials: InteriorMaterial[];
  quotations: Quotation[];
  purchaseOrders: PurchaseOrder[];
  inventoryProducts: InventoryProduct[];
  dealInventoryItems: DealInventoryItem[];
  projectCounter: number; // for auto-generating PROJ-XXXX
}

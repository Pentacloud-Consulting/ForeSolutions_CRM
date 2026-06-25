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
  mobile: string;
  alternateMobile: string;
  email: string;
  address: string;
  city: string;
  requirementType: string;
  plotArea: number | null;
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
  mobile: string;
  alternateMobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  gstNumber: string;
  panNumber: string;
  aadhaarNumber: string;
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
export type ProjectType =
  | 'Residential'
  | 'Commercial'
  | 'Villa'
  | 'Apartment'
  | 'Renovation'
  | 'Construction';

export type ProjectStatus =
  | 'Planning'
  | 'Foundation'
  | 'Construction'
  | 'Interior'
  | 'Completed'
  | 'On Hold';

export interface Project {
  id: string;
  projectId: string; // e.g., PROJ-0001
  projectName: string;
  accountId: string | null;
  contactId: string | null;
  convertedFromLeadId: string | null;
  projectLocation: string;
  projectType: ProjectType;
  totalSiteArea: number | null;
  builtUpArea: number | null;
  numberOfFloors: number | null;
  startDate: string;
  endDate: string;
  projectContractValue: number | null;
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

// ── Interior Quotation (saved PDF quotation) ────────────────
export interface QuotationLineItem {
  floor: string;
  category: string;
  subCategory: string;
  measurement: string;
  area: number;
  costPerSqft: number;
  totalAmount: number;
  notes: string;
}

export interface Quotation {
  id: string;
  projectId: string;
  quotationNumber: string; // e.g. QT-0001
  clientName: string;
  projectName: string;
  projectLocation: string;
  items: QuotationLineItem[];
  grandTotal: number;
  quotationDate: string;
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
  projectCounter: number; // for auto-generating PROJ-XXXX
}

import mongoose from 'mongoose';

const transformOptions = {
  virtuals: true,
  transform: function (doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
};

const leadSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  leadName: { type: String, required: true },
  mobile: { type: String, default: '' },
  alternateMobile: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  requirementType: { type: String, default: '' },
  plotArea: { type: Number, default: null },

  leadSource: { type: String, default: 'Other' },
  status: { type: String, default: 'New' },
  notes: { type: String, default: '' },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const accountSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  clientName: { type: String, required: true },
  mobile: { type: String, default: '' },
  alternateMobile: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  gstNumber: { type: String, default: '' },
  panNumber: { type: String, default: '' },
  aadhaarNumber: { type: String, default: '' },
  notes: { type: String, default: '' },
  convertedFromLeadId: { type: String, default: null },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const contactSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  contactName: { type: String, required: true },
  mobile: { type: String, default: '' },
  email: { type: String, default: '' },
  designation: { type: String, default: '' },
  address: { type: String, default: '' },
  linkedAccountId: { type: String, default: null },
  convertedFromLeadId: { type: String, default: null },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const projectSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true, unique: true },
  projectName: { type: String, required: true },
  accountId: { type: String, default: null },
  contactId: { type: String, default: null },
  convertedFromLeadId: { type: String, default: null },
  projectLocation: { type: String, default: '' },
  projectType: { type: String, default: 'Residential' },
  totalSiteArea: { type: Number, default: null },
  builtUpArea: { type: Number, default: null },
  numberOfFloors: { type: Number, default: null },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  projectContractValue: { type: Number, default: null },
  status: { type: String, default: 'Planning' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const materialSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true },
  materialCategory: { type: String, required: true },
  materialName: { type: String, required: true },
  quantity: { type: Number, default: null },
  unit: { type: String, default: 'Piece' },
  rate: { type: Number, default: null },
  totalAmount: { type: Number, default: 0 },
  purchaseDate: { type: String, default: '' },
  vendorName: { type: String, default: '' },
  invoiceNumber: { type: String, default: '' },
  billAttachment: { type: String, default: '' },
  remarks: { type: String, default: '' },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const paymentDeliveredSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true },
  paymentType: { type: String, required: true },
  date: { type: String, default: '' },
  amount: { type: Number, default: null },
  paymentMode: { type: String, default: 'Cash' },
  paidTo: { type: String, default: '' },
  description: { type: String, default: '' },
  attachment: { type: String, default: '' },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const oneTimePaymentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true },
  expenseType: { type: String, required: true },
  date: { type: String, default: '' },
  amount: { type: Number, default: null },
  vendorName: { type: String, default: '' },
  paymentMode: { type: String, default: 'Cash' },
  remarks: { type: String, default: '' },
  attachment: { type: String, default: '' },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const paymentReceivedSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true },
  paymentDate: { type: String, default: '' },
  amountReceived: { type: Number, default: null },
  paymentMode: { type: String, default: 'Cash' },
  referenceNumber: { type: String, default: '' },
  remarks: { type: String, default: '' },
  attachment: { type: String, default: '' },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const projectDocumentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true },
  documentName: { type: String, required: true },
  documentDate: { type: String, default: '' },
  attachment: { type: String, default: '' },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const otherMaterialSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true },
  materialName: { type: String, required: true },
  date: { type: String, default: '' },
  amount: { type: Number, default: null },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const interiorMaterialSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, default: '' },
  measurement: { type: String, default: '' },
  area: { type: Number, required: true },
  costPerSqft: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: String, required: true },
  vendorName: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: String, required: true }
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const quotationLineItemSchema = new mongoose.Schema({
  floor: { type: String, default: 'Ground Floor' },
  category: { type: String, required: true },
  subCategory: { type: String, default: '' },
  measurement: { type: String, default: '' },
  area: { type: Number, required: true },
  costPerSqft: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  notes: { type: String, default: '' },
}, { _id: false });

const quotationSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true },
  quotationNumber: { type: String, required: true },
  clientName: { type: String, default: '' },
  projectName: { type: String, default: '' },
  projectLocation: { type: String, default: '' },
  items: [quotationLineItemSchema],
  grandTotal: { type: Number, default: 0 },
  quotationDate: { type: String, required: true },
  createdAt: { type: String, required: true },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const inventoryProductSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  productName: { type: String, required: true },
  category: { type: String, default: 'Hardware' },
  billingType: { type: String, default: 'One-Off' },
  unitPrice: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 0 },
  description: { type: String, default: '' },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const dealInventoryItemSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  notes: { type: String, default: '' },
  addedAt: { type: String, required: true },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });

const poLineItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  itemDescription: { type: String, required: true },
  stockType: { type: String, default: 'Sale' },
  qty: { type: Number, required: true },
  rate: { type: Number, required: true },
  vatPercent: { type: Number, required: true },
  vatAmount: { type: Number, required: true },
  amount: { type: Number, required: true },
}, { _id: false });

const purchaseOrderSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  projectId: { type: String, required: true },
  poNumber: { type: String, required: true },
  vendorName: { type: String, default: '' },
  vendorAddress: { type: String, default: '' },
  deliverTo: { type: String, default: '' },
  poDate: { type: String, required: true },
  terms: { type: String, default: '' },
  reference: { type: String, default: '' },
  deliveryCost: { type: Number, default: 0 },
  items: [poLineItemSchema],
  subTotal: { type: Number, default: 0 },
  totalVat: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  createdAt: { type: String, required: true },
}, { timestamps: true, toJSON: transformOptions, toObject: transformOptions });
// Prevent OverwriteModelError
export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
export const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);
export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const Material = mongoose.models.Material || mongoose.model('Material', materialSchema);
export const PaymentDelivered = mongoose.models.PaymentDelivered || mongoose.model('PaymentDelivered', paymentDeliveredSchema);
export const OneTimePayment = mongoose.models.OneTimePayment || mongoose.model('OneTimePayment', oneTimePaymentSchema);
export const PaymentReceived = mongoose.models.PaymentReceived || mongoose.model('PaymentReceived', paymentReceivedSchema);
export const ProjectDocument = mongoose.models.ProjectDocument || mongoose.model('ProjectDocument', projectDocumentSchema);
export const OtherMaterial = mongoose.models.OtherMaterial || mongoose.model('OtherMaterial', otherMaterialSchema);
export const InteriorMaterial = mongoose.models.InteriorMaterial || mongoose.model('InteriorMaterial', interiorMaterialSchema);
// Force recompile to pick up schema changes
if (mongoose.models.Quotation) { delete mongoose.models.Quotation; }
export const QuotationModel = mongoose.model('Quotation', quotationSchema);
export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export const InventoryProduct = mongoose.models.InventoryProduct || mongoose.model('InventoryProduct', inventoryProductSchema);
export const DealInventoryItem = mongoose.models.DealInventoryItem || mongoose.model('DealInventoryItem', dealInventoryItemSchema);
export const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', purchaseOrderSchema);

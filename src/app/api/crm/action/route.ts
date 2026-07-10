import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import * as Models from '@/lib/models';

export async function POST(req: Request) {
  try {
    const { action, id, payload } = await req.json();
    await connectDB();

    // Map frontend 'id' to mongoose '_id'
    const formatPayload = (data: any) => {
      if (!data) return data;
      const { id, ...rest } = data;
      return id ? { _id: id, ...rest } : rest;
    };

    const formattedPayload = formatPayload(payload);

    let result;

    switch (action) {
      // ── LEADS ──
      case 'addLead':
        result = await Models.Lead.create(formattedPayload);
        break;
      case 'updateLead':
        result = await Models.Lead.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteLead':
        result = await Models.Lead.findByIdAndDelete(id);
        break;

      // ── ACCOUNTS ──
      case 'addAccount':
        result = await Models.Account.create(formattedPayload);
        break;
      case 'updateAccount':
        result = await Models.Account.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteAccount':
        result = await Models.Account.findByIdAndDelete(id);
        break;

      // ── CONTACTS ──
      case 'addContact':
        result = await Models.Contact.create(formattedPayload);
        break;
      case 'updateContact':
        result = await Models.Contact.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteContact':
        result = await Models.Contact.findByIdAndDelete(id);
        break;

      // ── PROJECTS ──
      case 'addProject':
        result = await Models.Project.create(formattedPayload);
        // Also increment project counter
        await Models.Settings.findOneAndUpdate(
          { key: 'projectCounter' },
          { $inc: { value: 1 } },
          { upsert: true }
        );
        break;
      case 'updateProject':
        result = await Models.Project.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteProject':
        result = await Models.Project.findByIdAndDelete(id);
        // Cleanup related project data
        await Promise.all([
          Models.Material.deleteMany({ projectId: id }),
          Models.PaymentDelivered.deleteMany({ projectId: id }),
          Models.OneTimePayment.deleteMany({ projectId: id }),
          Models.PaymentReceived.deleteMany({ projectId: id }),
          Models.ProjectDocument.deleteMany({ projectId: id }),
          Models.OtherMaterial.deleteMany({ projectId: id }),
          Models.InteriorMaterial.deleteMany({ projectId: id })
        ]);
        break;

      // ── MATERIALS ──
      case 'addMaterial':
        result = await Models.Material.create(formattedPayload);
        break;
      case 'updateMaterial':
        result = await Models.Material.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteMaterial':
        result = await Models.Material.findByIdAndDelete(id);
        break;

      // ── PAYMENT DELIVERED ──
      case 'addPaymentDelivered':
        result = await Models.PaymentDelivered.create(formattedPayload);
        break;
      case 'updatePaymentDelivered':
        result = await Models.PaymentDelivered.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deletePaymentDelivered':
        result = await Models.PaymentDelivered.findByIdAndDelete(id);
        break;

      // ── ONE TIME PAYMENT ──
      case 'addOneTimePayment':
        result = await Models.OneTimePayment.create(formattedPayload);
        break;
      case 'updateOneTimePayment':
        result = await Models.OneTimePayment.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteOneTimePayment':
        result = await Models.OneTimePayment.findByIdAndDelete(id);
        break;

      // ── PAYMENT RECEIVED ──
      case 'addPaymentReceived':
        result = await Models.PaymentReceived.create(formattedPayload);
        break;
      case 'updatePaymentReceived':
        result = await Models.PaymentReceived.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deletePaymentReceived':
        result = await Models.PaymentReceived.findByIdAndDelete(id);
        break;

      // ── PROJECT DOCUMENTS ──
      case 'addProjectDocument':
        result = await Models.ProjectDocument.create(formattedPayload);
        break;
      case 'updateProjectDocument':
        result = await Models.ProjectDocument.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteProjectDocument':
        result = await Models.ProjectDocument.findByIdAndDelete(id);
        break;

      // ── OTHER MATERIALS ──
      case 'addOtherMaterial':
        result = await Models.OtherMaterial.create(formattedPayload);
        break;
      case 'updateOtherMaterial':
        result = await Models.OtherMaterial.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteOtherMaterial':
        result = await Models.OtherMaterial.findByIdAndDelete(id);
        break;

      // ── INTERIOR MATERIALS ──
      case 'addInteriorMaterial':
        result = await Models.InteriorMaterial.create(formattedPayload);
        break;
      case 'updateInteriorMaterial':
        result = await Models.InteriorMaterial.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteInteriorMaterial':
        result = await Models.InteriorMaterial.findByIdAndDelete(id);
        break;

      // ── QUOTATIONS ──
      case 'addQuotation':
        result = await Models.QuotationModel.create(formattedPayload);
        break;
      case 'updateQuotation':
        result = await Models.QuotationModel.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteQuotation':
        result = await Models.QuotationModel.findByIdAndDelete(id);
        break;

      // ── INVENTORY PRODUCTS ──
      case 'addInventoryProduct':
        result = await Models.InventoryProduct.create(formattedPayload);
        break;
      case 'updateInventoryProduct':
        result = await Models.InventoryProduct.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteInventoryProduct':
        result = await Models.InventoryProduct.findByIdAndDelete(id);
        break;

      // ── DEAL INVENTORY ITEMS ──
      case 'addDealInventoryItem':
        result = await Models.DealInventoryItem.create(formattedPayload);
        break;
      case 'updateDealInventoryItem':
        result = await Models.DealInventoryItem.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deleteDealInventoryItem':
        result = await Models.DealInventoryItem.findByIdAndDelete(id);
        break;

      // ── PURCHASE ORDERS ──
      case 'addPurchaseOrder':
        result = await Models.PurchaseOrder.create(formattedPayload);
        break;
      case 'updatePurchaseOrder':
        result = await Models.PurchaseOrder.findByIdAndUpdate(id, formattedPayload, { new: true });
        break;
      case 'deletePurchaseOrder':
        result = await Models.PurchaseOrder.findByIdAndDelete(id);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error executing CRM action:', error);
    return NextResponse.json({ error: 'Failed to execute action' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { 
  Lead, Account, Contact, Project, Material, PaymentDelivered, 
  OneTimePayment, PaymentReceived, ProjectDocument, OtherMaterial, Settings 
} from '@/lib/models';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectDB();

    // Helper to format data for insertion (remove string 'id' from local storage if any)
    const prepareData = (items: any[]) => items.map(item => {
      const { id, ...rest } = item;
      return rest;
    });

    // Clear existing data (optional, but safe for initial migration)
    await Promise.all([
      Lead.deleteMany({}),
      Account.deleteMany({}),
      Contact.deleteMany({}),
      Project.deleteMany({}),
      Material.deleteMany({}),
      PaymentDelivered.deleteMany({}),
      OneTimePayment.deleteMany({}),
      PaymentReceived.deleteMany({}),
      ProjectDocument.deleteMany({}),
      OtherMaterial.deleteMany({}),
    ]);

    // Insert new data
    await Promise.all([
      Lead.insertMany(prepareData(data.leads || [])),
      Account.insertMany(prepareData(data.accounts || [])),
      Contact.insertMany(prepareData(data.contacts || [])),
      Project.insertMany(prepareData(data.projects || [])),
      Material.insertMany(prepareData(data.materials || [])),
      PaymentDelivered.insertMany(prepareData(data.paymentsDelivered || [])),
      OneTimePayment.insertMany(prepareData(data.oneTimePayments || [])),
      PaymentReceived.insertMany(prepareData(data.paymentsReceived || [])),
      ProjectDocument.insertMany(prepareData(data.projectDocuments || [])),
      OtherMaterial.insertMany(prepareData(data.otherMaterials || [])),
      Settings.findOneAndUpdate(
        { key: 'projectCounter' },
        { value: data.projectCounter || 1 },
        { upsert: true }
      )
    ]);

    return NextResponse.json({ success: true, message: 'Data synced successfully' });
  } catch (error) {
    console.error('Error syncing data:', error);
    return NextResponse.json({ error: 'Failed to sync data' }, { status: 500 });
  }
}

const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect('mongodb+srv://DBC_Pentacoud:Pentacloud2025@cluster0.yjflp6k.mongodb.net/Pentahouse?retryWrites=true&w=majority&appName=Cluster0');
    const db = mongoose.connection.db;

    const quotation = await db.collection('quotations').findOne({ quotationNumber: 'QT-FAYAZ-001' });
    if (!quotation) {
      console.log('Quotation not found!');
      process.exit(1);
    }

    // Update items where floor is "Ground Floor" and category is "Bed Room 2"
    let updated = false;
    const newItems = quotation.items.map(item => {
      if (item.floor === 'Ground Floor' && item.category === 'Bed Room 2') {
        updated = true;
        return { ...item, floor: '1st Floor' };
      }
      return item;
    });

    if (updated) {
      await db.collection('quotations').updateOne(
        { _id: quotation._id },
        { $set: { items: newItems } }
      );
      console.log('Successfully updated 4th point to 1st Floor!');
    } else {
      console.log('No matching items found to update.');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();

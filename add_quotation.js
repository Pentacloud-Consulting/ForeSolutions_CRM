const mongoose = require('mongoose');
const { v4: uuidv4 } = require('crypto');

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const items = [
  // 1ST FLOOR - KITCHEN
  { floor: "1st Floor", category: "Kitchen", subCategory: "Below Counter", area: 22.66, costPerSqft: 1800, totalAmount: 40788 },
  { floor: "1st Floor", category: "Kitchen", subCategory: "Below Counter", area: 13.22, costPerSqft: 1800, totalAmount: 23796 },
  { floor: "1st Floor", category: "Kitchen", subCategory: "Over Head", area: 12.66, costPerSqft: 1600, totalAmount: 20256 },
  { floor: "1st Floor", category: "Kitchen", subCategory: "Over Head", area: 7.33, costPerSqft: 1600, totalAmount: 11728 },
  { floor: "1st Floor", category: "Kitchen", subCategory: "Kitchen Loft", area: 23.33, costPerSqft: 1300, totalAmount: 30329 },
  { floor: "1st Floor", category: "Kitchen", subCategory: "Kitchen Loft", area: 23.33, costPerSqft: 1300, totalAmount: 30329 },
  { floor: "1st Floor", category: "Kitchen", subCategory: "Kitchen Loft", area: 23.33, costPerSqft: 1300, totalAmount: 30329 },

  // 1ST FLOOR - BED ROOM 1
  { floor: "1st Floor", category: "Bed Room 1", subCategory: "Wardrobe", area: 49.00, measurement: "7 x 7", costPerSqft: 1550, totalAmount: 75950 },
  { floor: "1st Floor", category: "Bed Room 1", subCategory: "Wardrobe Loft", area: 24.00, measurement: "10 x 2.4", costPerSqft: 1050, totalAmount: 25200 },
  { floor: "1st Floor", category: "Bed Room 1", subCategory: "Dressing Table", area: 21.00, measurement: "7 x 3", costPerSqft: 1300, totalAmount: 27300 },

  // 1ST FLOOR - BED ROOM 2
  { floor: "1st Floor", category: "Bed Room 2", subCategory: "Wardrobe", area: 49.00, measurement: "7 x 7", costPerSqft: 1550, totalAmount: 75950 },
  { floor: "1st Floor", category: "Bed Room 2", subCategory: "Wardrobe Loft", area: 24.00, measurement: "10 x 2.4", costPerSqft: 1050, totalAmount: 25200 },
  { floor: "1st Floor", category: "Bed Room 2", subCategory: "Study", area: 20.00, costPerSqft: 1300, totalAmount: 26000 },

  // GROUND FLOOR - BED ROOM 2
  { floor: "Ground Floor", category: "Bed Room 2", subCategory: "Bed - With Storage", area: 17, costPerSqft: 1300, totalAmount: 22100 },
  { floor: "Ground Floor", category: "Bed Room 2", subCategory: "Sitting", area: 9.33, costPerSqft: 1300, totalAmount: 12129 },

  // 1ST FLOOR - STORAGE
  { floor: "1st Floor", category: "Storage", subCategory: "Storage", area: 18.47, costPerSqft: 1100, totalAmount: 20317 },

  // 1ST FLOOR - DINING CABINET
  { floor: "1st Floor", category: "Dining Cabinet", subCategory: "Dining Cabinet", area: 42.00, measurement: "7 x 6", costPerSqft: 1550, totalAmount: 65100 },

  // 1ST FLOOR - WASH BASIN
  { floor: "1st Floor", category: "Wash Basin", subCategory: "Wash Basin", area: 27.66, costPerSqft: 1200, totalAmount: 33192 },

  // 1ST FLOOR - BATHROOM VANITY
  { floor: "1st Floor", category: "Bathroom Vanity", subCategory: "Bathroom Vanity", area: 6.25, measurement: "2.5 x 2.5", costPerSqft: 1400, totalAmount: 8750 },
  { floor: "1st Floor", category: "Bathroom Vanity", subCategory: "Bathroom Vanity", area: 6.25, measurement: "2.5 x 2.5", costPerSqft: 1400, totalAmount: 8750 },

  // 1ST FLOOR - TV UNIT
  { floor: "1st Floor", category: "TV Unit", subCategory: "TV Unit", area: 49.00, measurement: "7 x 7", costPerSqft: 1250, totalAmount: 61250 },

  // 1ST FLOOR - WOOD PANELING
  { floor: "1st Floor", category: "Wood Paneling", subCategory: "Wood Paneling", area: 56.00, costPerSqft: 750, totalAmount: 42000, notes: "Wood paneling work as per design specifications." },

  // 1ST FLOOR - FOYER
  { floor: "1st Floor", category: "Foyer", subCategory: "Wall paneling", area: 30.00, costPerSqft: 800, totalAmount: 24000 },

  // 1ST FLOOR - SHOE RACK
  { floor: "1st Floor", category: "Shoe Rack", subCategory: "Shoe Rack", area: 11.25, costPerSqft: 1250, totalAmount: 14062.5 },

  // GROUND FLOOR - KITCHEN
  { floor: "Ground Floor", category: "Kitchen", subCategory: "Below Counter", area: 18.00, costPerSqft: 1300, totalAmount: 23400 },
  { floor: "Ground Floor", category: "Kitchen", subCategory: "Over Head", area: 16.00, costPerSqft: 1300, totalAmount: 20800 }
];

async function run() {
  try {
    await mongoose.connect('mongodb+srv://DBC_Pentacoud:Pentacloud2025@cluster0.yjflp6k.mongodb.net/Pentahouse?retryWrites=true&w=majority&appName=Cluster0');
    const db = mongoose.connection.db;

    const project = await db.collection('projects').findOne({ projectId: 'PROJ-FAYAZ' });
    if (!project) {
      console.log('Project not found!');
      process.exit(1);
    }

    const grandTotal = items.reduce((sum, item) => sum + item.totalAmount, 0);
    const date = new Date().toISOString();

    const quotation = {
      _id: uuid(),
      projectId: project._id,
      quotationNumber: 'QT-FAYAZ-001',
      clientName: project.clientName || 'Fayaz',
      projectName: project.projectName || 'Fayaz Residence',
      projectLocation: project.projectLocation || '',
      items: items.map(item => ({ ...item, _id: uuid() })),
      grandTotal,
      quotationDate: new Date('2026-06-25').toISOString(),
      createdAt: date,
      updatedAt: date
    };

    await db.collection('quotations').insertOne(quotation);
    
    // Also save these individual items in the interiorMaterials collection as requested by the model earlier
    // wait, the app doesn't actually require it to be in interiorMaterials if it's saved in the Quotation,
    // let's check DataContext.tsx just in case, but Quotation schema has items array embedded!
    
    console.log(`Successfully added quotation for Fayaz with grand total ₹${grandTotal}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();

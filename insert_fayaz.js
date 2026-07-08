const mongoose = require('mongoose');
const { v4: uuidv4 } = require('crypto'); // Built-in crypto module doesn't have v4 directly in older nodes, we'll use a simple generator or hardcoded ID.

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function run() {
  try {
    await mongoose.connect('mongodb+srv://DBC_Pentacoud:Pentacloud2025@cluster0.yjflp6k.mongodb.net/Pentahouse?retryWrites=true&w=majority&appName=Cluster0');
    const db = mongoose.connection.db;

    const leadId = '8dd4f12a-721b-49f9-88ba-b74c093c8415';
    const accountId = 'd3f4ba40-d3e9-4303-a5b9-c1edab64d2fc';
    const contactId = 'eaaf4cc4-3453-4563-a521-143d952d5356';
    const projId = uuid();
    const date = new Date('2026-06-25T06:28:17.681Z');

    // 1. Insert Lead
    await db.collection('leads').updateOne(
      { _id: leadId },
      { $set: { 
          _id: leadId, leadName: 'Fayaz', mobile: '9886779288', status: 'Converted', 
          createdAt: date, updatedAt: date 
      }},
      { upsert: true }
    );

    // 2. Insert Account
    await db.collection('accounts').updateOne(
      { _id: accountId },
      { $set: {
          _id: accountId, clientName: 'Fayaz', mobile: '9886779288', convertedFromLeadId: leadId,
          createdAt: date, updatedAt: date
      }},
      { upsert: true }
    );

    // 3. Insert Contact
    await db.collection('contacts').updateOne(
      { _id: contactId },
      { $set: {
          _id: contactId, contactName: 'Fayaz', mobile: '9886779288', linkedAccountId: accountId, convertedFromLeadId: leadId,
          createdAt: date, updatedAt: date
      }},
      { upsert: true }
    );

    // 4. Insert Project (so it shows up in the UI immediately)
    await db.collection('projects').updateOne(
      { accountId: accountId },
      { $set: {
          _id: projId, projectId: 'PROJ-FAYAZ', projectName: 'Fayaz Residence', accountId: accountId, contactId: contactId,
          convertedFromLeadId: leadId, projectType: 'Residential', status: 'Planning', isActive: true,
          createdAt: new Date(), updatedAt: new Date()
      }},
      { upsert: true }
    );

    console.log('Successfully inserted Fayaz into MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();

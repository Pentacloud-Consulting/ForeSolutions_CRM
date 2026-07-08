const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://DBC_Pentacoud:Pentacloud2025@cluster0.yjflp6k.mongodb.net/Pentahouse?retryWrites=true&w=majority&appName=Cluster0');
  const db = mongoose.connection.db;

  const results = {};
  
  results.leads = await db.collection('leads').find({ $or: [{ clientName: /Fayaz/i }, { leadName: /Fayaz/i }] }).toArray();
  results.accounts = await db.collection('accounts').find({ clientName: /Fayaz/i }).toArray();
  results.contacts = await db.collection('contacts').find({ contactName: /Fayaz/i }).toArray();
  results.projects = await db.collection('projects').find({ $or: [{ projectName: /Fayaz/i }, { clientName: /Fayaz/i }] }).toArray();
  
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}
run();

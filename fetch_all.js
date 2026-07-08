const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb+srv://DBC_Pentacoud:Pentacloud2025@cluster0.yjflp6k.mongodb.net/Pentahouse?retryWrites=true&w=majority&appName=Cluster0');
  const db = mongoose.connection.db;

  const accounts = await db.collection('accounts').find({}).toArray();
  const projects = await db.collection('projects').find({}).toArray();
  const leads = await db.collection('leads').find({}).toArray();
  
  console.log('--- Accounts ---');
  accounts.forEach(a => console.log(a.clientName));
  console.log('--- Projects ---');
  projects.forEach(p => console.log(p.projectName));
  console.log('--- Leads ---');
  leads.forEach(l => console.log(l.clientName || l.leadName));

  process.exit(0);
}
run();

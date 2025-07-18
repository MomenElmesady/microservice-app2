const admin = require('firebase-admin');
const serviceAccount = require("../whatsapp-798cb-firebase-adminsdk-fbsvc-60a9a7f5aa.json")
admin.initializeApp({
  credential: admin.credential.applicationDefault(serviceAccount), // use service account credentials here
});
module.exports = { admin }
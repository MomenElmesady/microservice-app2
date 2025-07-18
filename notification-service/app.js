require("./config/database")
const { listenForNewMessages } = require("./services/listenForMessage")


// Start the notification service
listenForNewMessages().catch(console.error);


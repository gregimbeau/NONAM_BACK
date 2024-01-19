const axios = require("axios");
const WEBHOOK_URL = "https://webhook.site/2231dc70-0c4d-4929-bb02-4a51344fbd6f";

async function sendToWebhook(data) {
  try {
    await axios.post(WEBHOOK_URL, data);
    console.log("Data sent to webhook");
  } catch (error) {
    console.error("Error sending data to webhook:", error);
  }
}

module.exports = { sendToWebhook };

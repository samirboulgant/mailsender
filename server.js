const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "boulgant2000@gmail.com", // Replace with your Gmail
    pass: "akfy gwnv mqph khky", // Replace with an App Password (not your actual password)
  },
});

// Function to send email
async function sendEmail(to, subject, message) {
  let mailOptions = {
    from: "boulgant2000@gmail.com",
    to: to,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

// Paddle Webhook Endpoint
app.post("/paddle-webhook", async (req, res) => {
  const event = req.body;

  console.log("📩 Received Webhook:", event); // Logs all events

  let subject = "";
  let message = "";

  switch (event.event_type) {
    case "transaction.paid":
      subject = "Thank You for Your Purchase!";
      message = `Hi, your payment of $${event.data.details.totals.total} has been received. 🎉\n\n
      You can download your digital product here: https://drive.google.com/drive/folders/1UP4A9oacnkvRgl2Pt3kBvC93EFdxnIzD?usp=sharing`;
      await sendEmail(event.data.customer_email, subject, message);
      break;

    case "subscription.created":
      subject = "Subscription Activated!";
      message = `Hi, your subscription has been activated.`;
      await sendEmail(event.data.customer_email, subject, message);
      break;

    case "customer.created":
      subject = "Welcome to Our Store!";
      message = `Hi, thank you for joining our store.`;
      await sendEmail(event.data.email, subject, message);
      break;

    default:
      console.log("⚠️ Unhandled event:", event.event_type);
  }

  res.sendStatus(200); // Respond to Paddle
});

// Start Server
app.listen(3000, () => console.log("🚀 Webhook listening on port 3000"));

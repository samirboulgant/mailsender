const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "boulgant2000@gmail.com", // Your Gmail
    pass: "akfy gwnv mqph khky", // Use an App Password
  },
});

// Function to send email
async function sendEmail(to, subject, message) {
  let mailOptions = {
    from: "boulgant2000@gmail.com",
    to: to, // Buyer's email
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Paddle Webhook Endpoint
app.post("/paddle-webhook", async (req, res) => {
  const event = req.body;

  console.log("Received Webhook:", event); // Logs all events

  switch (event.alert_name) {
    case "transaction.paid":
      const buyerEmail = event.email; // Buyer's email from Paddle
      const amountPaid = event.sale_gross;
      const orderId = event.order_id || "N/A"; // Get order ID if available

      // Digital Download Link
      const downloadLink =
        "https://drive.google.com/drive/folders/1UP4A9oacnkvRgl2Pt3kBvC93EFdxnIzD?usp=sharing";

      // Send confirmation email to the buyer with the digital product
      await sendEmail(
        buyerEmail,
        "Thank You for Your Purchase! 🎉",
        `Dear Customer,\n\nThank you for your purchase!\n\n🎁 Here is your digital download:\n${downloadLink}\n\n📌 Order Details:\n- Order ID: ${orderId}\n- Amount Paid: $${amountPaid}\n\nWe appreciate your business and hope you enjoy your Ebook and bonuses!\n\nBest Regards,\nYour Company Name`
      );

      console.log(`Thank You email sent to ${buyerEmail}`);
      break;

    case "subscription.created":
      await sendEmail(
        event.customer_email,
        "Subscription Created Successfully",
        `Hello,\n\nYour subscription has been successfully created!\n\nBest Regards,\nYour Company Name`
      );
      break;

    case "customer.updated":
      await sendEmail(
        event.email,
        "Your Account Details Were Updated",
        `Hello,\n\nYour account details have been updated successfully.\n\nBest Regards,\nYour Company Name`
      );
      break;

    default:
      console.log("Unhandled event:", event.alert_name);
  }

  res.sendStatus(200); // Respond to Paddle
});

// Start Server
app.listen(3000, () => console.log("Webhook listening on port 3000"));

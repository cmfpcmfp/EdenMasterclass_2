const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.static("."));
app.use(bodyParser.json());

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: {
          name: "Eden Quadrant - 3 Part Series"
        },
        unit_amount: 2200,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: "https://yourdomain.com/success",
    cancel_url: "https://yourdomain.com/cancel",
  });

  res.json({ id: session.id });
});

app.post("/webhook", bodyParser.raw({type: 'application/json'}), (req, res) => {
  let data;
  try {
    data = JSON.parse(req.body);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (data.type === "checkout.session.completed") {
    const email = data.data.object.customer_email;
    sendEmail(email);
  }

  res.status(200).send();
});

function sendEmail(to) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "🎉 You're In! Eden Quadrant Masterclass",
    text: `
Thank you for joining the Eden Quadrant - 3 Part Series!

🎥 Zoom link: https://us05web.zoom.us/j/85700838238?pwd=TUCIMfvUNHRZYGtySJPRAR2XQW7yWQ.1
📘 Workbook: https://drive.google.com/file/d/1g9yXVOAn7Z4_xntPJTncgBAA8dQ3kvoJ/view?usp=sharing

See you there!
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

app.listen(4242, () => console.log("Running on port 4242"));
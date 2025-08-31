import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency: "lkr",
      description: "Appointment payment",
      metadata:{integration_check : "accept payment"}
    });

    res.json({success:true,
      clientSecret: paymentIntent.client_secret, // send this to frontend
    });
  } catch (error) {
    console.log(error);
    res.json({ success:false,message: error.message });
  }
};

export const sendStripeAPI = async (req, res) => {
  console.log("Stripe API route called"); // add this
  console.log("Publishable Key:", process.env.STRIPE_API_KEY);
  res.json({
    success: true,
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
};





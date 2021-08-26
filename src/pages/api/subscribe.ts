import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { stripe } from "../../services/stripe";

export default async function Session(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {

    const session = await getSession({ req });

    const stipeUserSession = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name,
    })

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stipeUserSession.id,
      payment_method_types: ['card', 'bacs_debit', 'alipay'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: 'price_1JRyaxCabKLj36XyuK7n0POQ',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCE_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
}
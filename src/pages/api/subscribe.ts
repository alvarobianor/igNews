import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fauna } from "../../services/faunadb";
import { stripe } from "../../services/stripe";

interface User {
  ref: {
    email: string;
    id: string;
  },
  data: {
    stripe_costumer: string;
  }
}


export default async function Session(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {

    const session = await getSession({ req });

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        ),
      )
    )

    let costumerId = user.data.stripe_costumer

    if (!costumerId) {
      const stipeUserSession = await stripe.customers.create({
        email: session.user.email,
        // name: session.user.name,
      })

      await fauna.query(
        q.Update(
          q.Ref(
            q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_costumer: stipeUserSession.id,
            }
          }
        )
      )

      costumerId = stipeUserSession.id
    }



    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: costumerId,
      payment_method_types: ['card'],
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
      cancel_url: process.env.CANCEL_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
}
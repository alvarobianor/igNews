import Stripe from 'stripe'

import Pack from '../../package.json'
export const stripe = new Stripe(process.env.STRIBE_API_KEY, {
  apiVersion: "2020-08-27",
  appInfo: {
    name: 'Ignews',
    version: Pack.version
  }
})
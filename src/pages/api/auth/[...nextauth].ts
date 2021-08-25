import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import {query as q} from 'faunadb'
import {fauna} from '../../../services/faunadb'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user'
    }),
    // ...add more providers here
    
  ],
  // jwt: {
  //   signingKey: process.env.JWT_SIGNIN_KEY,
  // },
  callbacks: {
    async signIn(user, account, profile) {
      const {email} = user
      try {
        await fauna.query(
          q.Create(q.Collection('users'), {
            data: {
              email
            }
          })
        )     
  
        return true
      } catch {
        console.log('Erro')
        return false
      }
    },
  },
})
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { query as q } from "faunadb";
import { fauna } from "../../../services/faunadb";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: "read:user",
    }),
    // ...add more providers here
  ],
  // jwt: {
  //   signingKey: process.env.JWT_SIGNIN_KEY,
  // },
  callbacks: {
    async session(session) {
      console.log("EMAIL ", session.user.email);
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_userId"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch (error) {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;
      try {
        await fauna.query(
          // q.Create(q.Collection('users'), {
          //   data: {
          //     email
          //   }
          // })
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))
            ),
            q.Create(q.Collection("users"), {
              data: {
                email,
              },
            }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
          )
        );

        return true;
      } catch {
        console.log("Erro");
        return false;
      }
    },
  },
});

import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/client";
// import { GetStaticProps } from "next";

import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import style from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  const [session] = useSession();
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={style.contentContainer}>
        <section className={style.hero}>
          <span>👏 Hey, welcome!</span>
          <h1>
            New about the <span>React</span> world.
          </h1>
          {!session?.activeSubscription && (
            <p>
              Get access to all publications
              <span> for {product.amount} month</span>. 😘
            </p>
          )}
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  );
}

// export const getStaticProps: GetStaticProps = async () => {
export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve(process.env.PRICE_STRIPE_ID, {
    expand: ["product"], // Show infos reletade about the product
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    // revalidate: 60 * 60 * 24 * 30 //1 mês
  };
};

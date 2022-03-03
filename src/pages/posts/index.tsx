import { GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import { getPrismicClient } from "../../services/prismic";
import Prismic from "@prismicio/client";

import styles from "./styles.module.scss";

export default function Posts() {
  return (
    <>
      <Head>Posts | Ignews</Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>03 de Março de 2022</time>
            <strong>FREZAAAAAAAAAAAAAAA</strong>
            <p>
              Strong é uma tag mt robusta, amo ela de paixão, eu me inspiro no
              Igor Guimarães
            </p>
          </a>

          <a href="#">
            <time>03 de Março de 2022</time>
            <strong>FREZAAAAAAAAAAAAAAA</strong>
            <p>
              Strong é uma tag mt robusta, amo ela de paixão, eu me inspiro no
              Igor Guimarães
            </p>
          </a>

          <a href="#">
            <time>03 de Março de 2022</time>
            <strong>FREZAAAAAAAAAAAAAAA</strong>
            <p>
              Strong é uma tag mt robusta, amo ela de paixão, eu me inspiro no
              Igor Guimarães
            </p>
          </a>

          <a href="#">
            <time>03 de Março de 2022</time>
            <strong>FREZAAAAAAAAAAAAAAA</strong>
            <p>
              Strong é uma tag mt robusta, amo ela de paixão, eu me inspiro no
              Igor Guimarães
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "publication")],
    {
      fetch: ["publication.title", "publication.content"],
      pageSize: 100,
    }
  );
  console.log("Prismic: ", JSON.stringify(response, null, 2));

  return {
    props: {},
  };
};

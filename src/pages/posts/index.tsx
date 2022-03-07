import { GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import { getPrismicClient } from "../../services/prismic";
import Prismic from "@prismicio/client";

import styles from "./styles.module.scss";

import { RichText } from "prismic-dom";
import ApiSearchResponse from "@prismicio/client/types/ApiSearchResponse";
import Link from "next/link";
import { useSession } from "next-auth/client";

type Title = {
  type: string;
  text: string;
  spans: any[];
};

type Span = {
  start: number;
  end: number;
  type: string;
};

type Content = {
  type: string;
  text: string;
  spans: Span[];
};

type Post = {
  uid: string;
  title: Title[];
  content: Content[];
};

type Finalpost = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

type FinalPostsProps = {
  posts: Finalpost[];
};

export default function Posts({ posts }: FinalPostsProps) {
  const [session] = useSession();
  return (
    <>
      <Head>Posts | Ignews</Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => {
            return (
              <Link
                href={`/posts/${
                  !session?.activeSubscription
                    ? `preview/${post.slug}`
                    : post.slug
                }`}
              >
                <a key={post.slug} href={post.slug}>
                  <time>{post.updatedAt}</time>
                  <strong>{post.title}</strong>
                  <p>{post.excerpt}</p>
                </a>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response: ApiSearchResponse<Post> = await prismic.query(
    [Prismic.predicates.at("document.type", "publication")],
    {
      fetch: ["publication.title", "publication.content"],
      pageSize: 100,
    }
  );

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    } as Finalpost;
  });

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60,
  };
};

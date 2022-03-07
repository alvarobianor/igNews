import { Document } from "@prismicio/client/types/documents";
import { GetStaticPaths, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";
import styles from "../post.module.scss";

type PostPreviewProps = {
  post: {
    slug: string;
    title: string;
    content: string;
    updated: string;
  };
};

type PostPreview = {
  title: string;
  content: string[];
  last_publication_date: string;
};

export default function Post({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);
  return (
    <>
      <Head>{post.title} | Ignews</Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updated}</time>
          <div
            className={`${styles.postContent} ${styles.previewPostContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="">
              <a>Subscribe Now! 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    //   paths: [
    //     {
    //       params: {
    //         slug: "",
    //       },
    //     },
    //   ],
    //   fallback: "blocking",
    // };

    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response: Document<PostPreview> = await prismic.getByUID(
    "publication",
    String(slug),
    {}
  );

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updated: new Date(response.last_publication_date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60,
  };
};

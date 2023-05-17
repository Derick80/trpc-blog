import { type NextPage } from "next";
import Head from "next/head";

import type { Metadata } from "next";

const metadata: Metadata = {
  title: "Derick's Blog",
  description: "Derick's Blog",
  // ...
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ブログ Derick's blog</title>
        <meta
          name="Derick's T3 stack blog
        "
          content="Derick's T3 stack blog"
        />
{
        metadata.title && (
          <>

            <meta property="og:title" 
            content={metadata.title.toString()} 
            />
            <meta name="twitter:title" content={metadata.title.toString()} />
          </>
        )
        
}

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full flex-col items-center"></main>
    </>
  );
};

export default Home;

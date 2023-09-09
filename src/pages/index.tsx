import { type NextPage } from "next";
import Head from "next/head";



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

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full flex-col items-center"></main>
    </>
  );
};

export default Home;

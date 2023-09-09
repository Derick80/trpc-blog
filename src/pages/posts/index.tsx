import Link from "next/link";
import Button from "~/components/button";
import PostCard from "~/components/post-card";
import { api } from "~/utils/api";
import type { Metadata } from "next";
import Head from "next/head";

const metadata: Metadata = {
  title: "Derick's Blog",
  description: "Derick's Blog",
  // ...
};

function PostListingPage() {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <Head>
        <title>ブログ Derick's blog</title>
      {
        metadata.title && (
            <><meta
              content={metadata?.title.toString()} /><meta property="og:title"
                content={metadata?.title.toString()} /><meta name="twitter:title" content={metadata?.title.toString()} /></>
        )
        
      }

   
   </Head>
      <div className="flex w-full flex-col items-center">
         <div className="flex w-full flex-col flex-wrap gap-4 border-2 border-green-500 p-1">
      <Tags />
      <h3 className="text-2xl font-bold  dark:text-slate-50">
        There are {data?.length} posts
      </h3>
      <div className="flex flex-row gap-2">
        <Link href="/posts/new">
          <Button variant="primary_filled">Create Post</Button>
        </Link>
      </div>
      <div className="flex w-full flex-col gap-2">
        {data &&
          data.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
      </div>
    </div>
      </div>

    </>
  );
}

export default PostListingPage;

function Tags() {
  const { data, isLoading } = api.categories.getAll.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex w-full flex-col flex-wrap gap-1 border-2 border-green-500 p-1">
      <h3 className="text-2xl font-bold  dark:text-slate-50">
        There are {data?.length} tags
      </h3>
      <div className="flex w-full flex-row flex-wrap gap-2 p-2">
        {data &&
          data.map((tag) => {
            return (
              <div
                className="mr-2 w-fit rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                key={tag.id}
              >
                <Link href={`/posts/categories/${tag.id}`}>
                  <p className="text-xs font-semibold">{tag.value}</p>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
}

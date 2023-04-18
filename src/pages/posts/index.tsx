import Link from "next/link";
import Button from '~/components/button'
import PostCard from "~/components/post-card";
import { api } from "~/utils/api";

function PostListingPage() {
  const { data, isLoading } = api.post.getAll.useQuery();

  const categories= api.categories.getAll.useQuery()
  console.log(categories.data, 'categories');


  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div
    className='flex flex-col gap-4 w-full'
    >
      <Tags />
      <h3 className="text-2xl font-bold text-black dark:text-slate-50">
        There are {data?.length} posts
      </h3>
      <div className="flex flex-row gap-2">
        <Link href="/posts/new">
          <Button variant='primary_filled'>Create Post</Button>
        </Link>
      </div>
      <div className="w-full flex flex-col gap-2">

      {data &&
        data.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
      </div>


    </div>
  );
}

export default PostListingPage;


function Tags(){
  const { data, isLoading } = api.categories.getAll.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h3 className="text-2xl font-bold text-black dark:text-slate-50">
        There are {data?.length} tags
      </h3>
      <div className="w-full flex flex-row gap-2 flex-wrap p-2">

      {data &&
        data.map((tag) => {
          return <div
          className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          key={tag.id}>{tag.value}</div>;
        })}
      </div>
    </>
  );
}
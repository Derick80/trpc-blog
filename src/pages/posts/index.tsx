import Link from "next/link";
import PostCard from "~/components/post-card";
import { api } from "~/utils/api";

function PostListingPage() {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto flex w-[350px] flex-col md:w-1/2">
      {data?.length}
      <Link href="/posts/new">Create Post</Link>
      {data &&
        data.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
    </div>
  );
}

export default PostListingPage;

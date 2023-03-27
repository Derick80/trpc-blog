import { PlusCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import PostCard from "~/components/post-card";
import { api } from "~/utils/api";

function PostListingPage() {
  const { data, isLoading } = api.post.getAll.useQuery();
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto flex flex-col md:grid md:grid-cols-2">
     <div className="flex flex-col gap-2 mx-auto m-2 items-center">
        <Link href="/posts/new">
          <PlusCircledIcon />
        </Link>
      </div>
      <div className="mx-auto flex w-3/4 flex-col gap-5 md:col-span-2 md:flex-row">
        {data &&
          data.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
      </div>
    </div>
  );
}

export default PostListingPage;

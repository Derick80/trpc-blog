import Image from "next/image";
import Link from "next/link";
import { type Post, api } from "~/utils/api";
import CommentSection from "./comment-section";
import React from "react";
import { ChatBubbleIcon, TrashIcon } from "@radix-ui/react-icons";
import LikeContainer from "./like-container";
import Button from "./button";
import { Separator } from "./ui/separator";

type PostProps = {
  post: Post & {
    categories: {
      id: string;
      value: string;
    }[];
  };
};

export default function PostCard({ post }: PostProps) {
  const [showComments, setShowComments] = React.useState(true);
  return (
    <div
      className="hover:border-bg-gray-700  flex flex-col gap-4 overflow-auto rounded-xl p-2 shadow-xl hover:border"
      key={post.id}
    >
      <Link href={`/posts/${post.id}`} passHref>
        <h3 className="text-left text-2xl font-bold dark:text-slate-50">
          {post.title}
        </h3>
      </Link>
      <div className="flex flex-row gap-2">
        <Image
          className="hidden w-fit rounded-xl md:block"
          src={post.imageUrl}
          alt={post.title}
          width={500}
          height={500}
        />
        <div>
          <div
            className="w-full overflow-auto text-left  dark:text-slate-50"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
<Separator 
  />

      <div className="flex flex-row flex-wrap gap-2">
        {post.categories.map((category) => {
          return (
            <div
              className="mr-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
              key={category.id}
            >
              <Link href={`/posts/categories/${category.value}`} passHref>
                {category.value}
              </Link>
            </div>
          );
        })}
      </div>
     <Separator />

      <BlogAction postId={post.id} />
      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
}

function BlogAction({ postId }: { postId: string }) {
  if (!postId) return null;

  const deleteMutation = api.post.deletePost.useMutation();
  const utils = api.useContext();

  const handleDelete = async ({
    postId,
  }: {
    e: React.FormEvent<HTMLFormElement>;
    postId: string;
  }) => {
    await deleteMutation.mutateAsync({ postId });
    await utils.post.invalidate();
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <LikeContainer postId={postId} />

      <div className="flex flex-grow" />

      <Link href={`/posts/${postId}`} passHref>
        <Button variant="icon_text_unfilled" size="tiny">
          <ChatBubbleIcon />
        </Button>
      </Link>

      <form onSubmit={(e) => void handleDelete({ e, postId })}>
        <input type="hidden" name="postId" value={postId} />
        <Button variant="icon_text_unfilled" size="tiny" type="submit">
          <TrashIcon />
        </Button>
      </form>
    </div>
  );
}

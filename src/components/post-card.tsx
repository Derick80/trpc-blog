import {
  Avatar,
  Divider,
  Text,
  Tooltip,
} from "@mantine/core";
import { type Like, type Post, type User } from "@prisma/client";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { api, type CommentWithChildren } from "~/utils/api";
import CommentSection from "./comment-section";
import React from "react";
import { ChatBubbleIcon, StarIcon } from "@radix-ui/react-icons";
import LikeContainer from './like-container'

export type PostProps = {
  post: Post & {
    _count: {
      likesCount: number;
    };
    author: Omit<User, "emailVerified">;
    comments: CommentWithChildren[];
    likes: Like[];
  };
};
export default function PostCard({ post }: PostProps) {
  const [showComments, setShowComments] = React.useState(false);
  return (
      <div className="flex flex-col gap-4 rounded-xl p-2 overflow-auto border-2" key={post.id}>
        <Link href={`/posts/${post.id}`} passHref>
          <h3 className="text-2xl font-bold text-black dark:text-slate-50">
            {post.title}
          </h3>
        </Link>
        <Image
          className="hidden w-fit rounded-xl md:block"
          src={post.imageUrl}
          alt={post.title}
          width={100}
          height={100}
        />
<div
>
        <div
          className="text-black dark:text-slate-50 w-full overflow-auto"
        dangerouslySetInnerHTML={ { __html: post.content } } />

</div>        <Divider />-
        <div className="flex flex-row items-center justify-between gap-2">
          <button className="flex flex-row items-center gap-2">
            <StarIcon />
            <p className="text-black dark:text-slate-50">
              {post.comments.length}
            </p>
          </button>
          <button
            className="flex flex-row items-center gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <ChatBubbleIcon />
            <p className="text-black dark:text-slate-50">
              {post.comments.length}
            </p>
          </button>

          {post.author && (
            <div className="flex flex-row gap-2">
              <Tooltip label={post.author.name}>
                {post.author.image && (
                  <Avatar
                    size="sm"
                    radius="xl"
                    src={post.author.image}
                    alt={post.author.email}
                  />
                )}
              </Tooltip>
              <Text>{dayjs(post.createdAt).format("MMM D")}</Text>
            </div>
          )}
        </div>
        <Divider />
        <LikeContainer
          likesCount={post._count?.likesCount}
        />
        <BlogAction postId={post.id} />
        {showComments && <CommentSection postId={post.id} />}
      </div>
  );
}

function BlogAction({postId}: {postId: string}){


  if(!postId) return null

  const deleteMutation = api.post.deletePost.useMutation()

  const handleDelete = async ({ postId}:{
    e: React.FormEvent<HTMLFormElement>,
    postId: string
  }) => {

    await deleteMutation.mutateAsync({ postId })
  }




  return (
    <div className="flex flex-row gap-2">
     <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={(e) => handleDelete( {e, postId})}

     >
        <input type="hidden" name="postId" value={postId} />
        <button type="submit"

        >Delete</button>

     </form>
      </div>
  )
}

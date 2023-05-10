import { Avatar, Divider, Text, Tooltip } from "@mantine/core";
import { type Like, type User } from "@prisma/client";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import CommentSection from "./comment-section";
import React from "react";
import { ChatBubbleIcon, StarIcon, TrashIcon } from "@radix-ui/react-icons";
import LikeContainer from "./like-container";
import Button from "./button";
import CommentForm from "./comment/comment-form";

export type PostProps = {
  post: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    categories: {
      id: string;
      value: string;
    }[];
    comments: {
      id: string;
      body: string;
      createdAt: Date;
      updatedAt: Date;
    }[];
    likes: Like[];
    author: User;
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
        <h3 className="text-2xl font-bold dark:text-slate-50 text-left">{post.title}</h3>
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
      <Divider />
      <div className="flex flex-row flex-wrap gap-2">
        {post.categories.map((category) => {
          return (
            <div
              className="mr-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
              key={category.id}
            >
              {category.value}
            </div>
          );
        })}
      </div>
      <Divider />
     
    
      <BlogAction postId={post.id} />
      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
}

function BlogAction({ postId }: { postId: string }) {
  if (!postId) return null;

  const deleteMutation = api.post.deletePost.useMutation();

  const handleDelete = async ({
    postId,
  }: {
    e: React.FormEvent<HTMLFormElement>;
    postId: string;
  }) => {
    await deleteMutation.mutateAsync({ postId });
  };

  return (
    <div className="flex flex-row gap-2 items-center">
        <LikeContainer postId={postId} />

        <div className="flex flex-grow"/> 

        <Link href={`/posts/${postId}`} passHref>
          <Button variant="icon_text_unfilled" size="tiny">
            <ChatBubbleIcon />
          </Button>
        </Link>
          
      <form onSubmit={(e) => void handleDelete({ e, postId })}>
        <input type="hidden" name="postId" value={postId} />
        <Button 
        variant="icon_text_unfilled"
        size="tiny"
        type="submit">
          <TrashIcon />
        </Button>
      </form>
    </div>
  );
}

import {
  Avatar,
  Button,
  Card,
  CopyButton,
  Divider,
  Flex,
  Group,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { Post, User } from "@prisma/client";
import { ChatBubbleIcon, CopyIcon, HeartIcon, Share1Icon } from '@radix-ui/react-icons'
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Comment } from '~/utils/api'
import CommentSection from "./comments/comment-section";


export type PostCardProps = {
  post: Post & {
    author: Omit<User, "emailVerified">
    comments: Omit<Comment, "user">[];
  }

}
export default function PostCard({ post }: PostCardProps) {
  return (
    <>
      <div
        key={post.id}
        className="mb-10 w-full rounded-lg border-2 p-2 shadow-md hover:translate-y-2 "
      >
        <Link href={`/posts/${post.id}`} passHref>
          <Title>{post.title}</Title>
        </Link>

        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={100}
            height={100}
          />
        )}

        <div
          className="prose prose-slate overflow-auto  text-sm"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Divider />
        <div className="flex flex-row items-center pt-2 justify-between">
          <div className='flex gap-2 '>
            <HeartIcon />
            <p className="text-xs">0</p>
            <ChatBubbleIcon />
            <p className="text-xs">{
              post.comments?.length
            }</p>
            <CopyButton
              value={`https://trpc-blog-two.vercel.app/posts/${post.id}`}>

                {({ copied }) => (
                  <button
                    className={copied ? 'text-green-500' : 'text-black'}

                  >
<Share1Icon />
                  </button>
                )
              }

              </CopyButton>

            </div>
          <div className="flex flex-col">
            <p className="text-xs">Posted by:</p>
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
                <p className="text-xs">
                  {dayjs(post.createdAt).format("MMM D")}
                </p>
              </div>
            )}
          </div>
        </div>

        <CommentSection postId={post.id} />
      </div>
    </>
  );
}

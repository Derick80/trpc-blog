import {
  Avatar,
  Card,
  Divider,
  Flex,
  Group,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { Post, User } from "@prisma/client";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

export type PostProps = {
  post: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
  } & {
    author: Omit<User, "emailVerified">;
  };
};
export default function PostCard({ post }: PostProps) {
  return (
    <>
      <Card
        key={post.id}
        shadow="md"
        padding="xl"
        radius="xl"
        className="mb-10"
        withBorder
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

        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <Divider />
        <Group position="left"></Group>
        <Group position="right">
          <Flex align="center" direction="column">
            <Text>Posted by:</Text>
            {post.author && (
              <Flex align="center" direction="row">
                {" "}
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
              </Flex>
            )}
          </Flex>
        </Group>
      </Card>
    </>
  );
}

/* eslint-disable @typescript-eslint/no-misused-promises */
import { Container, Skeleton, Title } from "@mantine/core";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import React from "react";

import { api } from "~/utils/api";

export default function PostIdPage() {
  const router = useRouter();

  const postId = router.query.id as string;

  const { data, isLoading } = api.post.getSingle.useQuery({
    postId: router.query.id as string,
  });
  const [edit, setEdit] = React.useState(false);
  const [title, setTitle] = React.useState<string>(data?.title as string);
  const [content, setContent] = React.useState(data?.content as string);

  const { mutateAsync: deletePost } = api.post.deletePost.useMutation();

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    await deletePost({ postId });
    isLoading ? null : await router.push("/posts");
  };

  const { mutateAsync: updatePost } = api.post.updatePost.useMutation();

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(
      event.currentTarget as HTMLFormElement
    ).entries();
    console.log(formData);

    event.preventDefault();
    const data = { title, content, postId };
    await updatePost(data);
    isLoading ? null : await router.push("/posts");
  };

  return (
    <Container size="md">
      {edit ? (
        <form onSubmit={handleEdit} className="flex flex-col space-y-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={data?.title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="content">Content</label>
          <input
            type="text"
            name="content"
            defaultValue={data?.content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button type="submit">Update</button>
        </form>
      ) : (
        <>
          <Skeleton visible={isLoading}>
            <Title>{data?.title}</Title>
          </Skeleton>
          <Skeleton visible={isLoading}>
            <div
              dangerouslySetInnerHTML={{
                __html: data?.content || "",
              }}
            />
          </Skeleton>
        </>
      )}
      <button onClick={handleDelete}>
        <TrashIcon />
      </button>

      <button onClick={() => setEdit(!edit)}>Edit</button>
    </Container>
  );
}

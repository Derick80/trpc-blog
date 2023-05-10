/* eslint-disable @typescript-eslint/no-misused-promises */
import { MultiSelect } from "@mantine/core";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import React from "react";
import Button from "~/components/button";
import PostCard from "~/components/post-card";
import TipTap from "~/components/tip-tap";

import { api } from "~/utils/api";

export default function PostIdPage() {
  const router = useRouter();

  const postId = router.query.id as string;
  const { data: cats } = api.categories.getAll.useQuery();
  

  const { data, isLoading } = api.post.getSingle.useQuery({
    postId: router.query.id as string,
  });


  console.log(data, "data");
  
  const selectedCategory = data?.categories?.map((category) => category.value);
  console.log(selectedCategory, "selectedCategory");

  const [selected, setSelected] = React.useState(
    selectedCategory?.map((category) => {
      return category.valueOf();
    }) || []
  );
  console.log(selected, "selected");

  const [categories, setCategories] = React.useState<string[]>(
    cats?.map((category) => category.value) || []
  );

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
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();

    if (!title || !content || !selected) return;

    event.preventDefault();
    const data = { title, content, postId, categories: selected };

    await updatePost(data);
    isLoading ? null : await router.push("/posts");
  };

  return (
    <div className="flex flex-col gap-4">
      {edit ? (
        <form onSubmit={handleEdit} className="flex flex-col gap-4 rounded-md p-1">
          <label
            className="text-left"
          htmlFor="title">Title</label>
          <input
            type="text"
            className="rounded-md text-black p-1"
            name="title"
            defaultValue={data?.title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="content">Content</label>
          <TipTap content={data?.content} />
        <label htmlFor="categories">Categories</label>
          <MultiSelect
            multiple
            data={cats?.map((category) => category.value) || []}
            value={selected}
            onChange={(value) => {
              setSelected(value);
            }}
            placeholder="Select categories"
          />
          <Button variant="primary_filled" size="base" type="submit">
            Update
          </Button>
        </form>
      ) : (
        <>
          {isLoading ? (
            <div>Loading ...</div>
          ) : (
            <>
            {data && <PostCard post={data

            } />}
              <div className="flex flex-row gap-2">
                <Button
                  variant="primary_filled"
                  size="base"
                  onClick={() => setEdit(!edit)}
                >
                  Edit
                </Button>
                
                </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-misused-promises */
import { MultiSelect } from "@mantine/core";
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

  const [selected, setSelected] = React.useState(selectedCategory);
  console.log(selected, "selected");

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
  const utils = api.useContext();
  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();
    const postId = formData.get("postId")?.toString() as string;

    if (!title || !content || !postId || !selected) return;

    event.preventDefault();
    const data = { title, content, postId, categories: selected };

    await updatePost(data, {
      onSuccess: () => {
        setEdit(false);
      },
      onSettled: async () => {
        await utils.post.invalidate();
      },
    });

    isLoading ? null : await router.push("/posts");
  };

  return (
    <div className="flex flex-col gap-4">
      {edit ? (
        <form
          onSubmit={handleEdit}
          className="flex flex-col gap-4 rounded-md p-1"
        >
          <input type="hidden" name="postId" value={postId} />
          <label className="text-left" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            className="rounded-md p-1 text-black"
            name="title"
            defaultValue={data?.title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="content">Content</label>
          <TipTap content={data?.content} />
          <label htmlFor="categories">Categories</label>
          {/* <SelectBox options={categories.map((
            category
          ) => ({ id: category, value: category, label: category }

          ))} picked={
            selected.map((category) => ({ id: category, value: category, label: category }

            ))
            }
            name="categories"

          multiple={true} /> */}
          <MultiSelect
            data={cats?.map((category) => category.value) || []}
            value={selected}
            onChange={(value) => {
              setSelected(value);
            }}
            placeholder="Pick categories"
            multiple
            required
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
              {data && <PostCard post={data} />}
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

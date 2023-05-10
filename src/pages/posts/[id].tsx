/* eslint-disable @typescript-eslint/no-misused-promises */
import { MultiSelect } from "@mantine/core";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import React from "react";
import Button from "~/components/button";
import TipTap from "~/components/tip-tap";

import { api } from "~/utils/api";

export default function PostIdPage() {
  const router = useRouter();

  const postId = router.query.id as string;
  const { data: cats } = api.categories.getAll.useQuery();

  const { data, isLoading } = api.post.getSingle.useQuery({
    postId: router.query.id as string,
  });

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
        <form onSubmit={handleEdit} className="flex flex-col space-y-4 ">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={data?.title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="content">Content</label>
          <TipTap content={data?.content} />

          <MultiSelect
            multiple
            data={categories}
            value={selected.map((category) => {
              return category.valueOf();
            })}
            onChange={(value) => {
              setSelected(value);
            }}
            label="Categories"
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
              <div className="flex flex-row gap-2">
                <div className="mr-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
                  <h3 className="text-2xl font-bold  dark:text-slate-50">
                    {data?.title}
                  </h3>
                </div>
                <div className="flex flex-row gap-2">
                  {data?.content ? (
                    <div dangerouslySetInnerHTML={{ __html: data?.content }} />
                  ) : null}{" "}
                </div>
                <div className="flex flex-row gap-2">
                  {data?.categories?.map((category) => (
                    <div
                      className="mr-2 inline-block rounded-full bg-gray-200 px-2 py-1 text-sm font-semibold text-gray-700"
                      key={category.id}
                    >
                      {category.value}
                    </div>
                  ))}
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex justify-between">
                    <Button
                      variant="primary_filled"
                      size="base"
                      onClick={() => setEdit(!edit)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="icon_filled"
                      size="base"
                      onClick={handleDelete}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

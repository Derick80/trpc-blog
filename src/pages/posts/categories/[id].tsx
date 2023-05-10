import { useRouter } from "next/router";
import React from "react";
import PostCard from "~/components/post-card";
import { api } from "~/utils/api";

export default function PostIdPage() {
  const router = useRouter();

  const categoryId = router.query.id as string;
  const { data: cats } = api.categories.getAll.useQuery();

  const { data, isLoading } = api.post.getPostByCategory.useQuery({
    category: categoryId,
  });

  console.log(categoryId, "categoryId");
  console.log(cats, "cats");

  console.log(data, "data");

  const selectedCategory = cats?.map((category) => category.value);
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

  const { mutateAsync: deletePost } = api.post.deletePost.useMutation();
  console.log(data, "data");

  return (
    <div>
      <h1>PostIdPage</h1>
      <div className="flex flex-row flex-wrap gap-2">
        {data?.map((post) => {
          return <PostCard post={post} key={post.id} />;
        })}
      </div>
    </div>
  );
}

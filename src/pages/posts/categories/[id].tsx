import { useRouter } from "next/router";
import React from "react";
import PostCard from "~/components/post-card";
import { api } from "~/utils/api";

export default function PostIdPage() {
  const router = useRouter();

  const categoryId = router.query.id as string;
  console.log(categoryId, "categoryId");

  const { data: cats } = api.categories.getAll.useQuery();

  const { data, isLoading } = api.post.getPostByCategory.useQuery({
    category: categoryId,
  });

  const selectedCategory = cats?.map((category) => category.value);
  console.log(selectedCategory, "selectedCategory");

  const [selected, setSelected] = React.useState(
    selectedCategory?.map((category) => {
      return category.valueOf();
    }) || []
  );
  console.log(selected, "selected");
  if (data?.length === 0) {
    return router.back();
  }
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

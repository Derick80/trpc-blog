import Link from "next/link";
import Tags from "~/components/tags";
import { api } from "~/utils/api";

export default function CategoryIndexPage() {
  const { data, isLoading } = api.categories.getAll.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h3 className="text-2xl font-bold  dark:text-slate-50">
        <Link href="/categories/new">
          <p>Create Category</p>
        </Link>
      </h3>
      <h3 className="text-2xl font-bold  dark:text-slate-50">
        There are {data?.length} categories
      </h3>
      {data && <Tags tags={data} />}
    </div>
  );
}

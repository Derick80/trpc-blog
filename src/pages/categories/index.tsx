import Link from "next/link";
import Button from "~/components/button";
import Tags from "~/components/tags";
import { api } from "~/utils/api";

export default function CategoryIndexPage() {
  const { data, isLoading } = api.categories.getAll.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      <h3 className="text-2xl font-bold  dark:text-slate-50">
        <Button variant="primary_filled" size="base">
          <Link href="/categories/new">Create Category</Link>
        </Button>
      </h3>
      <h3 className="text-2xl font-bold  dark:text-slate-50">
        There are {data?.length} categories
      </h3>
      <div className="flex flex-col gap-1">{data && <Tags tags={data} />}</div>
    </div>
  );
}

type TagProps = {
  id: string;
  value: string;
};
export default function Tags({ tags }: { tags: TagProps[] }) {
  return (
    <div className="flex w-fit flex-row items-center gap-4">
      {tags.map((tag) => (
        <div key={tag.id} className="flex w-fit flex-row gap-4 border p-1">
          <p className="text-xs font-semibold">{tag.value}</p>
        </div>
      ))}
    </div>
  );
}

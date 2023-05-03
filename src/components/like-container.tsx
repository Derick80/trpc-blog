import { HeartIcon } from "@radix-ui/react-icons";

export default function LikeContainer({ likesCount }: { likesCount: number }) {
  return (
    <div className="flex h-12 w-12 cursor-pointer items-center justify-center bg-gray-100">
      <button className="flex h-8 w-8 cursor-pointer items-center  justify-center rounded-full">
        <HeartIcon className="h-5 w-5 text-gray-500" />
        <p className="text-gray-500">{likesCount}</p>
      </button>
    </div>
  );
}

import { HeartIcon } from '@radix-ui/react-icons'


export default function LikeContainer({likesCount}: {likesCount: number}) {

  return (
    <div
        className="flex items-center justify-center w-12 h-12 bg-gray-100 cursor-pointer"
    >
        <button className="flex items-center justify-center w-8 h-8  rounded-full cursor-pointer">
            <HeartIcon className="w-5 h-5 text-gray-500" />
            <p className="text-gray-500">{likesCount}</p>
        </button>

    </div>
  );
}
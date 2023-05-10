import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

export default function LikeContainer({ postId }: { postId: string }) {
  const { data, isLoading } = api.likePost.getPostLikes.useQuery({ postId });

  const utils = api.useContext();

  const { mutate, isSuccess, isError } = api.likePost.toggleLike.useMutation({
    onSuccess: () => {
      void utils.likePost.getPostLikes.invalidate({ postId });
    },
    onSettled: () => {
      void utils.likePost.getPostLikes.invalidate({ postId });
    },
  });

  const { data: user } = useSession();
  if (!user) return null;

  const userLiked = data?.some((like) => like.userId === user?.user.id);

  const handleLike = (postId: string) => {
    mutate({ postId });
  };

  return (
    <div className="relative flex flex-row items-center">
      <button onClick={() => handleLike(postId)}>
        {userLiked ? (
          <div className="relative flex flex-row items-center">
            <HeartFilledIcon
              style={{
                color: "red",
              }}
            />
            <p className="absolute -bottom-2 -right-2 text-xs text-white">
              {data?.length}
            </p>
          </div>
        ) : (
          <HeartIcon />
        )}
      </button>
    </div>
  );
}

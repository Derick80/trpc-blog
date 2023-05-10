import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

export default function CommentLikeContainer({ commentId }: { commentId: string }) {
    const { data, isLoading } = api.commentLike.getCommentLikes.useQuery({ commentId });

    const utils = api.useContext();

    const { mutate, isSuccess, isError } = api.commentLike.toggleLike.useMutation({
        onSuccess: () => {
            void utils.commentLike.getCommentLikes.invalidate({ commentId });
        },
        onSettled: () => {
            void utils.commentLike.getCommentLikes.invalidate({ commentId });
        },
    });

    const { data: user } = useSession();
    if (!user) return null;

    const userLiked = data?.some((like) => like.userId === user?.user.id);

    const handleLike = (commentId: string) => {
        mutate({ commentId });
    }

    return (
        <div className="relative flex flex-row items-center">
            <button onClick={() => handleLike(commentId)}>
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

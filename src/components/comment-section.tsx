import { useRouter } from "next/router";
import { api } from "~/utils/api";
import CommentForm from "./comment/comment-form";
import ListComments from "./comment/comment-list";
import formComments from "./format-comments";

export default function CommentSection({ postId }: { postId?: string }) {
  const router = useRouter();

  const { data } = api.comment.getAll.useQuery(
    {
      postId: postId || (router.query.id as string),
    },
    {
      enabled: !!postId || !!router.query.id,
    }
  );

  return (
    <div className="items-centser flex flex-col justify-center gap-2 rounded-xl bg-slate-50 p-2 text-black dark:bg-black dark:text-slate-50">
      <CommentForm postId={postId || (router.query.id as string)} />

      <ListComments
        comments={formComments(data || [])}
        postId={postId || (router.query.id as string)}
      />
    </div>
  );
}

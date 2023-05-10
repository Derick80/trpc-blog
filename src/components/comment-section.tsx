import { useRouter } from "next/router";
import { CommentWithChildren, api } from "~/utils/api";
import CommentForm from "./comment/comment-form";
import ListComments from "./comment/comment-list";

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

  const rootComments = data?.filter(
    (comment) => !comment.parentId
  ) as CommentWithChildren[]

  return (
    <div className="items-centser flex flex-col justify-center gap-2 rounded-xl bg-slate-50 p-2 text-black  dark:bg-black dark:text-slate-50">
      <CommentForm postId={postId || (router.query.id as string)} />

      <ListComments
        comments={rootComments || []}
        postId={postId || (router.query.id as string)}
      />
    </div>
  );
}

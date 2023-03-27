import { Box } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import formComments from "~/helpers/formatComments";
import { api } from "~/utils/api";
import CommentForm from "./comment-form";
import ListComments from "./list-comments";

export default function CommentSection({ postId }: { postId?: string }) {
  const [show, setShow] = React.useState(false);
  console.log(postId, "postid");

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
    <Box>
      <CommentForm postId={postId } />
{data && data?.length > 0 && (
        <button onClick={ () => setShow(!show) }>Show comments</button>
)

}
      {show && data && <ListComments comments={formComments(data || [])} />}
    </Box>
  );
}

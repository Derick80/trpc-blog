import { Avatar, Box, Paper, Group, Text, Button } from "@mantine/core";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React from "react";
import { api, type CommentWithChildren } from "~/utils/api";
import CommentForm from "./comment-form";

function getReplyCountText(count: number) {
  if (count === 0) {
    return "No replies";
  }

  if (count === 1) {
    return "1 reply";
  }

  return `${count} replies`;
}

function CommentActions({
  editableUser,
  commentId,
  replyCount,
  postId,
}: {
  postId: string;
  editableUser: string;
  commentId: string;
  replyCount: number;
}) {
  const { data: session } = useSession();
  const isEditable = session?.user.id === editableUser ? true : false;
  const { mutateAsync, isSuccess } = api.comment.delete.useMutation({});
  const [replying, setReplying] = React.useState(false);

  const handleDelete = async () => {
    await mutateAsync({
      id: commentId,
    });
    if (isSuccess) {
      window.location.reload();
    }
  };

  return (
    <>
      <Group position="apart" mt="md">
        <Text>{getReplyCountText(replyCount)}</Text>
        {isEditable && <Button variant="outline">Edit</Button>}
        {isEditable && (
          <Button onClick={() => void handleDelete()} variant="outline">
            Delete
          </Button>
        )}
        <Button onClick={() => setReplying(!replying)} variant="outline">
          Reply
        </Button>
      </Group>
      {replying && <CommentForm postId={postId} parentId={commentId} />}
    </>
  );
}

function Comment({
  comment,
  postId,
}: {
  comment: CommentWithChildren;
  postId: string;
}) {
  return (
    <Paper withBorder radius="md" p="md" mb="md">
      <Box
        sx={() => ({
          display: "flex",
        })}
      >
        <Avatar src={comment?.user?.image} />

        <Box
          pl="md"
          sx={() => ({
            display: "flex",
            flexDirection: "column",
          })}
        >
          <Group>
            <Text>{comment?.user?.name}</Text>
            <Text>
              {dayjs(comment.createdAt).format("MMMM D, YYYY [at] h:mm A")}
            </Text>
          </Group>
          {comment.body}
        </Box>
      </Box>
      <CommentActions
        postId={postId}
        editableUser={comment?.user?.id}
        commentId={comment.id}
        replyCount={comment.children?.length || 0}
      />
      {comment.children && comment.children.length > 0 && (
        <ListComments postId={comment.postId} comments={comment.children} />
      )}
    </Paper>
  );
}

// Render out all comments
export default function ListComments({
  comments,
  postId,
}: {
  comments: CommentWithChildren[];
  postId: string;
  // This is the array of comments
}) {
  return (
    <Box>
      {comments.map((comment) => {
        return <Comment key={comment.id} comment={comment} postId={postId} />;
      })}
    </Box>
  );
}

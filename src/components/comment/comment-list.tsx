import { Avatar, Box, Paper, Group, Text, Divider } from "@mantine/core";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Button from "~/components/button";
import React from "react";
import { api, type CommentWithChildren } from "~/utils/api";
import CommentForm from "./comment-form";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { isError } from "@tanstack/react-query";
import { Comment } from "~/utils/api";
import { User } from "@prisma/client";
import CommentLikeContainer from "../comment-like-container";

function getReplyCountText(count: number) {
  if (count === 0) {
    return "";
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
  const [editing, setEditing] = React.useState(false);
  const { data: session } = useSession();
  const isEditable = session?.user.id === editableUser ? true : false;
  const { mutateAsync, isSuccess } = api.comment.delete.useMutation({});
  const [replying, setReplying] = React.useState(false);

  const utils = api.useContext();
  const handleDelete = async () => {
    await mutateAsync({
      id: commentId,
    });
    if (isSuccess) {
      await utils.comment.invalidate();
      await utils.post.invalidate();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <p className="text-xs font-semibold">{getReplyCountText(replyCount)}</p>
       
        {isEditable && (
          <Button
            variant="primary_filled"
            size="tiny"
            onClick={() => setEditing(!editing)}
          >
            Edit
          </Button>
        )}
        {isEditable && (
          <Button
            onClick={() => void handleDelete()}
            variant="danger_filled"
            size="tiny"
          >
            Delete
          </Button>
        )}
        <Button
          onClick={() => setReplying(!replying)}
          variant="primary_filled"
          size="tiny"
        >
          Reply
        </Button>
      </div>
      {replying && <CommentForm postId={postId} parentId={commentId} />}
    </div>
  );
}

function Comment({
  comment,
  postId,
}: {
  comment: CommentWithChildren;
  postId: string;
}) {
  const [replies, setReplies] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const { data, isLoading } = api.comment.getChildComments.useQuery({
    parentId: comment.id,
  });

  const { mutate, isSuccess, isError } = api.comment.update.useMutation({});

  const utils = api.useContext();
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleEdit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const body = formData.get("body") as string;
    const id = formData.get("id") as string;

    if (!body || !id) return;
    mutate({
      id,
      body,
    });

    if (isSuccess) {
      formRef?.current?.reset();
      setEditing(!editing);
      await utils.comment.invalidate();
      await utils.post.invalidate();
    }

    if (isError) {
      alert("Something went wrong");
    }
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-2 rounded-md bg-slate-400 p-1">
        {editing ? (
          <div className="flex flex-row items-center gap-2">
            <form
              className="flex flex-row gap-1 p-1"
              onSubmit={(e) => void handleEdit(e)}
              ref={formRef}
            >
              <input
                type="text"
                name="id"
                value={comment.id}
                className="text-black"
                onChange={(e) => console.log(e.currentTarget.value)}
              />
              <input
                required
                name="body"
                className="w-full rounded-md text-black"
                defaultValue={comment.body}
                onChange={(e) => console.log(e.currentTarget.value)}
              />
              <div className="flex flex-grow" />
              <Button variant="primary_filled" size="tiny" type="submit">
                {isSuccess ? "Updated" : "Update"}
              </Button>
            </form>
            <Button
              variant="primary_filled"
              size="tiny"
              type="button"
              onClick={() => setEditing(!editing)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-between gap-2">
            <p className="text-left text-xs font-semibold">{comment.body}</p>
            <div className="flex flex-grow" />

            <div className="flex flex-row items-center gap-2">
              <Button
                variant="primary_filled"
                size="tiny"
                onClick={() => setEditing(!editing)}
              >
                Edit
              </Button>
              <Button
                variant="primary_filled"
                size="tiny"
                onClick={() => setReplies(!replies)}
              >
                {replies ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Button>
            </div>
            {replies && (
              <CommentActions
                postId={postId}
                editableUser={comment.user.id}
                commentId={comment.id}
                replyCount={comment.children.length}
              />
            )}
          </div>
        )}

        <div className="flex flex-row items-center gap-4">
        <CommentLikeContainer commentId={comment.id} />
          <p className="text-xs font-semibold">{comment.user.name} commented</p>

          <p className="text-xs font-semibold">
            {dayjs(comment.createdAt).format("MMMM D, YYYY [at] h:mm A")}
          </p>
          
          <div className="flex flex-grow" />
          <div className="flex flex-row items-center gap-2">
            {comment.children?.length > 0 && (
              <div className="flex flex-row items-center gap-2">
                <p className="text-xs font-semibold">
                  {getReplyCountText(comment.children.length)}
                </p>

                <Button
                  variant="primary_filled"
                  size="tiny"
                  onClick={() => setReplies(!replies)}
                >
                  {replies ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {replies && comment.children && comment.children.length > 0 && (
        <div className="flex w-full flex-row justify-between gap-2 indent-4">
          <ListComments postId={comment.postId} comments={data} />
        </div>
      )}
    </>
  );
}

// Render out all comments
export default function ListComments({
  comments,
  postId,
}: {
  comments: Comment[] & User[] & { children: Comment[] };
  postId: string;
  // This is the array of comments
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {comments.map((comment) => {
        return <Comment key={comment.id} comment={comment} postId={postId} />;
      })}
    </div>
  );
}

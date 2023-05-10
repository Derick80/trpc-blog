import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import Button from "../button";

export default function CommentForm({
  parentId,
  postId,
}: {
  parentId?: string;
  postId: string;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);

  const [body, setBody] = React.useState<string>("");
  const [postingId, setPostId] = React.useState<string>(postId);

  const { mutateAsync, isSuccess } = api.comment.create.useMutation({});
  const utils = api.useContext();
  const handleSubmit = async (body: string) => {
    await mutateAsync({
      postId: postingId,
      parentId,
      body,
    });
    await utils.comment.invalidate();

    formRef.current?.reset();

    if (isSuccess) {
      formRef.current?.reset();
      await utils.comment.invalidate();
    }
  };

  return (
    <>
      <form
        ref={formRef}
        className="flex flex-row gap-1 p-1"
        onSubmit={(e) => {
          e.preventDefault();

          void handleSubmit(body);
        }}
      >
        <input
          type="hidden"
          className="text-black"
          value={postingId}
          onChange={(e) => setPostId(e.target.value)}
        />
        <input
          required
          className="w-full rounded-md text-black"
          placeholder="Your spicey comment"
          onChange={(e) => setBody(e.target.value)}
        />

        <Button variant="primary_filled" size="tiny" type="submit">
          {parentId ? "Post reply" : "Post comment"}
        </Button>
      </form>
    </>
  );
}

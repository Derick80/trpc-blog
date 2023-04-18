import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

export default function CommentForm({
  parentId,
  postId,
}: {
  parentId?: string;
  postId: string;
}) {
  const router = useRouter();
  console.log(router, "router");

  const formRef = React.useRef<HTMLFormElement>(null);

  const [body, setBody] = React.useState<string>("");
  const [postingId, setPostId] = React.useState<string>(postId);

  const { mutateAsync, isSuccess } = api.comment.create.useMutation({});

  const handleSubmit = async (body: string) => {
    await mutateAsync({
      postId: postingId,
      parentId,
      body,
    });

    if (isSuccess) {
      await router.push(`/posts`);
      formRef.current?.reset();
    }
  };

  return (
    <>
      <form
        ref={formRef}
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();

          void handleSubmit(body);
        }}
      >
        <input
          type="hidden"
          value={postingId}
          onChange={(e) => setPostId(e.target.value)}
        />
        <input
          required
          placeholder="Your spicey comment"
          onChange={(e) => setBody(e.target.value)}
        />

        <button type="submit">
          {parentId ? "Post reply" : "Post comment"}
        </button>
      </form>
    </>
  );
}

import { Box, Button, Group, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function CommentForm({
  parentId,
  postId,
}: {
  parentId?: string;
  postId?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = api.comment.create.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries();
    },
  });

  const form = useForm({
    initialValues: {
      body: "",
    },
  });

  const handleSubmit = async (values: { body: string }) => {
    await mutateAsync({
      postId: postId || (router.query.id as string),
      parentId,
      body: values.body,
    });
    form.reset(),
      {
        onSuccess: () => {
          router.reload();
        },
      };
  };

  return (
    <>
      <Box mt="md" mb="md">
        <form onSubmit={form.onSubmit(() => void handleSubmit)}>
          <Textarea
            required
            placeholder="Your spicey comment"
            label="Comment"
            {...form.getInputProps("body")}
          />

          <Group position="right" mt="md">
            <Button loading={isLoading} type="submit">
              {parentId ? "Post reply" : "Post comment"}
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
}

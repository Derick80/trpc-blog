import { useRouter } from "next/router";
import React from "react";
import { object, string } from "zod";
import Button from "~/components/button";
import { api } from "~/utils/api";

export const catergorySchema = object({
  value: string()
    .min(3, {
      message: "Name must be at least 5 characters long",
    })
    .max(100),
});
export default function NewCategoryPage() {
  const router = useRouter();
  const [value, setValue] = React.useState<string>("");
  const [error, setError] = React.useState();

  const { mutateAsync, isLoading, isSuccess } =
    api.categories.create.useMutation();

  async function handleCategorySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("value")?.toString();
    if (!value) return;
    const data = {
      value,
    };
    try {
      await catergorySchema.parseAsync(data);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return setError(error);
    }
    await mutateAsync(data);
    await router.push("/categories");
  }

  return (
    <>
      <form
        className="flex flex-col gap-2 rounded-md  "
        onSubmit={(e) => void handleCategorySubmit(e)}
      >
        <label className="text-left" htmlFor="value">
          Category Name
        </label>
        <input
          className="rounded-md p-1 text-black"
          type="text"
          name="value"
          id="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Button variant="primary_filled" size="base" type="submit">
          Submit
        </Button>
        {error && JSON.stringify(error)}
      </form>
    </>
  );
}

import { Box, MultiSelect } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { object, string } from "zod";
import { api } from "~/utils/api";
import Button from "./button";
import TipTap from "./tip-tap";

export const postSchema = object({
  title: string()
    .min(5, {
      message: "Title must be at least 5 characters long",
    })
    .max(100),
  content: string()
    .min(5, {
      message: "Content must be at least 5 characters long",
    })
    .max(1000),
});

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = React.useState<string>("");
  const [error, setError] = React.useState();
const {data, isLoading} = api.categories.getAll.useQuery()

  const { mutateAsync, isSuccess } = api.post.new.useMutation();
  const [selected, setSelected] = useState<string>("")
  const [categories, setCategories] = useState<string[]>(
    data?.map((category) => category.value) || []
  
  )
  
  async function handlePostSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();

    if (!title || !content || !categories) return;
    const data = {
      title,
      content,
      url,
      category: selected,
    };

    try {
      await postSchema.parseAsync(data);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return setError(error);
    }
    await mutateAsync(data);
    await router.push("/posts");
  }

  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");
  const { mutateAsync: fetchPresignedUrls } =
    api.s3.getStandardUploadPresignedUrl.useMutation();
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      maxFiles: 1,
      maxSize: 5 * 2 ** 30, // roughly 5GB
      multiple: false,
      onDropAccepted: (files, _event) => {
        const file = files[0] as File;

        fetchPresignedUrls({
          key: file.name,
        })
          .then((url) => {
            setPresignedUrl(url);
            setSubmitDisabled(false);
          })
          .catch((err) => console.error(err));
      },
    });

  const files = useMemo(() => {
    if (!submitDisabled)
      return acceptedFiles.map((file) => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ));
    return null;
  }, [acceptedFiles, submitDisabled]);

  const handleSubmit = useCallback(async () => {
    if (acceptedFiles.length > 0 && presignedUrl !== null) {
      const file = acceptedFiles[0] as File;
      await axios
        .put(presignedUrl, file.slice(), {
          headers: { "Content-Type": file.type },
        })
        .then((response) => {
          console.log(response);
          console.log("Successfully uploaded ", file.name);
        })
        .then(() => {
          setUrl(
            `https://remix-bucket.s3.us-east-2.amazonaws.com/${file.name}`
          );
        })
        .catch((err) => console.error(err));
      setSubmitDisabled(true);
    }
  }, [acceptedFiles, presignedUrl]);

  // console.log(url, "url")
  // console.log(presignedUrl, "presignedUrl");

  return (
    <>
      <Box
        sx={{
          width: "50%",
          margin: "auto",
        }}
      >
        <form onSubmit={(e) => void handlePostSubmit(e)}>
          <input
            type="text"
            className="text-black"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="Content">Content</label>
          <TipTap />

          {error && JSON.stringify(error)}
          <input
            type="text"
            className="text-black"
            name="url"
            value={url || ""}
          />
          <label htmlFor="categories">Categories</label>
          {/* <select multiple name="categories" id="categories">
            {data?.map((category) => (
              <option key={category.id} value={category.value}>
                {category.value}
              </option>
            ))}
          </select> */}
<MultiSelect 
data={categories}
shadow="sm"
onChange={(e) => setSelected(e.join(","))}

/>

          <Button variant="primary_filled" type="submit">
            Submit
          </Button>
        </form>
        <section>
          <h2 className="text-lg font-semibold">Standard Dropzone</h2>

          <div {...getRootProps()} className="dropzone-container">
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex h-full items-center justify-center font-semibold">
                <p>Drop the file here...</p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center font-semibold">
                <p>Drag n drop file here, or click to select files</p>
              </div>
            )}
          </div>
          <aside className="my-2">
            <h4 className="font-semibold text-zinc-400">
              Files pending upload
            </h4>
            <ul>{files}</ul>
          </aside>
          <button
            onClick={() => void handleSubmit()}
            disabled={
              presignedUrl === null ||
              acceptedFiles.length === 0 ||
              submitDisabled
            }
            className="submit-button"
          >
            Upload
          </button>
        </section>
      </Box>
    </>
  );
}

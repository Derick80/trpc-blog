import { Box, Button, Textarea, TextInput } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { object, string } from "zod";
import { api } from "~/utils/api";

export const postSchema = object({
  title: string().min(10).max(100),
  content: string().min(10).max(1000),
  slug: string().min(10).max(1000).optional(),
});

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = React.useState<string>("");
  const [content, setContent] = React.useState("");
  const [error, setError] = React.useState();

  const { mutateAsync, isLoading } = api.post.new.useMutation();

  async function handlePostSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement).entries();
    console.log(formData);

    const data = { title, content, url };
    try {
      await postSchema.parseAsync(data);
    } catch (error) {
      return;
    }
    await mutateAsync(data);
    isLoading ? null : await router.push("/posts");
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
          console.log(response, "response");
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
      {error && JSON.stringify(error)}
      <Box
        sx={{
          width: "50%",
          margin: "auto",
        }}
      >
        <form onSubmit={(e) => void handlePostSubmit(e)}>
          <TextInput label="Title" onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            label="Content"
            onChange={(e) => setContent(e.target.value)}
          />
          <input type="text" name="url" value={url || ""} />
          <Button variant="outline" type="submit">
            Submit
          </Button>
        </form>
        <section>
          <h2 className="text-lg font-semibold">Standard Dropzone</h2>
          <p className="mb-3">
            Simple example for uploading one file at a time
          </p>
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

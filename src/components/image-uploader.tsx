import axios from "axios";
import React, { useState, useMemo, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "~/utils/api";

export default function ImageForm() {
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");
  const { mutateAsync: fetchPresignedUrls } =
    api.s3.getStandardUploadPresignedUrl.useMutation();
  const [submitDisabled, setSubmitDisabled] = React.useState(true);

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

  return (
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
        <h4 className="font-semibold text-zinc-400">Files pending upload</h4>
        <ul>{files}</ul>
      </aside>
      <button
        id="imageForm"
        onClick={() => void handleSubmit()}
        disabled={
          presignedUrl === null || acceptedFiles.length === 0 || submitDisabled
        }
        className="submit-button"
      >
        Upload
      </button>
    </section>
  );
}

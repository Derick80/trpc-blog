import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState, useMemo, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "~/utils/api";

export default function CreateProfile() {
  const userId = useSession().data?.user?.id;

  console.log(userId, "userId");

  const { mutate, isLoading } = api.profile.createProfile.useMutation();

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
  function handleCreateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bio = formData.get("bio") as string;
    const pronouns = formData.get("pronouns") as string;
    const userId = formData.get("userId") as string;
    const profileImage = formData.get("profileImage") as string;

    const data = {
      bio,
      pronouns,
      profileImage,
      userId,
    };
    mutate(
      { bio, pronouns, profileImage, userId },
      {
        onSuccess: () => {
          console.log("success");
        },
      }
    );
  }

  return (
    <div>
      <h1>Create Profile</h1>
      <form
        className="flex flex-col gap-1 rounded-md text-black"
        onSubmit={handleCreateProfile}
      >
        <div className="flex flex-col gap-1 rounded-md bg-gray-100 p-4">
          <input type="hidden" name="userId" value={userId} />
          <label htmlFor="'bio">Bio</label>
          <textarea name="bio" id="bio" />
          <label htmlFor="pronouns">Pronouns</label>
          <select name="pronouns" id="pronouns">
            <option value="he/him">He/Him</option>
            <option value="she/her">She/Her</option>
            <option value="they/them">They/Them</option>
          </select>

          <label htmlFor="profileImage">Profile Image</label>
          <input
            type="text"
            name="profileImage"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            id="profileImage"
          />

          <button type="submit">Create Profile</button>
        </div>
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
          <h4 className="font-semibold text-zinc-400">Files pending upload</h4>
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
    </div>
  );
}

function ImageForm() {
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

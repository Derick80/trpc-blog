import { type Profile, type User } from "@prisma/client";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import Button from "./button";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { api } from "~/utils/api";
import { z } from "zod";

type Props = {
  user: User & {
    profile: Profile | null;
  };
};

export default function ProfileCard({ user }: Props) {
  const [edit, setEdit] = React.useState<boolean>(false);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");
  const { mutateAsync: fetchPresignedUrls } =
    api.s3.getStandardUploadPresignedUrl.useMutation();
  const [submitDisabled, setSubmitDisabled] = React.useState(true);
  const { mutate } = api.profile.updateProfile.useMutation();
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

  const utils = api.useContext();
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const profileId = user.profile?.toString();
    const formData = new FormData(e.currentTarget);
    const bio = formData.get("bio")?.toString() || "";
    const pronouns = formData.get("pronouns")?.toString() || "";
    const profileImage = formData.get("profileImage")?.toString() || "";

    if (!profileId || !bio || !pronouns || !profileImage) return;

    mutate(
      { profileId, bio, pronouns, profileImage },

      {
        onSuccess: () => {
          setEdit(false);
        },
        onSettled: () => {
          void utils.profile.getProfile.refetch();
        },
      }
    );
  }
  return (
    <div className="flex w-full flex-col gap-4 rounded-md leading-relaxed  shadow-lg drop-shadow-md">
      <div className="flex w-full flex-col gap-4 border-2 border-green-500 p-1">
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-semibold text-slate-50">User Avatar:</p>
          <Image
            src={user?.profile?.profileImage || ""}
            alt="user avatar"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-semibold text-slate-50">User Bio:</p>
          <p className="text-sm font-semibold text-slate-50">
            {user?.profile?.bio || ""}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-semibold text-slate-50">User Pronouns:</p>
          <p className="text-sm font-semibold text-slate-50">
            {user?.profile?.pronouns || ""}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-semibold text-slate-50">User Email:</p>
          <p className="text-sm font-semibold text-slate-50">
            {user?.email || ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {edit ? (
            <Button
              variant="primary_filled"
              size="base"
              onClick={() => setEdit(false)}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="primary_filled"
              size="base"
              onClick={() => setEdit(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {edit && (
          <div className="flex flex-col gap-2">
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-1 rounded-md text-black"
            >
              <label className=" text-left text-slate-50" htmlFor="bio">
                Bio
              </label>
              <textarea
                className="rounded-md p-1"
                name="bio"
                id="bio"
                defaultValue={user.profile?.bio || ""}
              />
              <label className=" text-left text-slate-50" htmlFor="pronouns">
                Pronouns
              </label>
              <select className="rounded-md p-1" name="pronouns" id="pronouns">
                <option value="he/him">He/Him</option>
                <option value="she/her">She/Her</option>
                <option value="they/them">They/Them</option>
              </select>

              <input
                type="hidden"
                name="profileImage"
                id="profileImage"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button variant="primary_filled" size="base" type="submit">
                Update Profile
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
                id="imageForm"
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
        )}
      </div>
    </div>
  );
}

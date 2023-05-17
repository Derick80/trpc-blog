import { Import } from "lucide-react";
import { api } from "~/utils/api";
import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Button from "./button";
import { UploadIcon } from "@radix-ui/react-icons";

export default function PhotoUploader({ photoId }: { photoId: string }) {
  const [edit, setEdit] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [presignedUrl, setPresignedUrl] = React.useState<string | null>(null);

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
            `https://remix-bucket-2023.s3.us-east-2.amazonaws.com/${file.name}`
          );
        })
        .catch((err) => console.error(err));
      setSubmitDisabled(true);
    }
  }, [acceptedFiles, presignedUrl]);

  const { data, isLoading } = api.datingProfile.getPrivePhotoById.useQuery({
    photoId,
  });

  // if(isLoading){
  //     return <div>Loading...</div>
  // }

  // if(!data){
  //     return <div>Photo not found</div>
  // }

  const { mutate } = api.datingProfile.updatePrivatePhoto.useMutation();
  const utils = api.useContext();
  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get("url") as string;
    mutate(
      {
        photoId,
        imageUrl: url,
      },
      {
        onSuccess: () => {
          setEdit(false);
          void utils.datingProfile.getPrivePhotoById.invalidate({ photoId });
        },
      }
    );
  };

  {
    onSettled: () => {
      void utils.datingProfile.getPrivePhotoById.invalidate({ photoId });
    };
  }

  return (
    <>
      {edit ? (
        <section
            className="flex flex-col gap-2 justify-around items-center"
        >
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
          <Button
            variant="warning_filled"
            size="small"
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
          </Button>
          <div className="flex flex-col gap-2 h-52 w-52">
            {url ? (
                <Image
                src={url || ""}
                alt={data?.id || ""}
                className="w-full h-full object-cover rounded-md    "
                width={200}
                height={200}
                />
            ) : (
                <div className="flex flex-col gap-2 h-52 w-52">
                </div>
            )}
            </div>


        
          <form onSubmit={handleUpdate} className="flex flex-col gap-2 justify-around">
            <input
              type="text"
              className="text-black rounded-md"
              value={url}
              name="url"
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
            <Button
                variant="primary_filled"
                size="small"
            type="submit">Save</Button>
          </form>
          <Button
            variant="warning_filled"
            size="small"
          onClick={() => setEdit(!edit)}>Cancel</Button>
        </section>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
          {data?.imageUrl ? (
            <Image
            src={data?.imageUrl || ""}
            alt={data?.id}
            className="w-full h-full object-cover rounded-md    "
            width={200}
            height={200}
          />
          ) : (
            <div className="flex flex-col gap-2 h-52 w-52">
                </div>  
            )}
          <button
          className="justify-center"
            onClick={() => {
              setEdit(!edit);
            }}
          >
            <UploadIcon />
          </button>
        </div>
      )}
    </>
  );
}

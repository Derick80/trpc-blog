import CreatePost from "~/components/create-post";
import type { Metadata } from "next";

const metadata: Metadata = {
  title: "Derick's Blog",
  description: "Derick's Blog Create Post",
  // ...
};

export default function NewPostPage() {
  return (
    <>
      <CreatePost />
    </>
  );
}

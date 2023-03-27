import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import CreatePost from "~/components/create-post";




export default function NewPostPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      { session ? <CreatePost /> : router.push("/")}

    </>
  );
}

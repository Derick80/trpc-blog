import Link from 'next/link'

import { api } from "~/utils/api";


function PostListingPage() {
    const { data, isLoading } = api.post.getAll.useQuery()

    if (isLoading) {
      return <p>Loading...</p>
    }

    return (
      <div>
        {data?.map((post) => {
          return (
            <article key={post.id}>
              <p>{post.title}</p>
              <Link href={`/posts/${post.id}`}>Read post</Link>
            </article>
          )
        })}
      </div>
    )
  }

  export default PostListingPage



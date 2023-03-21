import Link from 'next/link'
import PostCard from '~/components/post-card'

import { api } from "~/utils/api";


function PostListingPage() {
    const { data, isLoading } = api.post.getAll.useQuery()

    if (isLoading) {
      return <p>Loading...</p>
    }

    return (
      <div>
        {data?.length}
<Link href="/posts/new">Create Post</Link>

        {data?.map((post) => {
          return(
            <PostCard key={post.id} post={post} />
          )
        })}
      </div>
    )
  }

  export default PostListingPage



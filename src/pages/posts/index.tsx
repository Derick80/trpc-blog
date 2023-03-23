import Link from 'next/link'
import PostCard from '~/components/post-card'
import { StandardDropzone } from '~/components/standard-dropzone'

import { api, RouterOutputs } from "~/utils/api";


function PostListingPage() {

    const { data, isLoading } = api.post.getAll.useQuery()

    if (isLoading) {
      return <p>Loading...</p>
    }

    return (
      <div
        className='mx-auto flex flex-col w-[350px] md:w-1/2'

      >
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



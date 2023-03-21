import { Container, Skeleton, Title } from '@mantine/core'
import { TrashIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/router'
import CommentForm from '~/components/comment/comment-form'
import CommentSection from '~/components/comment/comment-section'
import { api } from '~/utils/api'

export default function PostIdPage(){
    const router = useRouter()
    const {slug} = router.query as {slug: string}
console.log(slug, 'slug');

const { data, isLoading } = api.post.getSingle.useQuery({slug})
console.log(data, 'data');

const postId = data?.id as string

    const { mutateAsync: deletePost,

    } = api.post.deletePost.useMutation()
    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const data = { postId }
        await deletePost(data)

    }
    return (
      <Container>
        <Skeleton visible={isLoading}>
            <Title>{data?.title}</Title>
        </Skeleton>
        <Skeleton visible={isLoading}>
          <div
            dangerouslySetInnerHTML={{
                __html: data?.content || '',
            }}
            />
        </Skeleton>
        <button onClick={handleDelete}>
            <TrashIcon />

        </button>
      <CommentSection />
      </Container>
    )
}
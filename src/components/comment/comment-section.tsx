import { Box } from '@mantine/core'
import { useRouter } from 'next/router'
import formComments from '~/helpers/formatComments'
import { api } from '~/utils/api'
import CommentForm from './comment-form'
import ListComments from './list-comments'
export default function CommentSection(){
    const router = useRouter()
    const postId = router.query.id as string
console.log(postId, 'postId');

    const {data} = api.comment.getAll.useQuery({
        postId
    })


    return(
        <Box>
            <CommentForm />
            {
                data && <ListComments
                comments={data}
                />
            }
        </Box>
    )

}
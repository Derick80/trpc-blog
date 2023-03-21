import { Box } from '@mantine/core'
import { useRouter } from 'next/router'
import formComments from '~/helpers/formatComments'
import { api } from '~/utils/api'
import CommentForm from './comment-form'
import ListComments from './list-comments'
export default function CommentSection(){
    const router = useRouter()
    const slug = router.query.slug as string
console.log(slug, 'slug');

    const {data} = api.comment.getAll.useQuery({
        slug
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
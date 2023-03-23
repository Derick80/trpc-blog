import { Box, Button, Group, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import { api } from '~/utils/api'
export default function CommentForm({parentId}:{parentId?: string}){
const router = useRouter()
const postId = router.query.id as string
const {mutateAsync, isLoading} = api.comment.create.useMutation()





const form = useForm({
    initialValues: {
        body: '',
    },
})


const handleSubmit = async (values: {
    body: string

}) => {
    await mutateAsync({
        postId,
        parentId,
        body: values.body,
    })
    form.reset()
}



    return(
        <>
            <Box mt="md" mb="md">
                <form onSubmit={ form.onSubmit(handleSubmit) }>
                    <Textarea
                        required
                        placeholder="Your spicey comment"
                        label="Comment"
                        { ...form.getInputProps("body") }
                    />

                    <Group position="right" mt="md">
                        <Button loading={ isLoading } type="submit">
                            { parentId ? "Post reply" : "Post comment" }
                        </Button>
                    </Group>
                </form>
            </Box>
        </>
    )
}
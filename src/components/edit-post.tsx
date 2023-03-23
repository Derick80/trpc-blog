import { useRouter } from 'next/router'
import React from 'react'
import { api } from '~/utils/api'
import { postSchema } from './create-post'


export default function UpdatePost(){
    const router = useRouter()
 const [title, setTitle] = React.useState<string>("")
    const [content, setContent] = React.useState('')
    const [slug, setSlug] = React.useState('')
    const [postId, setPostId] = React.useState('')
    const [error, setError] = React.useState<string | null>(null)

    const {mutateAsync, isLoading} = api.post.updatePost.useMutation()


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(
            e.currentTarget as HTMLFormElement
        ).entries()
        console.log(formData);

        const data = { title, content, slug, postId }
        try {
            await postSchema.parseAsync(data)
        } catch (error) {
            setError(error.message)
            return

        }
        await mutateAsync(data)
        isLoading ? null : await router.push('/posts')

    }

    return(
        <>

        </>
    )
}
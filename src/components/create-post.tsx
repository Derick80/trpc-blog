import React from 'react'
import { object,string } from 'zod'
import { api } from '~/utils/api'

const postSchema = object({
    title: string().min(10).max(100),
    content: string().min(10).max(1000)

})

export default function CreatePost(){

    const [title, setTitle] = React.useState<string>("")
    const [content, setContent] = React.useState('')
    const [error, setError] = React.useState<string | null>(null)

    const {mutateAsync} = api.post.new.useMutation(

    )


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = { title, content }
    try {
        await postSchema.parseAsync(data)
    } catch (error) {
        setError(error.message)
        return
    }
    await mutateAsync(data)
    }




    return(
        <>
        {error && JSON.stringify(error)}
        <form
        onSubmit={handleSubmit}
        >
        <textarea
        onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
        onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Submit</button>
        </form>
        </>
    )
}
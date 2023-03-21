import { TextInput } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'
import { postSchema } from '~/components/create-post'
import { api } from '~/utils/api'


export default function PostIdPage(){
    const [editing, setEditing] = React.useState(false)

    // define router and get postId from query
    const router = useRouter()
    const { postId } = router.query as { postId: string }



const { data, isLoading } = api.post.getSingle.useQuery({postId})


    const [title, setTitle] = React.useState<string>(data?.title || '')

    const [content, setContent] = React.useState<string>(data?.content || '')
    const [error, setError] = React.useState<string | null>(null)

    const { mutateAsync } = api.post.updatePost.useMutation()

    const { mutateAsync: deletePost,

    } = api.post.deletePost.useMutation()
if(isLoading) return <p>Loading...</p>





async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(
        e.currentTarget as HTMLFormElement
    ).entries()
    console.log(formData);

    const data = { title, content, postId }
    try {
        await postSchema.parseAsync(data)
    } catch (error) {
        setError(error.message)
        return
    }
    await mutateAsync(data)
    }

const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const data = { postId }
    await deletePost(data)

}



return (

    <>
   {
    data && (
        <article className="bg-white rounded-lg shadow-lg p-4 mb-4 flex flex-col">

            {editing ? (

                <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                            <TextInput type="text" defaultValue={ data.title }
                            onChange={(e) => setTitle(e.target.value)}
                            />
                            <label htmlFor="content">Content</label>
                            <TextInput type="text" defaultValue={ data.content }
                                onChange={ (e) => setContent(e.target.value) }
                            />
                            <button type="submit">Submit</button>
                </form>
            ) : (
                            <><p className="text-gray-500">{ data.title }</p><p className="text-gray-500">{ data.content }</p></>

            )}

          {
            !editing && (
                            <button onClick={ () => setEditing(!editing) }>
                                edit
                            </button>
            )
          }
            <button
                onClick={handleDelete}

            >
                Delete
            </button>



        </article>
    )

   }


</>
    )
}

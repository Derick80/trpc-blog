import { useForm } from 'react-hook-form'
import CreatePost from '~/components/create-post'
import { CreatePostInput } from '~/schema/post.schema'
import { api } from '~/utils/api'


export default function NewPostPage(){


    return (
        <>
        <CreatePost />
        </>
    )
}
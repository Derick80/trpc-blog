import React, { ChangeEvent } from 'react'
import { api } from '~/utils/api'


 function Image({url, id}: {
    url: string,
    id: string

}){



    return(
        <>

<div>

    <img
        className='w-64 object-cover'
    src={url} alt="" />

</div>
        </>
    )
}






async function uploadToS3(e:ChangeEvent<HTMLFormElement>){
    const formData = new FormData(e.target)
    const file =formData.get('file') as string
    if (!file) return null


    const {data: {url, key}} = await S3.createPresigned

}

export default function Upload(){

    const handleSubmit = async (e:ChangeEvent<HTMLFormElement>) => {

        e.preventDefault()

        const Key = await uploadToS3(e)
    }


    return(
        <>
            <form onSubmit={ handleSubmit }>
            <input type="file"
                accept='image/*'
            name='file'
            multiple />

        </form>
        {


        }
        </>

    )

}

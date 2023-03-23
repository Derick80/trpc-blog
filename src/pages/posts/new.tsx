import CreatePost from '~/components/create-post'
import { StandardDropzone } from '~/components/standard-dropzone'
import { RouterOutputs } from '~/utils/api'

// Lists the objects that have been uploaded to S3
const UploadedObjects = ({
    objects,
}: {
    objects: RouterOutputs["s3"]["getObjects"]
}) => {
    if (!objects || objects.length === 0)
        return <div>No objects uploaded yet.</div>

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Uploaded Objects</h2>
            { objects.map((object) => (
                <div key={ object.Key }>
                    <a
                        href={ `https://remix-bucket.s3.us-east-2.amazonaws.com//${object.Key as string
                            }` }
                        target="_blank"
                        rel="noreferrer"
                    >
                        { object.Key }
                    </a>
                </div>
            )) }
        </div>
    )
}
export default function NewPostPage(){


    return (
        <>
        <CreatePost />
        </>
    )
}
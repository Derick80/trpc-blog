import { Avatar, Box, Paper, Group, Text, Button } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'
import { CommentWithChildren } from '~/server/api/trpc'
import { api } from '~/utils/api'
import CommentForm from './comment-form'
function getReplyCountText (count: number) {
    if (count === 0) {
        return "No replies"
    }

    if (count === 1) {
        return "1 reply"
    }

    return `${count} replies`
}



function CommentActions({commentId, replyCount}:{
    commentId: string
    replyCount: number
}){
const [replying, setReplying] = React.useState(false)

return <>
    <Group
    position='apart'
    mt='md'
    >
        <Text>
            {getReplyCountText(replyCount)}
        </Text>
        <Button
            onClick={ () => setReplying(!replying) }
            variant='outline'
        >
            Reply
        </Button>
    </Group>
    {
        replying && <CommentForm parentId={ commentId } />

    }

</>
}

function Comment({comment}:{
   comment: CommentWithChildren

})

{
return <Paper
withBorder
radius='md'
p='md'
mb='md'
>
    <Box
    sx={

        ()=> ({
            display:'flex',

        })
    }
    >
        <Avatar />
        <Box
        pl='md'
        sx={()=> ({
            display: 'flex',
            flexDirection: 'column',
        })}
        >
            <Group >
                <Text>{comment.user.username}</Text>
                <Text>{comment.createdAt.toISOString()}</Text>

            </Group>
            list here
            {comment.body}
            </Box>
    </Box>
    <CommentActions
        commentId={comment.id}
        replyCount={0}
    />
{comment.children && comment.children.length > 0 && (
    <ListComments comments={comment.children} />

)}
</Paper>
}

// Render out all comments
export default function ListComments({comments}:{
    comments: CommentWithChildren[]
}){

    return (
        <Box>
{
    comments.map((comment) =>{
        return <Comment
        key={comment.id}
        comment={comment} />

    })

}
        </Box>
    )
}
import { Container, Group, Text, Title } from '@mantine/core'


export type PostProps ={
   post:{
        id: string
        title: string
        slug: string
        content: string
        createdAt: Date
        updatedAt: Date

   }
}
export default function PostCard({post}:PostProps){



    return (
       <>
            <Container key={ post.id } size="md">
                <Title order={ 3 }>{ post.title }</Title>

                <Text>{ post.content }</Text>

                <Group position="right">
                    <Text>{ post.createdAt.toISOString() }</Text>
                </Group>

            </Container>
            </>
    )
}
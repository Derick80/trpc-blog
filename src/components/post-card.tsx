import { Avatar, Card, Container, Divider, Flex, Group, Text, Title, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import Link from 'next/link'


export type PostProps ={
   post:{
        id: string
        title: string
        slug: string
        content: string
        createdAt: Date
        updatedAt: Date
        author:{
            id: string
            name: string
            image: string
            email: string
        }

   }
}
export default function PostCard({post}:PostProps){



    return (
       <>
            <Card key={ post.id }
            shadow="md"
            padding="xl"
            radius="xl"
            className='mb-10'
            withBorder

            >
                <Link
                    href={ `/posts/${ post.id }` }
                    passHref
                >
                    <Title>
                        { post.title }
                    </Title>
                </Link>


              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              <Divider />
                <Group position="left">

                                    </Group>
                <Group position="right">
                   <Flex align="center"
                    direction="column"
                   >
                      <Text>Posted by:</Text>
                       <Flex align="center"

                        direction="row"
                        > <Tooltip label={ post.author.name }>
                                { post.author.image && <Avatar
                                    size="sm"
                                    radius="xl"

                                    src={ post.author.image } alt={ post.author.email } />
                                }
                            </Tooltip>
                            <Text>{ dayjs(post.createdAt).format("MMM D") }</Text>
                            </Flex>
                    </Flex>
                </Group>

            </Card>
            </>
    )
}
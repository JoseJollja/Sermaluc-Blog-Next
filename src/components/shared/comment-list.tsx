import { useGetAllCommentsQuery } from '@/hooks/queries/comment/use-get-all-comments-query'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'

const CommentList = () => {
  const params = useParams()
  const { data } = useGetAllCommentsQuery({
    params: {
      filters: { articleId: params?.id as string }
    }
  })

  return (
    <ul className="mt-6">
      {data?.ok &&
        data.data.toReversed().map((comment) => (
          <li
            key={comment.id}
            className="border-b border-border py-3 last:border-b-0"
          >
            <p className="font-semibold">
              {comment.user?.name} {comment.user?.lastname}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              {dayjs(comment.createdAt).fromNow()}
            </p>

            <p className="font-light">{comment.content}</p>
          </li>
        ))}
    </ul>
  )
}

export default CommentList

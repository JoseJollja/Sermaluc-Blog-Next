import { QueryClient, dehydrate } from '@tanstack/react-query'

import { meQuery } from '@/api/auth/me.query'
import { getArticleByIDQuery } from '@/api/article/get-article-by-id.query'

import type { GetServerSideProps } from 'next'
import { useGetArticleByIDQuery } from '@/hooks/queries/articles/use-get-article-by-id-query'
import Image from 'next/image'
import dayjs from 'dayjs'
import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import CommentForm from '@/components/shared/comment-form'
import CommentList from '@/components/shared/comment-list'
import { Seo } from '@/components/shared/seo'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient()
  const token = ctx.req.cookies?.token

  if (token) {
    await queryClient.prefetchQuery({
      queryKey: ['me'],
      queryFn: () => {
        return meQuery({
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    })
  }

  const res = await getArticleByIDQuery({ id: ctx.params?.id as string })

  if (!res.ok) {
    return { notFound: true }
  }

  await queryClient.prefetchQuery({
    queryKey: ['article', ctx.params?.id],
    queryFn: () => res
  })

  return {
    props: {
      articleId: ctx.params?.id,
      dehydratedState: dehydrate(queryClient)
    }
  }
}

const ArticleByIDPage = ({ articleId }: { articleId: string }) => {
  const isAuth = useAuthStore((state) => state.isAuth)
  const { data } = useGetArticleByIDQuery({
    id: articleId
  })

  const article = (data?.ok && data.data) || null

  return (
    <>
      <Seo title={article?.title + ' | Blog'} />

      <div className="flex-1 w-[90vw] max-w-3xl mx-auto py-24">
        <div className="relative w-full aspect-video mb-10 rounded overflow-hidden">
          <Image
            fill
            priority
            alt="blog"
            src={'/uploads/' + article?.photo?.filename}
            className="w-full object-cover object-center"
          />
        </div>

        <h2 className="text-xl font-semibold text-muted-foreground">
          {article?.user?.name} {article?.user?.lastname}
        </h2>
        <h1 className="text-4xl font-bold tracking-wide mb-6">
          {article?.title}
        </h1>

        <span className="text-sm text-muted-foreground">
          Actualizado {dayjs(article?.updatedAt).format('DD/MM/YYYY hh:mm:ss')}
        </span>

        <p className="mb-6">{article?.content}</p>

        <div className="flex items-center mb-6">
          <button className="p-1">
            <FacebookIcon size={18} />
          </button>
          <button className="p-1">
            <InstagramIcon size={18} />
          </button>
          <button className="p-1">
            <TwitterIcon size={18} />
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-3">Comentarios</h3>
        {isAuth && <CommentForm />}
        <CommentList />
      </div>
    </>
  )
}

export default ArticleByIDPage

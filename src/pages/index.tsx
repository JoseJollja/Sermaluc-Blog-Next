import Link from 'next/link'
import Image from 'next/image'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import {
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  ArrowRightIcon
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'

import { meQuery } from '@/api/auth/me.query'
import { getAllArticlesQuery } from '@/api/article/get-all-articles.query'

import type { GetServerSideProps } from 'next'
import { useGetAllArticlesQuery } from '@/hooks/queries/articles/use-get-all-articles-query'
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

  await queryClient.prefetchQuery({
    queryKey: ['articles'],
    queryFn: getAllArticlesQuery
  })

  return {
    props: { dehydratedState: dehydrate(queryClient) }
  }
}

export default function Home() {
  const { data } = useGetAllArticlesQuery()

  return (
    <>
      <Seo title="Home | Blog" />
      <div className="container py-24 flex-1">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data?.ok &&
            data.data.map((article) => {
              return (
                <li key={article.id}>
                  <Card className="w-full max-w-[388px] overflow-hidden">
                    <div className="relative w-full aspect-video">
                      <Image
                        fill
                        priority
                        alt="blog"
                        src="https://dummyimage.com/720x400"
                        className="lg:h-48 md:h-36 w-full object-cover object-center"
                      />
                    </div>

                    <CardHeader>
                      <CardDescription>
                        {article.user.name} {article.user.lastname}
                      </CardDescription>
                      <Link href={`/articles/${article.id}`}>
                        <CardTitle className="hover:underline">
                          {article.title}
                        </CardTitle>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 overflow-hidden text-sm">
                        {article.content}
                      </p>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Link
                        href={`/articles/${article.id}`}
                        className={buttonVariants({ variant: 'link' })}
                      >
                        Ver mas
                        <ArrowRightIcon className="ml-2" size={18} />
                      </Link>

                      <div className="flex items-center">
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
                    </CardFooter>
                  </Card>
                </li>
              )
            })}
        </ul>
      </div>
    </>
  )
}

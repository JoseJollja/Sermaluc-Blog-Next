import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Navbar from '@/components/layout/navbar'
import {
  getAllArticlesQuery,
  type GetAllArticlesResponseData
} from '@/api/article/get-all-articles.query'

import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import {
  ArrowRightIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterIcon
} from 'lucide-react'
import Footer from '@/components/layout/footer'

type SSRProps = GetServerSideProps<{ articles: GetAllArticlesResponseData[] }>

export const getServerSideProps: SSRProps = async (ctx) => {
  try {
    const res = await getAllArticlesQuery()

    if (res.status === 200 && res.data.ok) {
      return { props: { articles: res.data.data } }
    }

    return { props: { articles: [] } }
  } catch (error) {
    console.log({ error })
    return { props: { articles: [] } }
  }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Home(props: Props) {
  return (
    <>
      <Navbar />
      <div className="container py-24 flex-1">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {props.articles.map((article) => {
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
      <Footer />
    </>
  )
}

import { QueryClient, dehydrate, useQueryClient } from '@tanstack/react-query'

import { meQuery } from '@/api/auth/me.query'

import type { GetServerSideProps } from 'next'
import Sidebar from '@/components/layout/sidebar'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useGetAllArticlesQuery } from '@/hooks/queries/articles/use-get-all-articles-query'
import { useAuthStore } from '@/stores/auth.store'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import { Edit2Icon, MoreHorizontal, Trash2Icon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import BasicAlert from '@/components/ui/basic-alert'
import useToggle from '@/hooks/use-toggle'
import { useMemo, useState } from 'react'
import { useDeleteArticleMutation } from '@/hooks/mutations/article/use-delete-article-mutation'
import { BasicModal } from '@/components/ui/basic-modal'
import ModalArticleForm from '@/components/shared/modal-article-form'
import { Seo } from '@/components/shared/seo'
import { useMeQuery } from '@/hooks/queries/auth/use-me-query'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient()
  const token = ctx.req.cookies?.token

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const res = await meQuery({
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  await queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: () => res
  })

  return {
    props: { dehydratedState: dehydrate(queryClient) }
  }
}

const DashboardPage = () => {
  const toggleModal = useToggle()
  const toggleAlert = useToggle()
  const client = useQueryClient()
  const [articleId, setArticleId] = useState<string | null>(null)

  const meQuery = useMeQuery()
  const user = (meQuery.data?.ok && meQuery.data?.data) || null

  const deleteMutation = useDeleteArticleMutation()
  const { data, isLoading, refetch } = useGetAllArticlesQuery({
    params: { filters: { userId: user?.id } }
  })

  const handleDeleteArticle = () => {
    if (!articleId) return

    deleteMutation.mutate(articleId, {
      onSuccess: () => {
        refetch()
        toggleAlert.onClose()
        client.invalidateQueries({ queryKey: ['articles'] })
      },
      onError: () => {
        toggleAlert.onClose()
      }
    })
  }

  const selectedArticle = useMemo(() => {
    return data?.ok
      ? data.data.find((article) => article.id === articleId) ?? null
      : null
  }, [data?.ok && data.data, articleId])

  return (
    <>
      <Seo title={`${user?.name} ${user?.lastname} | Blog`} />
      <div className="flex-1 grid sm:grid-rows-1 sm:grid-cols-[minmax(0px,_218px)_minmax(0px,_1fr)]">
        <Sidebar
          onAddArticle={() => {
            setArticleId(null)
            toggleModal.onOpen()
          }}
        />

        <div>
          {!isLoading && data?.ok && (
            <Table>
              <TableCaption>Lista de artículos recientes.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead className="w-[384px]">Contenido</TableHead>
                  <TableHead className="text-center">
                    Fecha de creación
                  </TableHead>
                  <TableHead className="text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-1 overflow-hidden">
                        {article.content}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      {dayjs(article.createdAt).format('DD-MM-YYYY hh:mm:ss')}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setArticleId(article.id)
                              toggleModal.onOpen()
                            }}
                          >
                            <Edit2Icon size={16} className="mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setArticleId(article.id)
                              toggleAlert.onOpen()
                            }}
                          >
                            <Trash2Icon size={16} className="mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <BasicAlert
        isOpen={toggleAlert.isOpen}
        onClose={() => {
          setArticleId(null)
          toggleAlert.onClose()
        }}
        isLoading={deleteMutation.isPending}
        title="¿Estas completamente seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo seleccionado."
        onCancel={() => {
          setArticleId(null)
          toggleAlert.onClose()
        }}
        onConfirm={handleDeleteArticle}
      />

      <ModalArticleForm
        isOpen={toggleModal.isOpen}
        selectedArticle={selectedArticle}
        onOpenChange={toggleModal.onToggle}
        onClose={() => {
          setArticleId(null)
          toggleModal.onClose()
        }}
      />
    </>
  )
}

export default DashboardPage

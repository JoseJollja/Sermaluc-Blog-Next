import z from 'zod'
import { Loader } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '../ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BasicModal } from '@/components/ui/basic-modal'

import { useCreateArticleMutation } from '@/hooks/mutations/article/use-create-article-mutation'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { GetAllArticlesResponseData } from '@/api/article/get-all-articles.query'
import { useUpdateArticleMutation } from '@/hooks/mutations/article/use-update-article-mutation'

type Props = {
  isOpen: boolean
  selectedArticle: GetAllArticlesResponseData | null
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  title: z.string().min(6),
  content: z.string().min(6)
})

type FormValues = z.infer<typeof formSchema>

const ModalArticleForm = (props: Props) => {
  const client = useQueryClient()
  const createMutation = useCreateArticleMutation()
  const updateMutation = useUpdateArticleMutation()

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: ''
    }
  })

  const isEdit = Boolean(props.selectedArticle)

  useEffect(() => {
    if (props.selectedArticle) {
      form.reset({
        title: props.selectedArticle.title,
        content: props.selectedArticle.content
      })
    } else {
      form.reset({
        title: '',
        content: ''
      })
    }
  }, [props.selectedArticle])

  const onSubmit = async (values: FormValues) => {
    if (isEdit) {
      updateMutation.mutate(
        {
          id: props.selectedArticle?.id!,
          body: {
            title: values.title,
            content: values.content
          }
        },
        {
          onSuccess: () => {
            form.reset()
            props.onOpenChange(false)
            client.invalidateQueries({ queryKey: ['articles'] })
          },
          onError: (error) => {
            console.log(error)
          }
        }
      )
      return
    }

    createMutation.mutate(
      {
        body: {
          title: values.title,
          content: values.content
        }
      },
      {
        onSuccess: () => {
          client.invalidateQueries({ queryKey: ['articles'] })
          form.reset()
          props.onOpenChange(false)
        },
        onError: (error) => {
          console.log(error)
        }
      }
    )
  }

  return (
    <BasicModal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      title="Nuevo Articulo"
      className="w-[90vw] max-w-md"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3 mb-8">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el título" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ingresa el contenido" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className="w-full"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {(createMutation.isPending || updateMutation.isPending) && (
              <Loader className="animate-spin mr-3" />
            )}
            {isEdit ? 'Editar' : 'Agregar'}
          </Button>
        </form>
      </Form>
    </BasicModal>
  )
}

export default ModalArticleForm

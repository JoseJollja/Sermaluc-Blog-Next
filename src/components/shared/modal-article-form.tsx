import z from 'zod'
import Cookies from 'js-cookie'
import { Loader, PlusIcon } from 'lucide-react'
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
import { useEffect, useState } from 'react'
import { GetAllArticlesResponseData } from '@/api/article/get-all-articles.query'
import { useUpdateArticleMutation } from '@/hooks/mutations/article/use-update-article-mutation'
import UploadFiles, { FileToUpload } from './upload-files'
import useToggle from '@/hooks/use-toggle'
import { IUpload } from '@/interface/upload'
import { createUploadMutation } from '@/api/upload/create-upload.mutation'
import { toast } from 'react-toastify'
import Image from 'next/image'

type Props = {
  isOpen: boolean
  selectedArticle: GetAllArticlesResponseData | null
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

const formSchema = z.object({
  title: z.string().min(6),
  content: z.string().min(6),
  photoId: z.string().min(1)
})

type FormValues = z.infer<typeof formSchema>

const ModalArticleForm = (props: Props) => {
  const client = useQueryClient()
  const toggleUpload = useToggle()
  const createMutation = useCreateArticleMutation()
  const updateMutation = useUpdateArticleMutation()

  const [files, setFiles] = useState<FileToUpload[]>([])
  const [photo, setPhoto] = useState<IUpload | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)

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
      setPhoto(props.selectedArticle?.photo ?? null)
      form.reset({
        title: props.selectedArticle.title,
        content: props.selectedArticle.content,
        photoId: props.selectedArticle.photoId
      })
    } else {
      setPhoto(null)
      form.reset({
        title: '',
        content: '',
        photoId: ''
      })
    }
  }, [props.selectedArticle === null])

  const onSubmit = async (values: FormValues) => {
    if (isEdit) {
      updateMutation.mutate(
        {
          id: props.selectedArticle?.id!,
          body: {
            title: values.title,
            content: values.content,
            photoId: values.photoId
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
          content: values.content,
          photoId: values.photoId
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

  const handleUploadFile = async () => {
    setUploadLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', files[0].file)

      const res = await createUploadMutation({
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + Cookies.get('x-token')
        }
      })

      if (!res.ok) {
        console.log('[ERROR_UPLOAD_FILE]')
        return false
      }

      setPhoto(res.data)
      form.setValue('photoId', res.data.id)
      toast.success('Foto subida correctamente')

      toggleUpload.onClose()
      props.onOpenChange(true)

      return true
    } catch (error) {
      console.log('[ERROR_UPLOAD_FILE]')
      return false
    } finally {
      setUploadLoading(false)
    }
  }

  return (
    <>
      <BasicModal
        title="Subir foto"
        description="Sube una foto de para tu articulo"
        isOpen={toggleUpload.isOpen}
        onOpenChange={toggleUpload.onToggle}
        className="w-[90vw] max-w-4xl"
      >
        <UploadFiles
          multiple={false}
          values={files}
          isLoading={uploadLoading}
          onUpload={handleUploadFile}
          onChangeFiles={(files) => setFiles(files)}
          className="w-full h-auto aspect-video"
        />
      </BasicModal>

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
                  <FormItem className="flex flex-col">
                    <FormLabel>Foto</FormLabel>
                    <FormControl>
                      <button
                        type="button"
                        className="w-full aspect-video border rounded grid place-items-center relative overflow-hidden"
                        onClick={() => {
                          props.onOpenChange(false)
                          toggleUpload.onOpen()
                        }}
                      >
                        {photo === null && <PlusIcon />}
                        {photo !== null && (
                          <Image
                            fill
                            alt=""
                            src={'/uploads/' + photo.filename}
                            className="object-cover w-full h-full"
                            sizes="(max-width: 710px) 280px, (max-width: 991px) 300px, 400px"
                          />
                        )}
                      </button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
    </>
  )
}

export default ModalArticleForm

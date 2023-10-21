import React from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateCommentMutationVariables,
  createCommentMutation
} from '@/api/comment/create-comment.mutation'
import { useParams } from 'next/navigation'

const formSchema = z.object({
  comment: z.string().min(3, 'El comentario debe tener al menos 3 caracteres')
})

type FormValues = z.infer<typeof formSchema>

const CommentForm = () => {
  const params = useParams()
  const client = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationKey: ['create:comment'],
    mutationFn: (args: CreateCommentMutationVariables) => {
      return createCommentMutation({ body: args })
    }
  })

  const form = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { comment: '' },
    resolver: zodResolver(formSchema)
  })

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        content: values.comment,
        articleId: params?.id as string
      },
      {
        onSuccess: () => {
          form.reset()
          client.invalidateQueries({
            queryKey: ['comments']
          })
        },
        onError: () => {
          console.log('error')
        }
      }
    )
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <FormField
            name="comment"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="sr-only">Nuevo comentario</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ingresa tu comentario" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="ml-auto" disabled={isPending}>
            {isPending && <Loader2 className="mr-2" />}
            Enviar
          </Button>
        </form>
      </Form>
    </>
  )
}

export default CommentForm

import z from 'zod'
import Cookies from 'js-cookie'
import { Loader } from 'lucide-react'
import { toast } from 'react-toastify'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { BasicModal } from '@/components/ui/basic-modal'

import { useAuthStore } from '@/stores/auth.store'
import { useLoginMutation } from '@/hooks/mutations/auth/use-login-mutation'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type FormValues = z.infer<typeof formSchema>

const ModalLoginForm = (props: Props) => {
  const auth = useAuthStore()
  const { mutate, isPending } = useLoginMutation()

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: FormValues) => {
    mutate(values, {
      onSuccess: (data) => {
        if (!data.ok) {
          console.log('[ERROR_LOGIN]: ', data.errors)
          return
        }

        form.reset()
        auth.loginAction(data.data.user)
        Cookies.set('token', data.data.token)
        toast.info(`Bienvenido ${data.data.user.name} 👋`)

        props.onOpenChange(false)
      },
      onError: (error) => {
        if (error.response?.data?.errors) {
          const errors: Record<string, string> = {}

          error.response?.data?.errors?.forEach((err) => {
            errors[err.field] = err.message
          })

          if (errors.credentials) {
            toast.warning('Credeniales incorrectas')
          }

          return
        }

        console.log('[ERROR_LOGIN]: ', error)
      }
    })
  }

  return (
    <BasicModal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      title="Iniciar sesión"
      className="w-[90vw] max-w-sm"
      description="Ingresa tu correo para iniciar sesión a tu cuenta"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3 mb-8">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa tu correo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Label className="flex items-center gap-x-2 mb-8">
            <Checkbox />
            <span>Recordarme</span>
          </Label>

          <Button className="w-full" disabled={isPending}>
            {isPending && <Loader className="animate-spin mr-3" />}
            Ingresar
          </Button>
        </form>
      </Form>
    </BasicModal>
  )
}

export default ModalLoginForm

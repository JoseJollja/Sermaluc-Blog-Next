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
import { useRegisterMutation } from '@/hooks/mutations/auth/use-register-mutation'
import { UserRole, UserStatus } from '@/interface/user'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const formSchema = z
  .object({
    name: z.string().min(3, { message: 'El nombre es requerido' }),
    email: z.string().email({ message: 'El correo no es válido' }),
    lastname: z.string().min(3, { message: 'El apellido es requerido' }),
    password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
    rol: z.enum([UserRole.ADMIN, UserRole.USER]),
    status: z.enum([UserStatus.ACTIVO, UserStatus.INACTIVO])
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Las contraseñas no coinciden'
      })
    }
  })

type FormValues = z.infer<typeof formSchema>

const ModalRegisterForm = (props: Props) => {
  const auth = useAuthStore()
  const { mutate, isPending } = useRegisterMutation()

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      lastname: '',
      password: '',
      confirmPassword: '',
      rol: UserRole.USER,
      status: UserStatus.ACTIVO
    }
  })

  const onSubmit = async ({ confirmPassword, ...args }: FormValues) => {
    mutate(args, {
      onSuccess: (data) => {
        if (!data.ok) {
          console.log('[ERROR_REGISTER]: ', data.errors)
          return
        }

        form.reset()
        auth.loginAction(data.data.user)
        Cookies.set('token', data.data.token)
        toast.info(`Bienvenido ${data.data.user.name} 👋`)

        props.onOpenChange(false)
      },
      onError: (error) => {
        console.log('[ERROR_LOGIN]: ', error)
      }
    })
  }

  return (
    <BasicModal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      title="Registrarse"
      className="w-[90vw] max-w-sm"
      description="Ingresa tu correo para crear tu cuenta"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3 mb-8">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa tu apellido" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
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

          <Button className="w-full" disabled={isPending}>
            {isPending && <Loader className="animate-spin mr-3" />}
            Registrarse
          </Button>
        </form>
      </Form>
    </BasicModal>
  )
}

export default ModalRegisterForm

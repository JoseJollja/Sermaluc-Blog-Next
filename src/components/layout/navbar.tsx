import React from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import {
  UserIcon,
  LogOutIcon,
  HexagonIcon,
  LayoutDashboardIcon
} from 'lucide-react'
import { Button } from '../ui/button'
import useToggle from '@/hooks/use-toggle'
import { useAuthStore } from '@/stores/auth.store'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu'
import ModalLoginForm from '../shared/modal-login-form'
import ModalRegisterForm from '../shared/modal-register-form'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'

type Props = {}

const Navbar = (props: Props) => {
  const auth = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const toggleLogin = useToggle()
  const toggleRegister = useToggle()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex p-5 items-center justify-between">
          <Link href="/" className="flex font-medium items-center mb-4 md:mb-0">
            <HexagonIcon />
            <span className="ml-3 text-xl">Blog</span>
          </Link>

          <div className="h-10">
            {!auth.isLoading && (
              <>
                {!auth.isAuth && (
                  <div className="space-x-4">
                    <Button variant="outline" onClick={toggleRegister.onOpen}>
                      Registrarse
                    </Button>
                    <Button onClick={toggleLogin.onOpen}>Iniciar sesión</Button>
                  </div>
                )}

                {auth.isAuth && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline">
                        <UserIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard">
                            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => {
                            Cookies.remove('token')
                            auth.logoutAction()
                            if (pathname === '/dashboard') router.replace('/')
                          }}
                        >
                          <LogOutIcon className="mr-2 h-4 w-4" />
                          <span>Cerrar sesión</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {!auth.isAuth && (
        <ModalLoginForm
          isOpen={toggleLogin.isOpen}
          onOpenChange={toggleLogin.onToggle}
        />
      )}

      {!auth.isAuth && (
        <ModalRegisterForm
          isOpen={toggleRegister.isOpen}
          onOpenChange={toggleRegister.onToggle}
        />
      )}
    </>
  )
}

export default Navbar

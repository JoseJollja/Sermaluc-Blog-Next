import React from 'react'
import Link from 'next/link'
import {
  HexagonIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UserIcon
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

type Props = {}

const Navbar = (props: Props) => {
  const toggle = useToggle()
  const auth = useAuthStore()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex p-5 items-center justify-between">
          <Link href="/" className="flex font-medium items-center mb-4 md:mb-0">
            <HexagonIcon />
            <span className="ml-3 text-xl">Blog</span>
          </Link>

          {!auth.isAuth && (
            <Button onClick={toggle.onOpen}>Iniciar sesión</Button>
          )}

          {auth.isAuth && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
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
                  <DropdownMenuItem onClick={auth.logoutAction}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {!auth.isAuth && (
        <ModalLoginForm isOpen={toggle.isOpen} onOpenChange={toggle.onToggle} />
      )}
    </>
  )
}

export default Navbar

import { HomeIcon, X, UserCogIcon, NewspaperIcon, PlusIcon } from 'lucide-react'

import { type ReactNode } from 'react'
import { cn } from '@/utils'
import { IconButton } from '../ui/icon-button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarLinkProps {
  to?: string
  label?: string
  icon?: ReactNode
  onClick?: () => void
}

const SidebarLink: React.FC<SidebarLinkProps> = (props) => {
  const pathname = usePathname()
  const defaultClass =
    'flex items-center gap-3 py-2 px-4 transition-colors duration-300 hover:text-foreground hover:bg-muted rounded-md'

  if (!props.to) {
    return (
      <button
        onClick={props.onClick}
        className={cn(defaultClass, 'text-muted-foreground')}
      >
        {props.icon}
        {props.label}
      </button>
    )
  }

  return (
    <Link
      href={props.to}
      className={cn(defaultClass, {
        'text-foreground bg-muted': pathname === props.to,
        'text-muted-foreground bg-transparent': pathname !== props.to
      })}
    >
      {props.icon}
      <span>{props.label}</span>
    </Link>
  )
}

type SidebarProps = {
  className?: string
  onClose?: () => void
  onAddArticle?: () => void
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <aside
      className={cn(
        'dark flex flex-col flex-1 dark bg-background p-4 relative border-r',
        props.className
      )}
    >
      {props.onClose && (
        <IconButton
          size="sm"
          variant="ghost"
          onClick={props.onClose}
          icon={<X color="white" />}
        />
      )}

      <nav className="flex flex-col gap-y-2">
        <SidebarLink
          to="/dashboard"
          label="Artículos"
          icon={<NewspaperIcon size={16} />}
        />
        <SidebarLink
          label="Nuevo artículo"
          icon={<PlusIcon size={16} />}
          onClick={props.onAddArticle}
        />
      </nav>
    </aside>
  )
}

export default Sidebar

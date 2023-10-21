import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Loader2Icon } from 'lucide-react'
import React from 'react'

interface BasicAlertProps {
  title: string
  isOpen: boolean
  description: string
  cancelText?: string
  confirmText?: string
  isLoading?: boolean
  onClose: () => void
  onCancel?: () => void
  onConfirm?: () => void
}

const BasicAlert = (props: BasicAlertProps) => {
  return (
    <AlertDialog open={props.isOpen} onOpenChange={props.onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={props.onCancel}>
            {props.cancelText ?? 'Cancelar'}
          </AlertDialogCancel>
          <AlertDialogAction onClick={props.onConfirm}>
            {props.isLoading && <Loader2Icon className="mr-2" />}
            {props.confirmText ?? 'Continuar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BasicAlert

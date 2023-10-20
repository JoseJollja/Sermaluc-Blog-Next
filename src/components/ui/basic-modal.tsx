import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription
} from '../ui/dialog'

export type BasicModalProps = {
  title?: string
  description?: string
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const BasicModal = (props: BasicModalProps) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent className={props.className}>
        {(props.title || props.description) && (
          <DialogHeader>
            {props.title && <DialogTitle>{props.title}</DialogTitle>}
            {props.description && (
              <DialogDescription>{props.description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {props.children}
        {props.footer && <DialogFooter>{props.footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

export { BasicModal }

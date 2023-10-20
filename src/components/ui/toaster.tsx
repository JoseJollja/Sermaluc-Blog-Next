import React from 'react'
import { ToastContainer } from 'react-toastify'
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from 'lucide-react'
import { cn } from '@/utils'

const contextClass = {
  success: 'bg-green-200 text-black',
  error: 'bg-red-200 text-black',
  info: 'bg-blue-200 text-black',
  warning: 'bg-orange-200 text-black',
  default: 'bg-indigo-200 text-black',
  dark: 'bg-white-200 text-black'
}

const toastIcons = {
  success: <CheckCircle2Icon />,
  error: <AlertCircleIcon className="fill-black stroke-red-200" />,
  warning: <AlertCircleIcon className="fill-black stroke-orange-200" />,
  info: <InfoIcon className="fill-black stroke-blue-200" />,
  default: <CheckCircle2Icon />,
  dark: <CheckCircle2Icon />
}

const Toaster = () => {
  return (
    <ToastContainer
      hideProgressBar
      position="top-center"
      icon={({ type }) => toastIcons[type ?? 'default']}
      toastClassName={(args) => {
        return cn(
          contextClass[args?.type ?? 'default'],
          'relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer'
        )
      }}
    />
  )
}

export default Toaster

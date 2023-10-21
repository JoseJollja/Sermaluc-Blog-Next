import { nanoid } from 'nanoid'
import { DragEvent, useId, useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2Icon, UploadCloudIcon } from 'lucide-react'

import { Button } from '../ui/button'
import { IconButton } from '../ui/icon-button'
import { cn } from '@/utils'

export interface FileToUpload {
  id: string
  file: File
}

export interface UploadFilesError {
  error: string
  type: 'error' | 'warning'
}

interface UploadFilesProps {
  values: FileToUpload[]
  multiple?: boolean
  className?: string
  isLoading?: boolean
  onChangeFiles?: (files: FileToUpload[]) => void
  onUpload?: (files: FileToUpload[]) => Promise<boolean>
}

const fileSizeToMb = (size: number) => {
  const n = size * 0.000001
  return n.toFixed(2)
}

interface DropOrSelectProps {
  inputId: string
}

interface DashboardFilesProps {
  inputId: string
  files?: FileToUpload[]
  onCancel: () => void
  onUpload: () => void
  onDelete: (id: string) => void
}

const OverlayDropFiles = ({ isDragging }: { isDragging?: boolean }) => {
  return (
    <div
      className={cn(
        'inset-0 w-full h-full absolute z-30 bg-opacity-90 dark:bg-opacity-90 bg-gray-400 dark:bg-secondary transition-opacity duration-300',
        {
          'opacity-100 pointer-events-auto': isDragging,
          'opacity-0 pointer-events-none': !isDragging
        }
      )}
    >
      <div className="flex justify-center items-center h-full flex-col">
        <UploadCloudIcon className="w-20 h-w-20 text-foreground mb-3" />
        <p className="font-medium text-3xl text-white">
          Deja caer tus archivos aquí
        </p>
      </div>
    </div>
  )
}

const DropOrSelect = ({ inputId }: DropOrSelectProps) => {
  return (
    <div className="grid place-items-center p-8 w-full h-full border border-dashed">
      <p className="text-center text-base md:text-xl dark:text-white">
        Arrastra tus archivos o{' '}
        <label
          htmlFor={`input-file-${inputId}`}
          className="text-blue-600 hover:underline hover:cursor-pointer"
        >
          selecciona tus archivos
        </label>
      </p>
    </div>
  )
}

const DashboardFileItem = ({
  file,
  isLast,
  onDelete
}: {
  isLast: boolean
  file: FileToUpload
  onDelete: () => void
}) => {
  return (
    <>
      <div
        className={cn(
          'px-3 py-2 border-opacity-20 flex items-center gap-3',
          isLast ? 'border-b border-b-muted' : ''
        )}
      >
        <ImagePlus name="music-note" className="text-xl" />
        <div>
          <p className="text-sm">{file.file.name}</p>
          <p className="text-muted-foreground text-sm">
            {fileSizeToMb(file.file.size)} MB
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <IconButton
            size="sm"
            onClick={onDelete}
            icon={<Trash2Icon size={18} />}
          />
        </div>
      </div>
    </>
  )
}

const DashboardFiles = ({
  files,
  inputId,
  onDelete,
  onCancel,
  onUpload
}: DashboardFilesProps) => {
  const inputFileRef = useRef(document.getElementById(`input-file-${inputId}`))

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-[repeat(2,_minmax(0,_1fr))] md:grid-cols-[repeat(3,_minmax(0,_1fr))] pb-2 gap-3 items-center border-b">
        <div>
          <Button variant="ghost" color="primary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
        <p className="text-center dark:text-white font-medium hidden md:block">
          {files?.length}{' '}
          {files?.length === 1
            ? 'archivo seleccionado'
            : 'archivos seleccionados'}
        </p>
        <div className="flex ml-auto items-center gap-3">
          <Button
            variant="outline"
            onClick={() => inputFileRef.current?.click()}
          >
            Añadir
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto">
        {files &&
          files.map((file, i) => (
            <DashboardFileItem
              key={file.id}
              file={file}
              isLast={i !== files.length - 1}
              onDelete={() => onDelete(file.id)}
            />
          ))}
      </div>

      <div className="flex pt-2 mt-auto border-t ">
        <Button color="primary" onClick={onUpload} className="w-full md:w-max">
          Subir {files?.length} {files?.length === 1 ? 'archivo' : 'archivos'}{' '}
        </Button>
      </div>
    </div>
  )
}

const UploadFiles = ({
  className,
  isLoading,
  multiple,
  values,
  onUpload,
  onChangeFiles
}: UploadFilesProps) => {
  const uid = useId()
  const dragCounterRef = useRef(0)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [isDragging, setIsDragging] = useState(false)

  const handleReset = () => {
    onChangeFiles?.([])
    if (inputFileRef.current) inputFileRef.current.value = ''
  }

  const handleUpload = async () => {
    if (typeof onUpload === 'function') {
      const isSuccess = await onUpload(values)
      if (!isSuccess) return
      handleReset()
    }
  }

  const handleDelete = (id: string) => {
    const newFiles = values.filter(({ id: _id }) => _id !== id)
    if (newFiles.length === 0) handleReset()

    onChangeFiles?.(newFiles)
  }

  const handleAdd = async (files: FileList | null) => {
    if (!files) return

    const newFiles: FileToUpload[] = []

    for (const file of [...Array.from(files)]) {
      const payload: FileToUpload = { id: nanoid(), file }
      if (!multiple) handleReset()
      newFiles.push(payload)
    }

    if (!multiple) {
      onChangeFiles?.(newFiles)
      return
    }

    const _newFiles = [...values, ...newFiles]
    onChangeFiles?.(_newFiles)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e?.dataTransfer?.files && e?.dataTransfer?.files.length > 0) {
      handleAdd(e?.dataTransfer?.files)
      e?.dataTransfer.clearData()
      dragCounterRef.current = 0
    }
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current += 1
    if (e?.dataTransfer?.items && e?.dataTransfer?.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current -= 1
    if (dragCounterRef.current > 0) return
    setIsDragging(false)
  }

  return (
    <div className={cn('flex-1 h-full w-full', className)}>
      <input
        hidden
        multiple={multiple}
        type="file"
        accept="image/*"
        ref={inputFileRef}
        id={`input-file-${uid}`}
        onChange={(e) => {
          const _files = e.target.files
          handleAdd(_files)
        }}
      />
      <div
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragLeave={handleDragLeave}
        onDragEnter={handleDragEnter}
        className="p-2 w-full h-full flex-1 bg-background dark:bg-transparent rounded relative border"
      >
        {isLoading && (
          <div className="grid place-items-center absolute inset-0 w-full h-full bg-background bg-opacity-90 z-40">
            <div className="flex items-center flex-col gap-3">
              <Loader2 className="animate-spin" />
              <p className="font-medium">
                Subiendo archivos por favor espere...
              </p>
            </div>
          </div>
        )}

        {isDragging && <OverlayDropFiles isDragging={isDragging} />}
        {values.length === 0 && <DropOrSelect inputId={uid} />}
        {values.length !== 0 && (
          <DashboardFiles
            inputId={uid}
            files={values}
            onCancel={handleReset}
            onDelete={handleDelete}
            onUpload={handleUpload}
          />
        )}
      </div>
    </div>
  )
}

export default UploadFiles

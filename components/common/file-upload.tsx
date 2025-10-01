'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { File, FileText, Image, Upload, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  className?: string
}

export function FileUpload({
  onFilesSelected,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.png'],
  className
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
    setFiles(newFiles)
    onFilesSelected(newFiles)

    // Simulate upload progress for demo
    acceptedFiles.forEach(file => {
      const fileName = file.name
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
        }
        setUploadProgress(prev => ({ ...prev, [fileName]: progress }))
      }, 200)
    })
  }, [files, maxFiles, onFilesSelected])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    disabled: files.length >= maxFiles
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) {
      return <Image className="h-5 w-5 text-blue-500" aria-label="Image file" />
    }
    if (['pdf'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-red-500" />
    }
    if (['doc', 'docx'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-blue-600" />
    }
    if (['xls', 'xlsx'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-green-600" />
    }

    return <File className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted',
          files.length >= maxFiles && 'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />

        {isDragActive ? (
          <p className="text-primary">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium mb-2">
              {files.length >= maxFiles ? 'Maximum files reached' : 'Drop files here or click to browse'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports {acceptedTypes.join(', ')} up to {formatFileSize(maxSize)} each
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum {maxFiles} files ({files.length}/{maxFiles} used)
            </p>
          </div>
        )}
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-800 mb-2">Some files were rejected:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name}:
                {errors.map(error => (
                  <span key={error.code} className="ml-2">{error.message}</span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Uploaded Files ({files.length})</h4>
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center p-3 bg-gray-50 rounded-lg">
              {getFileIcon(file.name)}

              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>

                {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                  <div className="mt-2">
                    <Progress value={uploadProgress[file.name]} className="h-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(uploadProgress[file.name])}% uploaded
                    </p>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

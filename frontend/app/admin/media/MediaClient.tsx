'use client'

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react'
import axios from '../../lib/axios'

interface UploadedImage {
  url: string
  public_id: string
  name: string
  uploadedAt: string
}

const STORAGE_KEY = 'admin_uploaded_images'

function loadImages(): UploadedImage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UploadedImage[]) : []
  } catch {
    return []
  }
}

function persistImages(images: UploadedImage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
}

export default function MediaClient() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setImages(loadImages())
  }, [])

  const selectFile = (f: File) => {
    setFile(f)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) selectFile(f)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) selectFile(f)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await axios.post('/uploads', formData, {
        params: { folder: 'media' },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const { url, public_id } = res.data as { url: string; public_id: string }
      const newImage: UploadedImage = {
        url,
        public_id,
        name: file.name,
        uploadedAt: new Date().toISOString(),
      }
      setImages((prev) => {
        const updated = [newImage, ...prev]
        persistImages(updated)
        return updated
      })
      clearFile()
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (public_id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.public_id !== public_id)
      persistImages(updated)
      return updated
    })
  }

  const handleCopy = (url: string, public_id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(public_id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Media Library</h1>

      {/* Upload card */}
      <div className="mb-10 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Upload Image
        </h2>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Select image to upload"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors px-6 py-14 ${
            dragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-52 max-w-xs rounded-lg object-contain mb-3"
            />
          ) : (
            <>
              <span className="text-5xl mb-4 select-none">🖼️</span>
              <p className="text-sm text-gray-500 text-center">
                Drag &amp; drop an image here, or{' '}
                <span className="text-blue-600 font-medium">click to browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1.5">
                JPEG · PNG · GIF · WebP · SVG — max 10 MB
              </p>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Selected file row */}
        {file && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-gray-600 truncate flex-1">{file.name}</span>
            <button
              type="button"
              onClick={clearFile}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Uploading…
            </>
          ) : (
            'Upload'
          )}
        </button>
      </div>

      {/* Gallery */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Uploaded Images
          {images.length > 0 && (
            <span className="ml-2 text-gray-400 font-normal normal-case">
              ({images.length})
            </span>
          )}
        </h2>

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 text-gray-400">
            <span className="text-5xl mb-4">📂</span>
            <p className="text-sm">No images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.public_id}
                className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="px-3 py-2">
                  <p
                    className="text-xs text-gray-700 font-medium truncate"
                    title={img.name}
                  >
                    {img.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(img.uploadedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => handleCopy(img.url, img.public_id)}
                    className="w-full px-3 py-1.5 bg-white text-gray-800 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {copiedId === img.public_id ? '✓ Copied!' : 'Copy URL'}
                  </button>
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3 py-1.5 bg-white/20 text-white text-xs font-medium rounded-lg hover:bg-white/30 transition-colors text-center"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemove(img.public_id)}
                    className="w-full px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

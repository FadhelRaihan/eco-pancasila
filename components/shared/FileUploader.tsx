"use client"

import { useState, useCallback } from "react"
import { Upload, File, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  folder: "materi" | "rpp" | "aktivitas" | "proyek" | "avatar"
  onUploadComplete: (url: string) => void
  accept?: string
  className?: string
}

export default function FileUploader({ folder, onUploadComplete, accept, className }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploaded, setUploaded] = useState(false)

  const handleUpload = useCallback(async () => {
    if (!file) return
    setUploading(true)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          folder,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", data.apiKey)
      formData.append("timestamp", String(data.timestamp))
      formData.append("signature", data.signature)
      formData.append("public_id", data.publicId)
      formData.append("folder", `eco-pancasila/${folder}`)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${data.cloudName}/${data.resourceType}/upload`,
        { method: "POST", body: formData }
      )

      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error?.message || "Upload gagal")

      onUploadComplete(uploadData.secure_url || uploadData.url)
      setUploaded(true)
      setFile(null)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }, [file, folder, onUploadComplete])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setUploaded(false)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {uploaded ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
          <Check className="h-5 w-5 text-green-600" />
          <span className="flex-1 text-sm text-green-700">File berhasil diupload</span>
        </div>
      ) : file ? (
        <div className="flex items-center gap-2 rounded-lg border p-3">
          <File className="h-5 w-5 text-green-600" />
          <span className="flex-1 truncate text-sm">{file.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setFile(null)}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:border-green-400 hover:bg-green-50">
          <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Klik untuk upload file</span>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
        </label>
      )}
      {file && !uploaded && (
        <Button onClick={handleUpload} disabled={uploading} className="w-full">
          {uploading ? "Mengupload..." : "Upload ke Cloudinary"}
        </Button>
      )}
    </div>
  )
}

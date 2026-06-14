'use client'
import { useRef } from 'react'
import { ImageIcon, Upload, X, Check } from 'lucide-react'

export type ThumbnailSource =
  | { type: 'frame'; dataUrl: string; time: number }
  | { type: 'upload'; file: File; previewUrl: string }
  | null

interface ThumbnailSelectorProps {
  value: ThumbnailSource
  onChange: (v: ThumbnailSource) => void
  // Captured frames passed from VideoPreview
  capturedFrames?: Array<{ dataUrl: string; time: number }>
}

export function ThumbnailSelector({
  value,
  onChange,
  capturedFrames = [],
}: ThumbnailSelectorProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const previewUrl = URL.createObjectURL(f)
    onChange({ type: 'upload', file: f, previewUrl })
  }

  function clearThumbnail() {
    if (value?.type === 'upload') {
      URL.revokeObjectURL(value.previewUrl)
    }
    onChange(null)
  }

  const previewSrc = value?.type === 'frame'
    ? value.dataUrl
    : value?.type === 'upload'
    ? value.previewUrl
    : null

  return (
    <div className="mb-5">
      <label className="block text-[11px] font-bold tracking-widest
        uppercase text-white/40 mb-2">
        Capa do vídeo
      </label>

      <div className="flex gap-3 items-start">
        {/* Current thumbnail preview */}
        <div className="relative w-24 h-14 rounded-lg overflow-hidden
          bg-white/[0.05] border border-white/[0.08] flex-shrink-0
          flex items-center justify-center">
          {previewSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="Capa"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={clearThumbnail}
                className="absolute top-1 right-1 w-5 h-5
                  bg-black/70 rounded-full flex items-center
                  justify-center hover:bg-black transition z-10"
              >
                <X size={10} color="white" />
              </button>
            </>
          ) : (
            <ImageIcon size={20} color="rgba(255,255,255,0.2)" />
          )}
        </div>

        {/* Options */}
        <div className="flex-1 space-y-2">
          {/* Instruction */}
          <p className="text-xs text-white/30 leading-relaxed">
            Pause o vídeo no frame desejado e clique em
            &quot;Usar como capa&quot;, ou envie uma imagem
            personalizada.
          </p>

          {/* Upload custom image */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2
              text-xs font-semibold px-3 py-1.5
              bg-white/[0.05] border border-white/[0.08]
              rounded-lg text-white/60 hover:text-white
              hover:border-white/20 transition"
          >
            <Upload size={13} />
            Enviar imagem personalizada
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Captured frames strip */}
          {capturedFrames.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {capturedFrames.map((frame, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => onChange({ type: 'frame', ...frame })}
                  className={`relative flex-shrink-0 w-16 h-10
                    rounded overflow-hidden border-2 transition
                    ${value?.type === 'frame' &&
                      value.dataUrl === frame.dataUrl
                      ? 'border-[#00E5A0]'
                      : 'border-transparent hover:border-white/30'
                    }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.dataUrl}
                    alt={`Frame ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {value?.type === 'frame' &&
                    value.dataUrl === frame.dataUrl && (
                    <div className="absolute inset-0 flex
                      items-center justify-center bg-[#00E5A0]/20">
                      <Check size={12} color="#00E5A0" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

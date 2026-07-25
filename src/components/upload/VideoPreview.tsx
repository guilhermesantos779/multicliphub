'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface VideoPreviewProps {
  file: File | null
  objectUrl?: string | null  // if URL is already created upstream
  onFrameCapture?: (dataUrl: string, timeSeconds: number) => void
}

export function VideoPreview({ file, objectUrl, onFrameCapture }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [url, setUrl] = useState<string | null>(null)

  // Create object URL from file
  useEffect(() => {
    if (objectUrl) { setUrl(objectUrl); return }
    if (!file) { setUrl(null); return }
    const u = URL.createObjectURL(file)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [file, objectUrl])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else { void v.play(); setPlaying(true) }
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    setProgress(v.currentTime / (v.duration || 1))
    setCurrentTime(v.currentTime)
  }

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current?.duration ?? 0)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    v.currentTime = ratio * v.duration
    setProgress(ratio)
  }

  // Capture current frame as thumbnail
  const captureFrame = useCallback(() => {
    const v = videoRef.current
    const c = canvasRef.current
    if (!v || !c) return
    c.width = v.videoWidth
    c.height = v.videoHeight
    c.getContext('2d')?.drawImage(v, 0, 0)
    const dataUrl = c.toDataURL('image/jpeg', 0.92)
    onFrameCapture?.(dataUrl, v.currentTime)
  }, [onFrameCapture])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (!url) return null

  return (
    <div className="rounded-2xl overflow-hidden bg-black
      border border-white/[0.08] mb-6">
      {/* Video */}
      <div className="relative group aspect-video bg-black">
        <video
          ref={videoRef}
          src={url}
          muted={muted}
          loop
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setPlaying(false)}
          className="w-full h-full object-contain"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Play/pause overlay */}
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center
            justify-center opacity-0 group-hover:opacity-100
            transition-opacity"
        >
          <div className="w-14 h-14 rounded-full bg-black/60
            backdrop-blur-sm flex items-center justify-center
            border border-white/20">
            {playing
              ? <Pause size={24} color="white" fill="white" />
              : <Play size={24} color="white" fill="white" />
            }
          </div>
        </button>

        {/* Controls bar */}
        <div className="absolute bottom-0 left-0 right-0
          bg-gradient-to-t from-black/80 to-transparent
          px-4 pb-3 pt-8 opacity-0 group-hover:opacity-100
          transition-opacity">

          {/* Progress bar */}
          <div
            className="h-1 bg-white/20 rounded-full mb-3
              cursor-pointer relative"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-[#00E5A0] rounded-full
                pointer-events-none"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button type="button" onClick={togglePlay}>
                {playing
                  ? <Pause size={16} color="white" fill="white" />
                  : <Play size={16} color="white" fill="white" />
                }
              </button>
              <span className="text-xs text-white/60 font-mono">
                {formatTime(currentTime)}
                {' / '}
                {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Capture frame button */}
              {onFrameCapture && (
                <button
                  type="button"
                  onClick={captureFrame}
                  className="text-[11px] font-semibold px-2.5 py-1
                    bg-[#00E5A0]/15 text-[#00E5A0]
                    rounded-lg border border-[#00E5A0]/20
                    hover:bg-[#00E5A0]/25 transition"
                >
                  Usar como capa
                </button>
              )}
              <button type="button" onClick={() => setMuted(!muted)}>
                {muted
                  ? <VolumeX size={16} color="rgba(255,255,255,0.6)" />
                  : <Volume2 size={16} color="rgba(255,255,255,0.6)" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* File info bar */}
      <div className="px-4 py-2.5 flex items-center
        justify-between border-t border-white/[0.06]">
        <span className="text-xs text-white/40 font-medium truncate">
          {file?.name ?? 'Vídeo carregado'}
        </span>
        {file && (
          <span className="text-xs text-white/25 ml-3 flex-shrink-0">
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </span>
        )}
      </div>
    </div>
  )
}

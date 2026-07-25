import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { WebGLShaderLazy } from '@/components/ui/web-gl-shader-lazy'
import { ToastProvider } from '@/components/shared/Toast'
import { Logo } from '@/components/shared/Logo'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen text-white antialiased">
      {/* Brand shader background — identity-card aesthetic */}
      <WebGLShaderLazy speed={0.006} distortion={0.05} yScale={0.55} />

      <div className="relative z-10">
        <ToastProvider>
          {/* Slim top bar — back to the app shell */}
          <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
              <Link href="/dashboard" aria-label="MultiClip Hub">
                <Logo height={26} variant="mint" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-[13px] text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft size={15} />
                Voltar ao painel
              </Link>
            </div>
          </header>

          {children}
        </ToastProvider>
      </div>
    </div>
  )
}

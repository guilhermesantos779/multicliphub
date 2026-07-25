'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface RemovePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
}

export function RemovePostDialog({ open, onOpenChange, onConfirm }: RemovePostDialogProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    if (!reason.trim()) return
    onConfirm(reason.trim())
    setReason('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={next => {
        onOpenChange(next)
        if (!next) setReason('')
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover post da campanha</DialogTitle>
          <DialogDescription>
            O clipper será notificado. Informe o motivo da remoção — esse campo é obrigatório.
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Ex: conteúdo fora das regras da campanha, hashtag ausente, etc."
          rows={3}
          className="w-full resize-none rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2 text-[13px] text-white placeholder-[#444444] outline-none transition-colors focus:border-[#00E5A0]/50"
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!reason.trim()}>
            Remover post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

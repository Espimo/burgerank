'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

interface ProfileSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  userEmail: string
}

export function ProfileSettingsModal({
  open,
  onOpenChange,
  userName,
  userEmail,
}: ProfileSettingsModalProps) {
  const [name, setName] = useState(userName)
  const [isPublic, setIsPublic] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const publicLink = `https://burgerank.com/profile/${name?.toLowerCase().replace(/\s+/g, '_')}`

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // API call aquí
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Configuración guardada correctamente')
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicLink)
      toast.success('Enlace copiado al portapapeles')
    } catch (error) {
      toast.error('Error al copiar')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>⚙️ Configuración</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Nombre</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input 
              id="email" 
              value={userEmail} 
              disabled 
              className="h-9 bg-muted"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <input
              type="checkbox"
              id="public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <Label htmlFor="public" className="cursor-pointer text-sm font-medium mb-0">
              Perfil Público
            </Label>
          </div>

          {isPublic && (
            <div className="p-3 bg-primary/10 rounded-lg space-y-2 border border-primary/20">
              <p className="text-xs font-medium text-muted-foreground">Comparte tu perfil:</p>
              <div className="flex gap-2">
                <Input 
                  value={publicLink} 
                  readOnly 
                  className="text-xs h-9"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={copyToClipboard}
                  className="h-9 px-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-9"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="h-9"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { useState, useCallback, useRef, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

type ExportTask = {
  id: string
  name: string
  action: () => Promise<void> | void
}

export function useExportQueue() {
  const { toast } = useToast()
  const [queue, setQueue] = useState<ExportTask[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const processingRef = useRef(false)

  const processQueue = useCallback(async () => {
    if (processingRef.current || queue.length === 0) return
    processingRef.current = true
    setIsProcessing(true)

    const task = queue[0]

    toast({
      title: 'Processando Documento',
      description: `Iniciando a geração de: ${task.name}...`,
    })

    try {
      // Simulate background processing (e.g., preparing html-to-image or PDF rendering queue)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await task.action()
      toast({
        title: 'Exportação Concluída',
        description: `O arquivo ${task.name} foi gerado com sucesso.`,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro na Exportação',
        description: `Ocorreu um erro ao processar ${task.name}.`,
        variant: 'destructive',
      })
    } finally {
      setQueue((prev) => prev.slice(1))
      processingRef.current = false
      setIsProcessing(false)
    }
  }, [queue, toast])

  useEffect(() => {
    if (queue.length > 0 && !isProcessing) {
      processQueue()
    }
  }, [queue, isProcessing, processQueue])

  const addToQueue = useCallback((name: string, action: () => Promise<void> | void) => {
    setQueue((prev) => [...prev, { id: Math.random().toString(36).substring(7), name, action }])
  }, [])

  return { addToQueue, isProcessing, queueLength: queue.length }
}

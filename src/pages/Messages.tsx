import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, ArrowLeft, Search, MessageSquare, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useApp } from '@/store/AppContext'
import { cn } from '@/lib/utils'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getMarketplaceChats,
  getMarketplaceMessages,
  sendMarketplaceMessage,
} from '@/services/marketplace'

export default function Messages() {
  const { currentUser } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeChatId = searchParams.get('chat')
  const [text, setText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [chats, setChats] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])

  const loadChats = async () => {
    try {
      if (pb.authStore.isValid) {
        const records = await getMarketplaceChats()
        setChats(records)
      }
    } catch (e) {
      console.error('Failed to load chats', e)
    }
  }

  const loadMessages = async () => {
    if (activeChatId && pb.authStore.isValid) {
      try {
        const records = await getMarketplaceMessages(activeChatId)
        setMessages(records)
      } catch (e) {
        console.error('Failed to load messages', e)
      }
    }
  }

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    loadMessages()
  }, [activeChatId])

  useRealtime('chats', () => {
    loadChats()
  })
  useRealtime('messages', (e) => {
    if (e.action === 'create' && e.record.chat_id === activeChatId) {
      setMessages((prev) => [...prev, e.record])
    }
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !activeChatId || !pb.authStore.record?.id) return
    const msgText = text.trim()
    setText('')
    try {
      await sendMarketplaceMessage({
        chat_id: activeChatId,
        sender_id: pb.authStore.record.id,
        content: msgText,
      })
    } catch (e) {
      console.error('Send error', e)
    }
  }

  const setActiveChat = (id: string | null) => {
    if (id) setSearchParams({ chat: id })
    else setSearchParams({})
  }

  if (!currentUser || !pb.authStore.isValid) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
        Faça login para acessar suas mensagens protegidas pelo Marketplace.
      </div>
    )
  }

  const filteredChats = chats.filter((chat) => {
    const otherUser = chat.expand?.participants?.find((p: any) => p.id !== pb.authStore.record?.id)
    const name = otherUser?.name || 'Desconhecido'
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const activeChat = chats.find((c) => c.id === activeChatId)

  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      <div
        className={cn(
          'w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-card/30',
          activeChatId ? 'hidden md:flex' : 'flex',
        )}
      >
        <div className="p-4 border-b border-border space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Mensagens
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              className="pl-9 h-10 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Nenhuma conversa encontrada.
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredChats.map((chat) => {
                const otherUser = chat.expand?.participants?.find(
                  (p: any) => p.id !== pb.authStore.record?.id,
                )
                const name = otherUser?.name || 'Desconhecido'

                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={cn(
                      'flex items-center gap-4 p-4 text-left transition-colors hover:bg-muted border-b border-border/50',
                      activeChatId === chat.id && 'bg-muted',
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary shrink-0 flex items-center justify-center font-bold text-muted-foreground border border-border overflow-hidden">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm truncate text-foreground pr-2">
                          {name}
                        </span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                          {new Date(chat.updated).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.expand?.proposal_id?.description || 'Iniciar conversa'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 bg-background',
          !activeChatId ? 'hidden md:flex' : 'flex',
        )}
      >
        {activeChat ? (
          <>
            <div className="h-16 px-4 border-b border-border flex items-center gap-3 bg-card/50 sticky top-0 z-10 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0 -ml-2"
                onClick={() => setActiveChat(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {(() => {
                const otherUser = activeChat.expand?.participants?.find(
                  (p: any) => p.id !== pb.authStore.record?.id,
                )
                const name = otherUser?.name || 'Desconhecido'
                return (
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-secondary shrink-0 flex items-center justify-center font-bold text-sm border border-border overflow-hidden">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground truncate">{name}</span>
                      {activeChat.expand?.proposal_id?.status === 'pending' && (
                        <span className="text-[10px] text-amber-500 font-medium">
                          Informações protegidas (Pagamento pendente)
                        </span>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto flex flex-col pb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground p-8 my-auto text-sm">
                    Envie a primeira mensagem para iniciar a conversa.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender_id === pb.authStore.record?.id
                    return (
                      <div
                        key={msg.id}
                        className={cn('flex w-full', isMine ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm relative group',
                            isMine
                              ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm'
                              : 'bg-muted text-foreground rounded-tl-sm border border-border',
                          )}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed break-words flex items-center flex-wrap gap-1">
                            {msg.content}
                            {msg.is_masked && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ShieldAlert
                                    className={cn(
                                      'w-4 h-4 ml-1 inline-block',
                                      isMine ? 'text-primary-foreground/70' : 'text-amber-500',
                                    )}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Dados de contato ocultos por segurança até a confirmação do
                                    pagamento.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </p>
                          <span
                            className={cn(
                              'text-[10px] mt-1.5 block text-right',
                              isMine ? 'text-primary-foreground/70' : 'text-muted-foreground',
                            )}
                          >
                            {new Date(msg.created).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card/50 shrink-0">
              <form
                onSubmit={handleSend}
                className="max-w-3xl mx-auto flex items-end gap-2 bg-background border border-border rounded-xl p-2 shadow-sm focus-within:border-primary transition-colors"
              >
                <Input
                  placeholder="Digite sua mensagem..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent min-h-[44px] h-auto resize-none py-3"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!text.trim()}
                  className="h-11 w-11 shrink-0 rounded-lg"
                >
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Enviar</span>
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-secondary/10">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 opacity-50">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">Suas Mensagens</p>
            <p className="text-sm">Selecione uma conversa ao lado para começar a interagir.</p>
          </div>
        )}
      </div>
    </div>
  )
}

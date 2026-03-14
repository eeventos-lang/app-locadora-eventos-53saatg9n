import { useState, useRef, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, ArrowLeft, Search, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useApp } from '@/store/AppContext'
import { cn } from '@/lib/utils'

export default function Messages() {
  const { currentUser, chats, messages, sendChatMessage, users } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeChatId = searchParams.get('chat')
  const [text, setText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const myChats = useMemo(() => {
    return chats
      .filter((c) => currentUser && c.participants.includes(currentUser.id))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [chats, currentUser])

  const activeChat = myChats.find((c) => c.id === activeChatId)

  const activeMessages = useMemo(() => {
    return messages
      .filter((m) => m.chatId === activeChatId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [messages, activeChatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !activeChatId) return
    sendChatMessage(activeChatId, text.trim())
    setText('')
  }

  const setActiveChat = (id: string | null) => {
    if (id) setSearchParams({ chat: id })
    else setSearchParams({})
  }

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
        Faça login para acessar suas mensagens.
      </div>
    )
  }

  const filteredChats = myChats.filter((chat) => {
    const otherUserId = chat.participants.find((p) => p !== currentUser.id)
    const otherUser = users.find((u) => u.id === otherUserId)
    const name = otherUser?.companyProfile?.name || otherUser?.name || 'Desconhecido'
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      {/* Sidebar List */}
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
                const otherUserId = chat.participants.find((p) => p !== currentUser.id)
                const otherUser = users.find((u) => u.id === otherUserId)
                const name = otherUser?.companyProfile?.name || otherUser?.name || 'Desconhecido'
                const lastMsg = messages
                  .filter((m) => m.chatId === chat.id)
                  .sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                  )[0]

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
                      {otherUser?.companyProfile?.logo ? (
                        <img
                          src={otherUser.companyProfile.logo}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm truncate text-foreground pr-2">
                          {name}
                        </span>
                        {lastMsg && (
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                            {new Date(lastMsg.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {lastMsg ? lastMsg.text : 'Iniciar conversa'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Active Chat Area */}
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
                const otherUserId = activeChat.participants.find((p) => p !== currentUser.id)
                const otherUser = users.find((u) => u.id === otherUserId)
                const name = otherUser?.companyProfile?.name || otherUser?.name || 'Desconhecido'
                return (
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-secondary shrink-0 flex items-center justify-center font-bold text-sm border border-border overflow-hidden">
                      {otherUser?.companyProfile?.logo ? (
                        <img
                          src={otherUser.companyProfile.logo}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="font-semibold text-foreground truncate">{name}</span>
                  </div>
                )
              })()}
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto flex flex-col pb-4">
                {activeMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground p-8 my-auto text-sm">
                    Envie a primeira mensagem para iniciar a conversa.
                  </div>
                ) : (
                  activeMessages.map((msg) => {
                    const isMine = msg.senderId === currentUser.id
                    return (
                      <div
                        key={msg.id}
                        className={cn('flex w-full', isMine ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm',
                            isMine
                              ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm'
                              : 'bg-muted text-foreground rounded-tl-sm border border-border',
                          )}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed break-words">
                            {msg.text}
                          </p>
                          <span
                            className={cn(
                              'text-[10px] mt-1.5 block text-right',
                              isMine ? 'text-primary-foreground/70' : 'text-muted-foreground',
                            )}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {
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

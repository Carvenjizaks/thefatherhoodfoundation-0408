'use client'

import React from "react"

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, ImageIcon, Paperclip } from 'lucide-react'
import { format } from 'date-fns'

interface GroupChatProps {
  groupId: string
  currentUserId: string
}

export function GroupChat({ groupId, currentUserId }: GroupChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`group-chat-${groupId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'group_chat_messages',
          filter: `group_id=eq.${groupId}`
        }, 
        (payload) => {
          setMessages(prev => [...prev, payload.new])
          scrollToBottom()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('group_chat_messages')
      .select(`
        *,
        sender:contacts(id, first_name, last_name, avatar_url)
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })
      .limit(100)
    
    if (data) {
      setMessages(data)
      scrollToBottom()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('group_chat_messages')
        .insert({
          group_id: groupId,
          sender_id: currentUserId,
          message: newMessage.trim(),
          message_type: 'text'
        })

      if (!error) {
        setNewMessage('')
      }
    } catch (err) {
      console.error('[v0] Error sending message:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.sender_id === currentUserId
          const sender = msg.sender

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={sender?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {sender?.first_name?.[0]}{sender?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className={`flex flex-col ${isCurrentUser ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {isCurrentUser ? 'You' : `${sender?.first_name} ${sender?.last_name}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(msg.created_at), 'h:mm a')}
                  </span>
                </div>

                <div
                  className={`rounded-lg px-4 py-2 max-w-md ${
                    isCurrentUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.message_type === 'prayer_request' && (
                    <div className="text-xs font-semibold mb-1 opacity-80">
                      🙏 Prayer Request
                    </div>
                  )}
                  {msg.message_type === 'announcement' && (
                    <div className="text-xs font-semibold mb-1 opacity-80">
                      📢 Announcement
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={loading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button type="button" variant="outline" size="sm">
            <ImageIcon className="h-4 w-4 mr-2" />
            Image
          </Button>
          <Button type="button" variant="outline" size="sm">
            <Paperclip className="h-4 w-4 mr-2" />
            Attach
          </Button>
        </div>
      </form>
    </Card>
  )
}

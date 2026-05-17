'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Send, Edit3, Mail, User, Eye } from 'lucide-react'

interface Invitation {
  to: string
  toName: string
  subject: string
  body: string
  from: string
}

interface InvitationPreviewProps {
  isOpen: boolean
  onClose: () => void
  invitations: Invitation[]
  onSend: () => void
  isSending: boolean
  onEdit: () => void
}

export function InvitationPreview({
  isOpen,
  onClose,
  invitations,
  onSend,
  isSending,
  onEdit,
}: InvitationPreviewProps) {
  const [activeTab, setActiveTab] = useState('0')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 bg-[#3D2314] text-[#f5ede4]">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-[#f5ede4]">
            <Eye className="w-5 h-5" />
            Preview Invitations
          </DialogTitle>
          <DialogDescription className="text-[#f5ede4]/80">
            Review your invitation emails before sending
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid bg-[#f5ede4] p-1 mb-6" style={{ gridTemplateColumns: `repeat(${invitations.length}, 1fr)` }}>
              {invitations.map((invitation, index) => (
                <TabsTrigger
                  key={index}
                  value={String(index)}
                  className="data-[state=active]:bg-[#3D2314] data-[state=active]:text-[#f5ede4] text-[#3D2314] text-sm font-medium"
                >
                  {invitation.toName}
                </TabsTrigger>
              ))}
            </TabsList>

            {invitations.map((invitation, index) => (
              <TabsContent key={index} value={String(index)} className="mt-0">
                <div className="border border-[#e5e5e5] rounded-lg overflow-hidden bg-white shadow-sm">
                  {/* Email Header */}
                  <div className="bg-[#f5f5f5] px-4 py-3 border-b border-[#e5e5e5]">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-[#737373] w-16 shrink-0">From:</span>
                        <span className="text-[#1a1a1a]">{invitation.from}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-[#737373] w-16 shrink-0">To:</span>
                        <span className="text-[#1a1a1a]">{invitation.to}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-[#737373] w-16 shrink-0">Subject:</span>
                        <span className="text-[#1a1a1a] font-medium">{invitation.subject}</span>
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="p-6">
                    <div
                      className="prose prose-sm max-w-none text-[#1a1a1a]"
                      dangerouslySetInnerHTML={{ __html: invitation.body }}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Side-by-side view for desktop */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-4 mt-6">
            {invitations.map((invitation, index) => (
              <div
                key={`side-${index}`}
                className="border border-[#e5e5e5] rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <div className="bg-[#3D2314] px-3 py-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#f5ede4]" />
                  <span className="text-sm font-medium text-[#f5ede4] truncate">
                    {invitation.toName}
                  </span>
                </div>
                <div className="p-3 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#737373]">
                    <User className="w-3 h-3" />
                    <span className="truncate">{invitation.to}</span>
                  </div>
                  <p className="font-medium text-[#1a1a1a] line-clamp-2">
                    {invitation.subject}
                  </p>
                  <div
                    className="text-[#737373] line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: invitation.body }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-[#f5f5f5] border-t border-[#e5e5e5] flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onEdit}
            disabled={isSending}
            className="w-full sm:w-auto border-[#3D2314] text-[#3D2314] hover:bg-[#f5ede4]"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Recipients
          </Button>
          <Button
            onClick={onSend}
            disabled={isSending}
            className="w-full sm:w-auto bg-[#3D2314] hover:bg-[#2a180e] text-[#f5ede4]"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send {invitations.length} Invitation{invitations.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

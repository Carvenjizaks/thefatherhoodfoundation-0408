'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Download, Plus, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

interface GroupResourcesProps {
  groupId: string
  isLeader: boolean
}

export function GroupResources({ groupId, isLeader }: GroupResourcesProps) {
  const supabase = createClient()
  const [resources, setResources] = useState<any[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resource_type: 'document',
    resource_url: ''
  })

  useEffect(() => {
    fetchResources()
  }, [groupId])

  const fetchResources = async () => {
    const { data } = await supabase
      .from('group_resources')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
    
    if (data) {
      setResources(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('group_resources')
        .insert({
          group_id: groupId,
          ...formData
        })

      if (!error) {
        setShowAddDialog(false)
        setFormData({ title: '', description: '', resource_type: 'document', resource_url: '' })
        fetchResources()
      }
    } catch (err) {
      console.error('[v0] Error adding resource:', err)
    } finally {
      setLoading(false)
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-5 w-5" />
      case 'video': return <FileText className="h-5 w-5" />
      case 'link': return <ExternalLink className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shared Resources</h3>
        {isLeader && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Resource</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL/Link</Label>
                  <Input
                    type="url"
                    value={formData.resource_url}
                    onChange={(e) => setFormData({ ...formData, resource_url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Add Resource
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-3">
        {resources.map((resource) => (
          <Card key={resource.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-muted-foreground mt-1">
                  {getResourceIcon(resource.resource_type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{resource.title}</h4>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {resource.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Added {format(new Date(resource.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <a href={resource.resource_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    View
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {resources.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No resources shared yet
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Notification {
  id: string
  user_id: string
  type: 'published' | 'failed' | 'ranking' | 'record' | 'trial' | 'disconnected'
  title: string
  message: string | null
  read: boolean
  created_at: string
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  markAllRead: () => Promise<void>
  markRead: (id: string) => Promise<void>
}

export function useNotifications(userId: string | undefined): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    const fetchNotifications = async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20)

        if (data) setNotifications(data as Notification[])
      } catch {
        // notifications table may not exist yet
      }
    }

    fetchNotifications()

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, payload => {
        setNotifications(prev => [payload.new as Notification, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = useCallback(async () => {
    if (!userId) return
    const supabase = createClient()
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch { /* ignore */ }
  }, [userId])

  const markRead = useCallback(async (id: string) => {
    const supabase = createClient()
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch { /* ignore */ }
  }, [])

  return { notifications, unreadCount, markAllRead, markRead }
}

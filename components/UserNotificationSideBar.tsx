import { INotification } from '@/types'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet'
import { 
  Bell, 
  Heart, 
  Package, 
  X, 
  Clock,
  Eye,
  EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface UserNotificationSideBarProps {
    isOpen: boolean
    onClose: () => void
}

const UserNotificationSideBar = ({ isOpen, onClose }: UserNotificationSideBarProps) => {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return;
    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/notifications/get", { cache: "no-store" })
        const result = await res.json()
        setNotifications(result.data || [])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [isOpen])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'review_liked':
        return <Heart className="h-4 w-4 text-pink-500" />
      case 'order_shipped':
        return <Package className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'review_liked':
        return 'bg-pink-50 border-pink-200'
      case 'order_shipped':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      })
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PATCH'
      })
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const unreadCount = notifications.filter(notif => !notif.isRead).length

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
   
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md p-0 h-full flex flex-col "
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </SheetTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button> */}
              </div>
            </div>
          </SheetHeader>

          <Separator className="flex-shrink-0" />

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-lg border animate-pulse"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={cn(
                      "flex gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md",
                      getNotificationColor(notification.type),
                      !notification.isRead && "border-l-4 border-l-blue-500"
                    )}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification._id)
                      }
                      if (notification.url) {
                        window.location.href = notification.url
                      }
                    }}
                  >
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-sm leading-tight">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          {!notification.isRead && (
                            <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification._id)
                            }}
                          >
                            {notification.isRead ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(notification.createdAt), { 
                            addSuffix: true 
                          })}
                        </div>
                        
                        {notification.sender && (
                          <span className="font-medium">
                            {notification.sender.username}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default UserNotificationSideBar
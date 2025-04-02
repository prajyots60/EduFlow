"use client"

import type React from "react"

import { useState } from "react"
import { Search, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for conversations
const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Let me know if you have any questions about the assignment!",
    time: "10:30 AM",
    unread: true,
    course: "Introduction to Web Development",
  },
  {
    id: 2,
    name: "David Kim",
    role: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Great work on your latest project submission.",
    time: "Yesterday",
    unread: false,
    course: "Graphic Design for Beginners",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The next live session will be on Thursday at 2 PM. Don't miss it!",
    time: "2 days ago",
    unread: false,
    course: "Data Science Essentials",
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I've shared some additional resources for the marketing campaign project.",
    time: "3 days ago",
    unread: false,
    course: "Digital Marketing Fundamentals",
  },
  {
    id: 5,
    name: "Support Team",
    role: "Support",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your payment issue has been resolved. Thank you for your patience.",
    time: "1 week ago",
    unread: false,
  },
]

// Mock data for active conversation
const messages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    senderRole: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Hi John! How are you finding the course so far?",
    time: "10:15 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    content: "Hi Sarah! I'm really enjoying it. The HTML and CSS sections were very clear.",
    time: "10:18 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    senderRole: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "That's great to hear! Are you having any trouble with the JavaScript section?",
    time: "10:20 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Me",
    content:
      "Actually, I'm a bit confused about the DOM manipulation part. Could you explain how event listeners work again?",
    time: "10:25 AM",
    isMe: true,
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    senderRole: "Instructor",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Of course! Event listeners are functions that wait for a specific event to occur on an element, like a click or hover. Let me know if you have any questions about the assignment!",
    time: "10:30 AM",
    isMe: false,
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conversation.course && conversation.course.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // In a real app, this would send the message to the backend
    setNewMessage("")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <h1 className="text-xl font-semibold">Messages</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversations sidebar */}
          <div className="w-full md:w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="w-full bg-background pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <User className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No conversations found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                        activeConversation.id === conversation.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{conversation.name}</span>
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{conversation.role}</span>
                            {conversation.course && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground truncate">{conversation.course}</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread && <Badge className="ml-2 h-2 w-2 rounded-full p-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active conversation */}
          <div className="hidden md:flex flex-1 flex-col">
            {activeConversation ? (
              <>
                <div className="border-b p-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                    <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">{activeConversation.name}</h2>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">{activeConversation.role}</span>
                      {activeConversation.course && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{activeConversation.course}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-3 max-w-[80%] ${message.isMe ? "flex-row-reverse" : ""}`}>
                        {!message.isMe && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={message.avatar} alt={message.sender} />
                            <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div className={`flex items-center gap-2 ${message.isMe ? "justify-end" : ""}`}>
                            {!message.isMe && <span className="text-sm font-medium">{message.sender}</span>}
                            <span className="text-xs text-muted-foreground">{message.time}</span>
                          </div>
                          <Card className={`mt-1 ${message.isMe ? "bg-primary text-primary-foreground" : ""}`}>
                            <CardContent className="p-3">
                              <p className="text-sm">{message.content}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            )}
          </div>

          {/* Mobile conversation view */}
          <div className="flex flex-col flex-1 md:hidden">
            {activeConversation ? (
              <>
                <div className="border-b p-4 flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() => setActiveConversation(null as any)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                    <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">{activeConversation.name}</h2>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">{activeConversation.role}</span>
                      {activeConversation.course && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{activeConversation.course}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-3 max-w-[80%] ${message.isMe ? "flex-row-reverse" : ""}`}>
                        {!message.isMe && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={message.avatar} alt={message.sender} />
                            <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div className={`flex items-center gap-2 ${message.isMe ? "justify-end" : ""}`}>
                            {!message.isMe && <span className="text-sm font-medium">{message.sender}</span>}
                            <span className="text-xs text-muted-foreground">{message.time}</span>
                          </div>
                          <Card className={`mt-1 ${message.isMe ? "bg-primary text-primary-foreground" : ""}`}>
                            <CardContent className="p-3">
                              <p className="text-sm">{message.content}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className="w-full text-left p-4 hover:bg-muted/50 transition-colors"
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{conversation.name}</span>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{conversation.role}</span>
                          {conversation.course && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground truncate">{conversation.course}</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread && <Badge className="ml-2 h-2 w-2 rounded-full p-0" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


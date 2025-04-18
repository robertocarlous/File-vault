import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import {
  MessageSquare,
  Send,
  Plus,
  History,
  Loader2,
  X,
  Minimize2,
} from 'lucide-react';
import { generateResponse } from '../services/ai';
import { showToast } from '../utils/toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const AiChat = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chats from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('aiChats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      })));
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('aiChats', JSON.stringify(chats));
    }
  }, [chats]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, currentStreamingMessage]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
    setShowHistory(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, userMessage],
    };

    setChats(chats.map(chat => 
      chat.id === activeChat.id ? updatedChat : chat
    ));
    setActiveChat(updatedChat);
    setInput('');
    setIsLoading(true);
    setCurrentStreamingMessage('');

    try {
      const response = await generateResponse(input);
      
      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        streamedContent += chunk;
        setCurrentStreamingMessage(streamedContent);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: streamedContent,
        timestamp: new Date(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMessage],
      };

      setChats(chats.map(chat => 
        chat.id === activeChat.id ? finalChat : chat
      ));
      setActiveChat(finalChat);
      setCurrentStreamingMessage('');
    } catch (error) {
      console.error('Failed to get AI response:', error);
      showToast.error('Failed to get AI response. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, errorMessage],
      };

      setChats(chats.map(chat => 
        chat.id === activeChat.id ? finalChat : chat
      ));
      setActiveChat(finalChat);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] bg-background border border-border rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
            className="h-8 w-8"
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="h-8 w-8"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat History Sidebar */}
      {showHistory && (
        <div className="absolute right-full mr-2 w-64 h-full bg-background border border-border rounded-lg shadow-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Chat History</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-60px)] p-4">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={createNewChat}
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
              {chats.map(chat => (
                <Button
                  key={chat.id}
                  variant={activeChat?.id === chat.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-sm truncate"
                  onClick={() => {
                    setActiveChat(chat);
                    setShowHistory(false);
                  }}
                >
                  {chat.messages[0]?.content.slice(0, 20) || 'New Chat'}...
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat Content */}
      <ScrollArea className="flex-1 p-4">
        {activeChat ? (
          <div className="space-y-4">
            {activeChat.messages.map(message => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {formatDate(message.timestamp)}
                </span>
              </div>
            ))}
            {currentStreamingMessage && (
              <div className="flex flex-col items-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  {currentStreamingMessage}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {formatDate(new Date())}
                </span>
              </div>
            )}
            {isLoading && !currentStreamingMessage && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <MessageSquare className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Welcome to AI Assistant
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a new chat to get help with Web3, blockchain, content creation, and more.
            </p>
            <Button onClick={createNewChat}>Start New Chat</Button>
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      {activeChat && (
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChat;

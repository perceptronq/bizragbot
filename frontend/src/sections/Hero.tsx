import { useState, useRef } from 'react'
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Card, CardContent } from "@/components/Card"
import { ScrollArea } from "@/components/ScrollArea"
import { Mic, ArrowUp, Bot, User, Paperclip } from "lucide-react"

const exampleQuestions = [
  "What is the weather in San Francisco?",
  "Answer like I'm 5, why is the sky blue?"
]

export const Hero = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = (message: string = input) => {
    if (message.trim()) {
      setMessages([...messages, { role: 'user', content: message }])
      setInput('')
      // replace with actual API call 
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: `Here's a response to "${message}"` }])
      }, 1000)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // handle file upload here
      setMessages([...messages, { role: 'user', content: `File uploaded: ${file.name}` }])
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-zinc-300 text-center mb-8">
          Revolutionizing Customer Interactions with Intelligent AI
        </h1>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {exampleQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className="bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-100 text-left h-auto py-2 px-3"
              onClick={() => handleSend(question)}
            >
              {question}
            </Button>
          ))}
        </div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <ScrollArea className="h-[300px] mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-sky-500' : 'bg-zinc-700'}`}>
                      {message.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                    </div>
                    <span className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-sky-500 text-white' : 'bg-zinc-700 text-zinc-300'}`}>
                      {message.content}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="relative">
              <Input
                type="text"
                placeholder="Send a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-zinc-800 text-zinc-300 border-zinc-700 focus:ring-zinc-600 focus:border-zinc-600 pr-28"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-zinc-700 hover:bg-zinc-600"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4 text-zinc-300" />
                  <span className="sr-only">Upload file</span>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-zinc-700 hover:bg-zinc-600"
                >
                  <Mic className="h-4 w-4 text-zinc-300" />
                  <span className="sr-only">Voice input</span>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-zinc-700 hover:bg-zinc-600"
                  onClick={() => handleSend()}
                >
                  <ArrowUp className="h-4 w-4 text-zinc-300" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

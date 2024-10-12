import { useState, useRef } from 'react'
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Card, CardContent } from "@/components/Card"
import { ScrollArea } from "@/components/ScrollArea"
import { Mic, ArrowUp, Bot, User, Paperclip } from "lucide-react"
import axios from 'axios';


const exampleQuestions = [
  "Tesla sales in Q3",
  "Predicted stock price of Apple in 2025",
]

export const Hero = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = (message: string = input) => {
    if (message.trim()) {
      setMessages([...messages, { role: 'user', content: message }]);
      setInput('');

      // Make API call to Flask API
      axios.post('http://localhost:8080/', { message })
        .then(response => {
          const apiResponse = response.data;
          setMessages(prev => [...prev, { role: 'assistant', content: apiResponse }]);
        })
        .catch(error => console.error(error));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // handle file upload here
      setMessages([...messages, { role: 'user', content: `File uploaded: ${file.name}` }])
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-xl md:text-4xl font-bold text-white text-center mb-8">
          Unleash the Full Potential of Your Business Data with Intelligent AI <div>💯🚀🎯</div>
        </h1>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {exampleQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className="bg-gray-800 text-gray-100 hover:border-sky-500 hover:text-white text-left h-auto py-2 px-3"
              onClick={() => handleSend(question)}
            >
              {question}
            </Button>
          ))}
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <ScrollArea className="h-[300px] mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-sky-500' : 'bg-gray-600'}`}>
                      {message.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                    </div>
                    <span className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-sky-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                      {message.content.text} {/* Access the text property of the message.content object */}
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
                className="w-full bg-gray-800 text-gray-100 border-gray-700 focus:ring-sky-500 focus:border-sky-500 pr-28"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4 text-gray-300" />
                  <span className="sr-only">Upload file</span>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <Mic className="h-4 w-4 text-gray-300" />
                  <span className="sr-only">Voice input</span>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
                  onClick={() => handleSend()}
                >
                  <ArrowUp className="h-4 w-4 text-white" />
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

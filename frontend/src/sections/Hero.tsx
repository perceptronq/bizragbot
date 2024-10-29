"use client";

import ReactMarkdown from 'react-markdown';
import starsBg from '@/assets/stars.png';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card, CardContent } from "@/components/Card";
import { ScrollArea } from "@/components/ScrollArea";
import { ArrowUp, Bot, User, Paperclip, RefreshCw } from "lucide-react";
import { useSession } from '../lib/useSession';
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from '../lib/supabaseClient';

const exampleQuestions = [
  "Tesla sales projections for Q4 2024",
  "Projected impact of AI on retail sales",
  "Predicted stock price of Apple in 2025",
  "Estimated growth of the AI market",
];

export const Hero = () => {
  const user = useSession();
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [displayMessages, setDisplayMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isCleared, setIsCleared] = useState(false);
  const [clearTimestamp, setClearTimestamp] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchChatHistory();
    }
  }, [user]);

  const fetchChatHistory = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching chat history:", error);
      } else if (data) {
        const chatMessages = data.map(item => ({ role: item.role, content: item.content }));
        setMessages(chatMessages);
        setDisplayMessages(chatMessages);
      }
    }
  };

  const handleClearChat = () => {
    setDisplayMessages([]);
    setIsCleared(true);
    setClearTimestamp(Date.now());
  };

  const saveChatMessage = async (role: string, content: string, chatType: 'user' | 'rag') => {
    if (user) {
      const { error } = await supabase
        .from('chat_history')
        .insert([
          {
            user_id: user.id,
            role,
            content,
            chat_type: chatType
          }
        ]);

      if (error) {
        console.error("Error saving chat message:", error);
      }
    }
  };

  const handleSend = async (message: string = input) => {
    if (message.trim() && user) {
      const userMessage = { role: 'user', content: message };

      if (isCleared) {
        setDisplayMessages(prev => [...prev, userMessage]);
      } else {
        setMessages(prev => [...prev, userMessage]);
        setDisplayMessages(prev => [...prev, userMessage]);
      }

      setInput('');
      await saveChatMessage('user', message, 'user');

      try {
        const response = await axios.post('http://localhost:5000/query', { query: message });
        const apiResponse = response.data.answer;
        const assistantMessage = { role: 'assistant', content: apiResponse };

        if (isCleared) {
          setDisplayMessages(prev => [...prev, assistantMessage]);
        } else {
          setMessages(prev => [...prev, assistantMessage]);
          setDisplayMessages(prev => [...prev, assistantMessage]);
        }

        await saveChatMessage('assistant', apiResponse, 'rag');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileMessage = { role: 'user', content: `File uploaded: ${file.name}` };

      if (isCleared) {
        setDisplayMessages([fileMessage]);
      } else {
        setMessages(prev => [...prev, fileMessage]);
        setDisplayMessages(prev => [...prev, fileMessage]);
      }

      const formData = new FormData();
      formData.append('file', file);

      axios.post('http://localhost:5000/upload', formData)
        .then(response => {
          console.log(response);
          const successMessage = { role: 'assistant', content: "File processed Successfully. You can now ask questions about its content." };

          if (isCleared) {
            setDisplayMessages(prev => [...prev, successMessage]);
          } else {
            setMessages(prev => [...prev, successMessage]);
            setDisplayMessages(prev => [...prev, successMessage]);
          }
        })
        .catch(error => {
          console.error(error);
          const errorMessage = { role: 'assistant', content: "Error processing the file. Please try again." };

          if (isCleared) {
            setDisplayMessages(prev => [...prev, errorMessage]);
          } else {
            setMessages(prev => [...prev, errorMessage]);
            setDisplayMessages(prev => [...prev, errorMessage]);
          }
        });
    }
  };

  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const backgroundPositionY = useTransform(scrollYProgress, [0, 1], [-300, 300]);

  return (
    <motion.section
      style={{
        backgroundImage: `url(${starsBg.src})`,
        backgroundPositionY,
      }}
      animate={{
        backgroundPositionX: starsBg.width,
      }}
      transition={{
        repeat: Infinity,
        duration: 60,
        ease: 'linear',
      }}
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 lg:p-12"
    >
      <div className="w-full max-w-3xl space-y-4">
        <h1 className={`font-bold text-center mb-8 ${user ? 'text-md text-white' : 'text-xl md:text-4xl text-white'}`}>
          {user ? `Welcome, ${user.email}` : 'Unleash the Full Potential of Your Business Data with Intelligent AI'}
        </h1>
        {!user && (
          <div className="text-center text-xl md:text-4xl mb-4">
            💯🚀🎯
          </div>
        )}
        {user ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-4">
              {exampleQuestions.map((question, index) => (
                <Button
                  key={index}
                  className="border border-gray-700 hover:border-sky-500 text-left h-auto py-2 px-3"
                  onClick={() => handleSend(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
            <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl mx-auto">
              <CardContent className="p-4 md:p-6">
                <div className="justify-between items-right mb-2">
                  <Button
                    size="icon"
                    className="text-gray-300 hover:text-white"
                    onClick={handleClearChat}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <ScrollArea className="h-[300px] md:h-[400px] mb-4">
                  <div className="pr-4">
                    {displayMessages.length === 0 ? (
                      <div className="text-center text-gray-400 mt-4">
                        {isCleared
                          ? "Chat Cleared. Send a Message to start a new Conversation."
                          : "No Messages yet. Start a Conversation!"}
                      </div>
                    ) : (
                      displayMessages.map((message, index) => (
                        <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-sky-500' : 'bg-gray-600'}`}>
                              {message.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                            </div>
                            <span className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-sky-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                              <ReactMarkdown className="prose prose-invert max-w-none">
                                {message.content}
                              </ReactMarkdown>
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
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
                      className="h-8 w-8 rounded-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4 text-gray-300 group-hover:text-white" />
                      <span className="sr-only">Upload file</span>
                    </Button>
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-full"
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
          </>
        ) : (
          <div className='pt-12'>
            <Card className="bg-gray-800 border-gray-700 p-6 md:p-8 lg:p-10">
              <CardContent className="text-center">
                <p className="text-gray-200 mb-4 tracking-tighter">
                  Please Login to Start Chatting and Exploring Insights!
                </p>
                <Button
                  className="bg-sky-500 hover:bg-sky-600 text-white mb-4"
                  onClick={() => { window.location.href = '/login'; }}
                >
                  Login
                </Button>
                <p className="text-gray-300 tracking-tighter">
                  Don&apos;t have an account? <a href="/signup" className="text-sky-500 hover:underline">Sign up</a>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </motion.section>
  );
};
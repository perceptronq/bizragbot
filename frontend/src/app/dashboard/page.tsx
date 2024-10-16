"use client";

import { useEffect, useState } from 'react';
import { useSession } from '../../lib/useSession';
import { Header } from '@/sections/Header'; 
import { Footer } from '@/sections/Footer'; 
import { supabase } from '../../lib/supabaseClient'; 
import { Card, CardContent } from "@/components/Card";
import { ScrollArea } from "@/components/ScrollArea";
import { Bot, User } from "lucide-react";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chat_type: 'user' | 'rag';
  created_at: string;
}

const Dashboard: React.FC = () => {
    const user = useSession();
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('chat_history')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error("Error Fetching Chat History:", error);
                } else {
                    setChatHistory(data as ChatMessage[] || []);
                }
            }
        };

        fetchChatHistory();
    }, [user]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-6">
                    <h1 className="text-3xl font-bold text-center">Dashboard</h1>
                    {user ? (
                        <>
                            <p className="text-lg text-center">Welcome, {user.email}</p>
                            <Card className="bg-gray-800 border-gray-700">
                                <CardContent className="p-4">
                                    <h2 className="text-xl font-semibold mb-4 text-white">Chat History</h2>
                                    <ScrollArea className="h-[400px]">
                                        {chatHistory.length > 0 ? (
                                            chatHistory.map((message) => (
                                                <div key={message.id} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-sky-500' : 'bg-gray-600'}`}>
                                                            {message.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                                                        </div>
                                                        <div className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-sky-500 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                                            <p className="text-xs mb-1 opacity-75">
                                                                {new Date(message.created_at).toLocaleString()} - {message.chat_type.toUpperCase()}
                                                            </p>
                                                            <p>{message.content}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-400">No chat history found</p>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <p className="text-lg text-center">Please Login to see your Dashboard</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
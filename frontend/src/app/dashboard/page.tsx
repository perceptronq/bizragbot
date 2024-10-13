"use client";

import { useEffect, useState } from 'react';
import { useSession } from '../../lib/useSession';
import { Header } from '@/sections/Header'; 
import { Footer } from '@/sections/Footer'; 
import { supabase } from '../../lib/supabaseClient'; 

const Dashboard: React.FC = () => {
    const user = useSession();
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('chat_history')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) {
                    console.error("Error Fetching Chat History:", error);
                } else {
                    setChatHistory(data);
                }
            }
        };

        fetchChatHistory();
    }, [user]);

    const insertChatMessage = async (userId: string, message: string) => {
        const { data, error } = await supabase
            .from('chat_history')
            .insert([
                { user_id: userId, message: message }
            ]);

        if (error) {
            console.error("Error Inserting Chat Message:", error);
        } else {
            if (data) {
                setChatHistory((prev) => [...prev, data[0]]); 
            }
            setMessage(''); 
        }
    };

    const handleSendMessage = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!message.trim() || !user) return;

        await insertChatMessage(user.id, message);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md p-8 space-y-6 text-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    {user ? (
                        <>
                            <p className="text-lg">Welcome, {user.email}</p>
                            <div className="mt-4">
                                <h2 className="text-xl py-4 font-semibold">Chat History</h2>
                                <ul className="space-y-2">
                                    {chatHistory.length > 0 ? (
                                        chatHistory.map((chat) => (
                                            <li key={chat.id} className="bg-gray-100 p-4 rounded-md">
                                                <p><strong>{new Date(chat.created_at).toLocaleString()}</strong></p>
                                                <p>{chat.message}</p>
                                            </li>
                                        ))
                                    ) : (
                                        <p>No Chat History found</p>
                                    )}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p className="text-lg">Please Login to see your Dashboard</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;

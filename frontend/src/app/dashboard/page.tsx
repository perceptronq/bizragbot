"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from '../../lib/useSession';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent } from "@/components/Card";
import { ScrollArea } from "@/components/ScrollArea";
import { Bot, User, Trash2, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    chat_type: 'user' | 'rag';
    created_at: string;
}

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-gray-300 mb-6">
                    Are you sure you want to Delete this Message? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const user = useSession();
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchChatHistory();
    }, [user]);

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

    const handleDeleteClick = (messageId: string) => {
        setMessageToDelete(messageId);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!messageToDelete) return;

        try {
            const { error } = await supabase
                .from('chat_history')
                .delete()
                .eq('id', messageToDelete);

            if (error) {
                throw error;
            }

            setChatHistory(prev => prev.filter(message => message.id !== messageToDelete));
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
                <div className="w-full max-w-3xl space-y-6">
                    <h1 className="text-3xl font-bold text-center">Dashboard</h1>
                    {user ? (
                        <>
                            <p className="text-lg text-center">Welcome, {user.email}</p>
                            <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl mx-auto">
                                <CardContent className="p-4 md:p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-white">Chat History</h2>
                                    <ScrollArea className="h-[400px] md:h-[500px]">
                                        <div className="pr-4">
                                            {chatHistory.length > 0 ? (
                                                chatHistory.map((message) => (
                                                    <div key={message.id} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-sky-500' : 'bg-gray-600'}`}>
                                                                {message.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                                                            </div>
                                                            <div className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-sky-500 text-white' : 'bg-gray-700 text-gray-200'} relative group`}>
                                                                <p className="text-xs mb-1 opacity-75">
                                                                    {new Date(message.created_at).toLocaleString()} - {message.chat_type.toUpperCase()}
                                                                </p>
                                                                <ReactMarkdown className="prose prose-invert max-w-none">
                                                                    {message.content}
                                                                </ReactMarkdown>
                                                                <button
                                                                    onClick={() => handleDeleteClick(message.id)}
                                                                    className="absolute -right-2 -top-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-white" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-center text-gray-400">No chat history found</p>
                                            )}
                                        </div>
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
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setMessageToDelete(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Dashboard;
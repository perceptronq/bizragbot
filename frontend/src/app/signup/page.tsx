"use client";

import { useState } from 'react';
import { signUp } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { Header } from '@/sections/Header'; 
import { Footer } from '@/sections/Footer';

const Signup: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async () => {
        const { user, error } = await signUp(email, password);
        if (error) {
            setError(error);
        } else {
            console.log('Sign up Successful', user);
            router.push('/login');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md p-4 space-y-4">
                    <h2 className="text-2xl font-semibold text-center">Bizrag Bot</h2>
                    <input
                        className="w-full p-2 border text-black border-gray-700 rounded"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <input
                        className="w-full p-2 border text-black border-gray-700 rounded"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="w-full py-2 bg-sky-500 text-white font-semibold rounded hover:bg-sky-600"
                        onClick={handleSignup}
                    >
                        Sign up
                    </button>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Signup;

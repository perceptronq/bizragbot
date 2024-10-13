"use client";

import { useState } from 'react';
import { signUp } from '../../lib/auth';
import { useRouter } from 'next/navigation';

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
            console.log('Sign up successful', user);
            router.push('/login');
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleSignup}>Sign Up</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Signup;

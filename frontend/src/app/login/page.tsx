"use client";

import { useState } from 'react';
import { signIn } from '../../lib/auth';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        const { user, error } = await signIn(email, password);
        if (error) {
            setError(error);
        } else {
            console.log('Login successful', user);
            router.push('/dashboard'); 
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Log In</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;

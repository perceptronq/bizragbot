import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '../lib/useSession';
import { supabase } from '../lib/supabaseClient';
import logo from '../assets/logo.png';
import { useRouter, usePathname } from 'next/navigation';

export const Header: React.FC = () => {
    const user = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const isDashboard = pathname === '/dashboard';

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 bg-black border-b border-gray-800 z-50">
            <Link className="flex items-center justify-center" href="/">
                <span className="sr-only">Bizrag Bot</span>
                <Image src={logo} alt="Bizrag Bot Logo" width={32} height={32} quality={100} className="h-10 w-10" priority />
                <span className="ml-2 text-xl font-semibold">Bizrag Bot</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
                {!user ? (
                    <>
                        <Link className="text-sm font-medium hover:underline" href="/signup">Sign up</Link>
                        <Link className="text-sm font-medium hover:underline" href="/login">Login</Link>
                    </>
                ) : (
                    <>
                        {isDashboard ? (
                            <Link className="text-sm font-medium hover:underline" href="/">Home</Link>
                        ) : (
                            <Link className="text-sm font-medium hover:underline" href="/dashboard">Dashboard</Link> 
                        )}
                        <button className="text-sm font-medium hover:underline" onClick={handleLogout}>Logout</button>
                    </>
                )}
            </nav>
        </header>
    );
};

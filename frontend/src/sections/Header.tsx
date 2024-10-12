import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/logo.png';

export const Header = () => {
    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
            <Link className="flex items-center justify-center" href="#">
                <span className="sr-only">Bizrag Bot</span>
                <Image
                    src={logo}
                    alt="Bizrag Bot Logo"
                    width={32}
                    height={32}
                    quality={100}
                    className="h-10 w-10"
                    priority
                />
                <span className="ml-2 text-xl font-semibold">Bizrag Bot</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                    Sign up
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                    Login
                </Link>
            </nav>
        </header>
    );
};

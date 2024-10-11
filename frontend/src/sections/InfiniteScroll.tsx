"use client";

import { motion } from 'framer-motion';

export const InfiniteScroll = () => {
    return (
        <div className="py-8 lg:py-12 overflow-hidden">
            <div className="flex flex-1 items-center justify-between overflow-hidden">
                <motion.div
                    initial={{ translateX: '-50%' }}
                    animate={{ translateX: '0%' }}
                    transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                    className="flex flex-none items-center justify-between whitespace-nowrap -translate-x-1/2">
                    <nav className='text-8xl md:text-[128px] font-bold text-white/5 hover:text-white/10 mr-10 pb-4'>
                        <span>Bizrag Bot · Bizrag Bot · </span>
                        <span>Bizrag Bot · Bizrag Bot · </span>
                        <span>Bizrag Bot · Bizrag Bot · </span>
                        <span>Bizrag Bot · Bizrag Bot · </span>
                        <span>Bizrag Bot · Bizrag Bot · </span>
                        <span>Bizrag Bot · Bizrag Bot · </span>
                        <span>Bizrag Bot · Bizrag Bot · </span>
                        <span>Bizrag Bot · Bizrag Bot · </span>
                        <span>Bizrag Bot · Bizrag Bot · </span>
                        <span>Bizrag Bot · Bizrag Bot · </span>
                    </nav>
                </motion.div>
            </div>
        </div>
    );
};

"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const router = useRouter();
    const handleClick = () => {
        router.push("/dashboard");
    }
    return (
        <nav className="bg-[#1f1f1f] w-full h-18 fixed flex items-center justify-between px-10 py-1  z-50">
            <div className="text-blue-300/90 font-bold text-2xl tracking-wider">Texo</div>
            <div className="hidden md:flex items-center gap-10 text-[#BBBBBB] text-lg font-medium">
                <span className="hover:text-white transition duration-300">Explore</span>
                <span className="hover:text-white transition duration-300">Discover</span>
                <span className="hover:text-white transition duration-300">Create</span>
            </div>
            <div className="flex items-center gap-5">
                <Button onClick={handleClick} className="bg-[#F2F2F2] hover:bg-white text-gray-900 font-semibold px-5 py-5 mt-2 rounded-md shadow-md transition-all cursor-pointer">
                    Get Started
                </Button>
                <UserButton/>
            </div>
        </nav>
    );
};
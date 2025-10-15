"use client"

import React, { useEffect, useState } from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
    useUser,
} from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, ShoppingBag, X, Search } from 'lucide-react'
import { Button } from './ui/button'
import { User } from '@/types'
import CartSlider from './CartSlider'
import CartLength from './CartLength'

const Header = ({ adminUser }: { adminUser: User | null }) => {
    const { user, isSignedIn } = useUser()
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)

    useEffect(() => {
        if (isSignedIn && user) {
            fetch("/api/sync-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ clerkId: user.id }),
            }).then(() => router.push("/"))
        }
    }, [isSignedIn, user, router])


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (isMenuOpen && !target.closest('header')) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isMenuOpen])

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/categories", label: "Categories" },
        { href: "/shop", label: "Shop" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" }
    ]

    return (
        <>

            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
                : 'bg-white border-b border-gray-200'
                }`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center space-x-2 group flex-shrink-0"
                        >
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">D</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors hidden xs:block">
                                DESIGN
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 mx-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-700 hover:text-black font-medium transition-colors duration-200 relative group text-sm xl:text-base"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:flex items-center flex-1 max-w-xs mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {/* Search Button - Mobile */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Search size={20} />
                            </button>

                            {/* Shopping Bag */}
                            <button onClick={() => setIsCartOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    <CartLength />
                                </span>
                            </button>

                            {/* Auth Buttons */}
                            <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
                                <SignedOut>
                                    <SignInButton>
                                        <button className="text-gray-700 hover:text-black font-medium transition-colors duration-200 text-sm lg:text-base">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                    <SignUpButton>
                                        <button className="bg-black text-white hover:bg-gray-800 rounded-full px-4 lg:px-6 py-2 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm lg:text-base">
                                            Get Started
                                        </button>
                                    </SignUpButton>
                                </SignedOut>
                                <SignedIn>
                                    <div className="flex items-center space-x-3 lg:space-x-4">
                                        {adminUser && adminUser.role === "admin" && (
                                            <Link
                                                href="/admin"
                                                className="text-gray-700 hover:text-black font-medium transition-colors duration-200 text-sm lg:text-base"
                                            >
                                                Admin
                                            </Link>
                                        )}
                                        <UserButton
                                            appearance={{
                                                elements: {
                                                    avatarBox: "w-8 h-8 lg:w-10 lg:h-10 border-2 border-gray-200 hover:border-gray-300 transition-colors"
                                                }
                                            }}
                                        />
                                    </div>
                                </SignedIn>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {isSearchOpen && (
                        <div className="md:hidden border-t border-gray-200 py-3 px-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="lg:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top duration-300">
                            <nav className="flex flex-col py-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-700 hover:text-black font-medium py-3 px-6 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                {/* Mobile Auth Section */}
                                <div className="border-t border-gray-200 pt-4 px-6 space-y-3">
                                    <SignedOut>
                                        <div className="space-y-3">
                                            <SignInButton>
                                                <Button
                                                    onClick={() => setIsMenuOpen(false)}
                                                    variant="ghost"
                                                    className="w-full justify-start text-gray-700 hover:text-black font-medium py-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                                >
                                                    Sign In
                                                </Button>
                                            </SignInButton>
                                            <SignUpButton>
                                                <Button
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="w-full bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-3 font-medium transition-all duration-200"
                                                >
                                                    Get Started
                                                </Button>
                                            </SignUpButton>
                                        </div>
                                    </SignedOut>
                                    <SignedIn>
                                        <div className="space-y-3">
                                            {adminUser && adminUser.role === "admin" && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="block text-gray-700 hover:text-black font-medium py-3 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                                >
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <div className="flex items-center justify-between py-3 px-2">
                                                <span className="text-gray-700 font-medium">Account</span>
                                                <UserButton />
                                            </div>
                                        </div>
                                    </SignedIn>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            <CartSlider isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        </>
    )
}

export default Header
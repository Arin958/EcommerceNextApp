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
import { Menu, ShoppingBag, X, Search, User2, User, Package, UserCheck2Icon, Bell, ChevronDown } from 'lucide-react'
import { Button } from './ui/button'

import CartSlider from './CartSlider'
import CartLength from './CartLength'
import { INotification, User as UserType } from '@/types'
import UserNotificationSideBar from './UserNotificationSideBar'

const Header = ({ adminUser }: { adminUser: UserType | null }) => {
    const { user, isSignedIn } = useUser()
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
    const [categories, setCategories] = useState<string[]>([])

    // Fetch unique categories from products
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/category')
                const data = await res.json()
                setCategories(data.categories || [])
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    // Your existing useEffect hooks remain the same
    useEffect(() => {
        if (!isSignedIn) {
            setUnreadCount(0)
            return
        }

        const fetchUnreadCount = async () => {
            try {
                const res = await fetch("api/notifications/get", { cache: "no-store" })
                const result = await res.json()
                const notifications = result.data || []
                const unread = notifications.filter((notif: INotification) => !notif.isRead).length
                setUnreadCount(unread)
            } catch (error) {
                console.log("Error fetching Notification", error)
            }
        }

        fetchUnreadCount()
        const interval = setInterval(fetchUnreadCount, 30000)
        return () => clearInterval(interval)
    }, [isSignedIn])

    useEffect(() => {
        if (!isNotificationsOpen && isSignedIn) {
            const refreshCount = async () => {
                try {
                    const res = await fetch("/api/notifications/get", {
                        cache: "no-store"
                    })
                    const result = await res.json()
                    const notifications = result.data || []
                    const unread = notifications.filter((notif: INotification) => !notif.isRead).length
                    setUnreadCount(unread)
                } catch (error) {
                    console.error("Error refreshing notifications count:", error)
                }
            }
            refreshCount()
        }
    }, [isNotificationsOpen, isSignedIn])

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
            if (isCategoriesOpen && !target.closest('.categories-dropdown')) {
                setIsCategoriesOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isMenuOpen, isCategoriesOpen])

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },

        {
            href: "/shop?category=Hoodies",
            label: "Hoodies"
        },

        {
            href: "/shop?category=Accessories",
            label: "Accessories"
        },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" }
    ]

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
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
                            <div className="w-50 rounded-lg flex items-center justify-center">
                                <svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">

                                    <rect width="400" height="150" fill="white" />


                                    <g transform="translate(40, 35)">

                                        <path d="M 30 0 L 50 15 L 50 45 L 30 60 L 10 45 L 10 15 Z"
                                            fill="none"
                                            stroke="black"
                                            strokeWidth="2.5" />


                                        <path d="M 20 15 L 20 45 L 35 45 C 42 45 45 40 45 30 C 45 20 42 15 35 15 Z"
                                            fill="black" />
                                    </g>


                                    <text x="110" y="75"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        fontSize="42"
                                        fontWeight="300"
                                        letterSpacing="8"
                                        fill="black">DESIGNER</text>

                                    <text x="112" y="95"
                                        fontFamily="Arial, Helvetica, sans-serif"
                                        fontSize="10"
                                        fontWeight="400"
                                        letterSpacing="3"
                                        fill="black">FASHION & ACCESSORIES</text>


                                    <line x1="110" y1="105" x2="380" y2="105" stroke="black" strokeWidth="1" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors hidden xs:block">

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

                            {/* Categories Dropdown */}
                            <div className="categories-dropdown relative group">
                                <button
                                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                    className="flex items-center space-x-1 text-gray-700 hover:text-black font-medium transition-colors duration-200 text-sm xl:text-base"
                                >
                                    <span>Categories</span>
                                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                                </button>

                                {/* Dropdown Menu */}
                                {isCategoriesOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        {categories.map((category) => (
                                            <Link
                                                key={category}
                                                href={`/shop?category=${encodeURIComponent(category)}`}
                                                onClick={() => setIsCategoriesOpen(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                                            >
                                                {category}
                                            </Link>
                                        ))}
                                        {categories.length === 0 && (
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                No categories found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </nav>



                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {/* Search Button - Mobile */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Search size={20} />
                            </button>

                            {/* DropDown */}
                            {isSignedIn && user && (
                                <div className="relative group">
                                    <button className="rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                                        <User2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="py-2">
                                            <Link
                                                href="/my-profile"
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <User className="w-4 h-4 mr-3" />
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/my-orders"
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Package className="w-4 h-4 mr-3" />
                                                My Orders
                                            </Link>
                                            {adminUser && adminUser.role === "admin" && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <UserCheck2Icon className="w-4 h-4 mr-3" />
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <div className="border-t border-gray-100 my-1"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shopping Bag */}
                            <button onClick={() => setIsCartOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    <CartLength />
                                </span>
                            </button>

                            {/* Notification Bar */}
                            {isSignedIn && user && (
                                <button
                                    onClick={() => setIsNotificationsOpen(true)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                                >
                                    <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            )}

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
                        <div className="lg:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top duration-300 z-40">
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
            <UserNotificationSideBar isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </>
    )
}

export default Header
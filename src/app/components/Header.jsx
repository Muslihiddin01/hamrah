"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Select from "../components/Select"
const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-slate-900 font-['Inter']">
              StudentFlats
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-slate-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Find Apartments
            </Link>
            {user ? (
              <>
                <Link
                  href="/users"
                  className="text-slate-700 hover:text-emerald-600 transition-colors font-medium flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span>Users</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-slate-700 font-medium">
                    Hi, {user.name}
                  </span>
                  <Select/>
                  <button
                    onClick={handleLogout}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/Login"
                  className="text-slate-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/Register"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-slate-700 hover:text-emerald-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Apartments
              </Link>
              {user ? (
                <>
                  <Link
                    href="/chat"
                    className="text-slate-700 hover:text-emerald-600 transition-colors font-medium flex items-center space-x-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-slate-700 font-medium mb-2">
                      Hi, {user.name}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Link
                    href="/login"
                    className="text-slate-700 hover:text-emerald-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

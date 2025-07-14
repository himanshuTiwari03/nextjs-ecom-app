"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import { BiCart } from 'react-icons/bi';
import { BiLogOut } from 'react-icons/bi';
import { BiShoppingBag } from 'react-icons/bi';
import { BiHome } from 'react-icons/bi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const [loggedUser, setLoggedUser] = useState('');
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    const updateUser = () => {
      const user = JSON.parse(localStorage.getItem('user')) || null;
      setLoggedUser(user);
    };
  
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
  
    window.addEventListener('user-updated', updateUser);
    document.addEventListener('mousedown', handleClickOutside);
  
    // Call once on mount
    updateUser();
  
    // Clean up both listeners
    return () => {
      window.removeEventListener('user-updated', updateUser);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    router.push('/');
    window.reload();
  }

  return (
    <>
      <nav ref={menuRef} className="bg-gray-900 text-white p-4 relative">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">E-Store</div>

          {/* Hamburger Button */}
          <button className="sm:hidden block" onClick={() => setIsOpen(!isOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Menu */}
          {!loggedUser ? (
                     <div className="hidden sm:flex gap-4">
                     <Link href="/login" className="hover:text-gray-300">Login</Link>
                     </div>
          ) : (
            <div className="hidden sm:flex gap-4 flex items-center">
              
              <Link href="/" className="hover:text-gray-300"><BiHome size={20}/></Link>
              <Link href="/store" className="hover:text-gray-300"><BiShoppingBag size={20}/></Link>
              <Link href="/cart" className="hover:text-gray-300"><BiCart size={20}/></Link>
              {!loggedUser ? (
    <Link href="/login" className="hover:text-gray-300">Login</Link>
  ) : (
    <Link href="/" className="hover:text-gray-300" onClick={handleLogout}><BiLogOut size={20}/></Link>
  )}
  
            </div>
          )
 
          }

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden flex flex-col space-y-2 bg-gray-800 p-4 shadow-md absolute left-0 top-full w-full z-50">
           <Link href="/" className="hover:text-gray-300">Home</Link>
              <Link href="/store" className="hover:text-gray-300">Products</Link>
              <Link href="/cart" className="hover:text-gray-300">Cart</Link>
              {!loggedUser ? (
    <Link href="/login" className="hover:text-gray-300">Login</Link>
  ) : (
    <Link href="/" className="hover:text-gray-300" onClick={handleLogout}>Logout</Link>
  )}
          </div>
        )}
      </nav>
    </>
  );
}


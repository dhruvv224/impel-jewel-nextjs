
'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import CartProvider from "./context/CartContext";
import WishlistProvider from "./context/WishListContext";
import ProfileProvider from "./context/ProfileContext";
import ReadyDesignCartProvider from "./context/ReadyDesignCartContext";
import QueryProvider from "./query-provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';

// This component encapsulates all client-side logic and context providers.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <ProfileProvider>
          <ReadyDesignCartProvider>
            <Navbar />
            <QueryProvider>
              {children}
              <Footer />
            </QueryProvider>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#333',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </ReadyDesignCartProvider>
        </ProfileProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
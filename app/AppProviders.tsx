
'use client';

import React from 'react';
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
          </ReadyDesignCartProvider>
        </ProfileProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
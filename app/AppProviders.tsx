
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
  // Use the template literal syntax inside this Client Component
  // to ensure consistent rendering between the server (initial pass) and client (hydration).
  const bodyClassName = ' antialiased'; 

  return (
    <body >
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
    </body>
  );
}
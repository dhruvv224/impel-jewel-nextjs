"use client"
import React, { createContext, useEffect, useReducer } from "react";
import axios from "axios";
// Base URL for all API calls
const api = "https://admin.impel.store/api/";

export const ReadyDesignCartSystem = createContext();

const initialState = {
  cart: [],
  readyCartItems: 0,
};

const Cart = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      // Calculate readyCartItems based on cart array length
      // Each item in the cart represents one product, regardless of quantity field
      const cartArray = action.payload.cart || [];
      return {
        ...state,
        cart: cartArray,
        readyCartItems: cartArray.length,
      };

    case "ADD_TO_CART":
      const { design_id } = action.payload;
      const cartItem = state.cart.find((item) => item?.TagNo === design_id);

      if (cartItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.TagNo === design_id
              ? { ...item, quantity: item?.quantity + 1 }
              : item
          ),
          readyCartItems: state.readyCartItems + 1,
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { design_id, quantity: 1 }],
          readyCartItems: state.readyCartItems + 1,
        };
      }

    case "REMOVE_FROM_CART": {
      // Handle payload - can be a number (cart_id) or object with design_id/id
      const cartId = typeof action.payload === 'number' 
        ? action.payload 
        : (action.payload?.design_id || action.payload?.id || action.payload?.TagNo);
      
      if (!cartId) {
        return state;
      }
      
      // Filter out the removed item - check multiple possible ID fields
      const filteredCart = state?.cart?.filter((item) => {
        return item?.id !== cartId && 
               item?.cart_id !== cartId && 
               item?.TagNo !== cartId && 
               item?.design_id !== cartId;
      }) || [];
      
      // Recalculate readyCartItems based on filtered cart length
      return {
        ...state,
        cart: filteredCart,
        readyCartItems: filteredCart.length,
      };
    }

    case "RESET_CART":
      return {
        ...state,
        readyCartItems: 0,
      };

    default:
      return state;
  }
};


const ReadyDesignCartProvider = ({ children }) => {
  const [Phone, setPhone] = React.useState(null);
  const [state, dispatch] = useReducer(Cart, initialState);

  // Initialize phone from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPhone = localStorage.getItem("phone");
      setPhone(storedPhone);
    }
  }, []);

  const fetchCartData = React.useCallback(async () => {
    try {
      const phoneToUse = Phone || (typeof window !== "undefined" ? localStorage.getItem("phone") : null);
      if (phoneToUse && api) {
        const res = await axios.post(api + "ready/cart-list", { phone: phoneToUse });
        const cartData = res?.data?.data?.carts || res?.data?.carts || [];
        dispatch({ type: "SET_CART", payload: { cart: cartData } });
      } else {
        // If no phone, set empty cart
        dispatch({ type: "SET_CART", payload: { cart: [] } });
      }
    } catch (err) {
      // Silently handle errors - API might not be available or endpoint might be wrong
      console.error("Error fetching cart items:", err);
      // Dispatch empty cart on error to prevent UI issues
      dispatch({ type: "SET_CART", payload: { cart: [] } });
    }
  }, [Phone]);

  // Fetch cart data when phone is available
  useEffect(() => {
    if (Phone) {
      fetchCartData();
    }
  }, [Phone, fetchCartData]);

  // Also fetch on mount and when page becomes visible (tab switch)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Fetch immediately if phone is already in localStorage
      const storedPhone = localStorage.getItem("phone");
      if (storedPhone && !Phone) {
        // If phone is in localStorage but not in state yet, fetch directly
        axios.post(api + "ready/cart-list", { phone: storedPhone })
          .then((res) => {
            const cartData = res?.data?.data?.carts || res?.data?.carts || [];
            dispatch({ type: "SET_CART", payload: { cart: cartData } });
          })
          .catch((err) => {
            console.error("Error fetching cart items on mount:", err);
            dispatch({ type: "SET_CART", payload: { cart: [] } });
          });
      }

      // Listen for visibility change (when user switches back to tab)
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          const currentPhone = localStorage.getItem("phone");
          if (currentPhone) {
            axios.post(api + "ready/cart-list", { phone: currentPhone })
              .then((res) => {
                const cartData = res?.data?.data?.carts || res?.data?.carts || [];
                dispatch({ type: "SET_CART", payload: { cart: cartData } });
              })
              .catch((err) => {
                console.error("Error fetching cart items on visibility change:", err);
              });
          }
        }
      };

      // Listen for storage changes (cross-tab updates)
      const handleStorageChange = (e) => {
        if (e.key === "phone") {
          const newPhone = localStorage.getItem("phone");
          setPhone(newPhone);
          if (newPhone) {
            axios.post(api + "ready/cart-list", { phone: newPhone })
              .then((res) => {
                const cartData = res?.data?.data?.carts || res?.data?.carts || [];
                dispatch({ type: "SET_CART", payload: { cart: cartData } });
              })
              .catch((err) => {
                console.error("Error fetching cart items on storage change:", err);
              });
          } else {
            dispatch({ type: "SET_CART", payload: { cart: [] } });
          }
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("storage", handleStorageChange);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, [Phone]);

  return (
    <ReadyDesignCartSystem.Provider value={{ state, dispatch }}>
      {children}
    </ReadyDesignCartSystem.Provider>
  );
};
export default ReadyDesignCartProvider;

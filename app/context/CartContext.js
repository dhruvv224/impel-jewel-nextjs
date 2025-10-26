import React, { createContext, useEffect, useReducer } from "react";
import UserService from "../services/Cart";

export const CartSystem = createContext();

const initialState = {
  cart: [],
  cartItems: 0,
};

const Cart = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cart: action.payload.cart,
        cartItems: action.payload.cart?.reduce(
          (total, item) => total + item.quantity,
          0
        ),
      };
    case "ADD_TO_CART":
      const { design_id } = action.payload;
      const cartItem = state.cart.find((item) => item?.design_id === design_id);
      if (cartItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.design_id === design_id
              ? { ...item, quantity: item?.quantity + 1 }
              : item
          ),
          cartItems: state.cartItems + 1,
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { design_id, quantity: 1 }],
          cartItems: state.cartItems + 1,
        };
      }

    case "REMOVE_FROM_CART": {
      const { design_id } = action.payload;
      if (state.cartItems > 0) {
        return {
          ...state,
          cart: state?.cart?.filter((item) => item?.design_id !== design_id),
          cartItems: state.cartItems - 1,
        };
      }
    }

    case "RESET_CART":
      return {
        ...state,
        cartItems: 0,
      };

    default:
      return state;
  }
};


const CartProvider = ({ children }) => {
  const [Phone, setPhone] = React.useState(null);
  const [state, dispatch] = useReducer(Cart, initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPhone(localStorage.getItem("phone"));
    }
  }, []);

  const fetchCartData = async () => {
    try {
      if (Phone) {
        const res = await UserService.CartList({ phone: Phone });
        const cartData = res?.data?.cart_items || [];
        dispatch({ type: "SET_CART", payload: { cart: cartData } });
      }
    } catch (err) {
      console.error("Error fetching cart items:", err);
    }
  };

  useEffect(() => {
    if (Phone) {
      fetchCartData();
    }
  }, [Phone]);

  return (
    <CartSystem.Provider value={{ state, dispatch }}>
      {children}
    </CartSystem.Provider>
  );
};
export default CartProvider;

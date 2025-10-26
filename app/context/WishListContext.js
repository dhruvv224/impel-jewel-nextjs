import React, { createContext, useEffect, useReducer } from "react";
import Userservice from "../services/Auth";

export const WishlistSystem = createContext();

const initialState = {
  wishlist: [],
  wishlistItems: 0,
};

const Wishlist = (state, action) => {
  switch (action.type) {
    case "SET_WISHLIST":
      return {
        ...state,
        wishlist: action.payload.wishlist,
        wishlistItems: action.payload.wishlist?.reduce(
          (total, item) => total + item.quantity,
          0
        ),
      };
    case "ADD_TO_WISHLIST":
      const { design_id } = action.payload;
      const wishlistitem = state.wishlist?.find(
        (item) => item?.design_id === design_id
      );
      if (wishlistitem) {
        return {
          ...state,
          wishlist: state.wishlist?.map((item) =>
            item.design_id === design_id
              ? { ...item, quantity: item?.quantity + 1 }
              : item
          ),
          wishlistItems: state.wishlistItems + 1,
        };
      } else {
        return {
          ...state,
          wishlist: [...state.wishlist, { design_id, quantity: 1 }],
          wishlistItems: state.wishlistItems + 1,
        };
      }

    case "REMOVE_FROM_WISHLIST": {
      const { design_id } = action.payload;
      if (state.wishlistItems > 0) {
        return {
          ...state,
          wishlist: state?.wishlist?.filter(
            (item) => item?.design_id !== design_id
          ),
          wishlistItems: state.wishlistItems - 1,
        };
      }
    }

    default:
      return state;
  }
};


const WishlistProvider = ({ children }) => {
  const [Phone, setPhone] = React.useState(null);
  const [state, dispatch] = useReducer(Wishlist, initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPhone(localStorage.getItem("phone"));
    }
  }, []);

  const fetchWishlistData = async () => {
    try {
      if (Phone) {
        const res = await Userservice.userWishlist({ phone: Phone });
        const wishlistData = res?.data?.wishlist_items || [];
        dispatch({ type: "SET_WISHLIST", payload: { wishlist: wishlistData } });
      }
    } catch (err) {
      console.error("Error fetching wishlist items:", err);
    }
  };

  useEffect(() => {
    if (Phone) {
      fetchWishlistData();
    }
  }, [Phone]);

  return (
    <WishlistSystem.Provider value={{ state, dispatch }}>
      {children}
    </WishlistSystem.Provider>
  );
};
export default WishlistProvider;

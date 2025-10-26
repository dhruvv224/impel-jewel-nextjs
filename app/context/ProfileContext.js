import React, { createContext, useReducer } from "react";

export const ProfileSystem = createContext();

const initialState = {
  image: false,
  profilename: false,
};

const Profile = (state, action) => {
  switch (action.type) {
    case "SET_IMAGE":
      return {
        ...state,
        image: action?.payload?.image,
      };

    case "SET_NAME":
      return {
        ...state,
        profilename: action?.payload?.profilename,
      };

    default:
      return state;
  }
};

const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Profile, initialState);

  return (
    <ProfileSystem.Provider value={{ state, dispatch }}>
      {children}
    </ProfileSystem.Provider>
  );
};
export default ProfileProvider;

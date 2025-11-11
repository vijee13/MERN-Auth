import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const api = (path) => {
    // Fallback to relative /api when env is not provided
    const base = backendURL && backendURL.trim().length > 0 ? backendURL : "";
    return `${base}${path}`;
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(api(`/api/auth/is-auth`));
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggedin(false);
        return;
      }
      toast.error(error.response?.data?.message || error.message);
    }
  }
    

  const getUserData = async () => {
    try {
      const { data } = await axios.get(api(`/api/user/data`), {
        withCredentials: true,
      });
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        setUserData(null);
        return;
      }
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendURL,
    api,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
// export default AppContextProvider;

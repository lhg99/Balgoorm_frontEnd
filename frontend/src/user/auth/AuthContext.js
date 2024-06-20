import axios from 'axios';
import React, { useState, createContext, useContext } from 'react'
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setAuthToken = (token) => {
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict'});
    }

    const setUserRole = (role) => {
        Cookies.set('role', role, { expires: 7, secure: true, sameSite: 'Strict'});
    }

    const login = async (userData) => {
        const { userId, password } = userData;
        try {
            const response = await axios.post("http://localhost:8080/login", userData);
            const { token, role } = response.data;
            setAuthToken(token);
            setUserRole(role);
            setUser({ userId, role });
        } catch(error) {
            alert(error.response ? error.response.data : "로그인 실패");
        }
    }

    const logout = () => {
        Cookies.removeItem('token');
        Cookies.removeItem('role');
        setUser(null);
    }

    const value = { user, login, logout, setAuthToken, setUserRole };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
import axios from 'axios';
import React, { useState, createContext, useContext, useEffect } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    setAuthToken: () => {},
    setUserRole: () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const setAuthToken = (token) => {
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict'});
    }

    const setUserRole = (role) => {
        Cookies.set('role', role, { expires: 7, secure: true, sameSite: 'Strict'});
    }

    const login = async (userData, navigateCallback) => {
        setIsLoading(true);
        const { userId, password } = userData;
        try {
            const response = await axios.post("http://localhost:8080/login", userData);
            const { token, role } = response.data;
            setAuthToken(token);
            setUserRole(role);
            setUser({ userId: userData.userId, role });
            navigateCallback(role);
        } catch(error) {
            alert(error.response ? error.response.data : "로그인 실패");
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async() => {
        setIsLoading(true);
        try {
            await axios.post('http://localhost:8080/logout');
            Cookies.remove('token');
            Cookies.remove('role');
            setUser(null);
          } catch (error) {
            console.error('로그아웃 실패', error); 
          } finally {
            setIsLoading(false);
          }
    }

    const fetchUserInfo = async () => {
        const token = Cookies.get('token');
        if (!token) return;
        try {
            const response = await axios.get('http://localhost:8080/myinfo', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({
                userId: response.data.userId,
                nickname: response.data.nickname,
                email: response.data.email,
                role: Cookies.get('role')
            });
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
      const token = Cookies.get('token');
      const role = Cookies.get('role');
      if(token && role) {
        console.log('token and role is valid');
        fetchUserInfo();
      } else {
        setIsLoading(false);
      }
      
    }, []);
    
    const value = { user, login, logout, isLoading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
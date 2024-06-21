import axios from 'axios';
import React, { useState, createContext, useContext, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    setAuthToken: () => {},
    setUserRole: () => {},
    fetchUserInfo: () => {},
    isLoading: true,
});

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // userId와 role 저장
    const [isLoading, setIsLoading] = useState(true); // 로딩여부
    const [users, setUsers] = useState([]); // 유저 정보
    const [userCount, setUserCount] = useState(0); // 총 유저 수
    const [fetchedUser, setFetchedUser] = useState(null); // 패치한 유저 가져오기

    const setAuthToken = (token) => {
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict'});
    }

    const setUserRole = (role) => {
        Cookies.set('role', role, { expires: 7, secure: true, sameSite: 'Strict'});
    }

    // 로그인 로직, 토큰, 쿠키 설정
    const login = async (userData, navigateCallback) => {
        setIsLoading(true);
        try {
            console.log('logging information', userData);
            const response = await axios.post("http://localhost:8080/api/login", userData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
            }, withCredentials: true});
            
            console.log("response: ", response);
            console.log("response.data :", response.data);
            const { token, role } = response.data;
            setAuthToken(token);
            setUserRole(role);
            setUser({ "userId": userData.userId, "role": role, "id": response.data.userId });
            navigateCallback(role);
        } catch(error) {
            alert(error.response ? error.response.data : "로그인 실패");
        } finally {
            setIsLoading(false);
        }
    }

    // 로그아웃 로직, 토큰, 쿠키 삭제
    const logout = async (navigate) => {
        setIsLoading(true);
        try {
            await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true });
            Cookies.remove('token');
            Cookies.remove('role');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('로그아웃 실패', error);
            if(error.response) {
                alert("error: ", error.response.data);
            } else {
                alert("로그아웃 실패");
            }
        } finally {
            setIsLoading(false);
        }
    }

    // 유저 정보 가져오기
    const fetchUserInfo = async () => {
        const token = Cookies.get('token');
        if (!token) {
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/myinfo', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setFetchedUser({
                userId: response.data.userId,
                nickname: response.data.nickname,
                email: response.data.email,
                createDate: response.data.createDate,
                role: Cookies.get('role')
            });
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 모든 유저 정보 가져오기
    const fetchUsers = useCallback(async() => {
        try {
          const response = await axios.get('http://localhost:8080/api/admin/all');
          setUsers(response.data);
        } catch (error) {
          console.error("error", error);
        }
      }, []);

      // 총 유저 수 가져오기
      const fetchCount = useCallback(async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/admin/totalUsers');
          setUserCount(response.data.count); // count: num 형태로 저장되있을 때
        } catch (error) {
          console.error('총 회원수 가져오기 실패', error);
        }
      }, []);

    useEffect(() => {
        fetchUserInfo();
    }, []);
    
    const value = { user, users, setUsers, login, logout, isLoading, fetchUserInfo, fetchUsers, fetchCount, setFetchedUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
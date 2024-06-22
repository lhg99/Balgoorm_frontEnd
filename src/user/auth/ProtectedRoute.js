/**
 * 로그인한 사용자 확인하는 코드
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.js';

function ProtectedRoute({ children}) {
    const { fetchedUser, isLoading, loadUserInfo } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!fetchedUser && !isLoading) {
            loadUserInfo();
        }
    }, [fetchedUser, isLoading, loadUserInfo]);

    if(isLoading) {
        return <div>Loading...</div>;
    }


    if(!fetchedUser) {
        console.log("redirect to login, no user found.");
        return(
            <Navigate to="/login" state={{from: location}}></Navigate>
        )
    }

    return children;
}

export default ProtectedRoute;
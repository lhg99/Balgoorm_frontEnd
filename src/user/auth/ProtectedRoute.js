/**
 * 로그인한 사용자 확인하는 코드
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.js';

function ProtectedRoute({ children}) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if(isLoading) {
        return <div>Loading...</div>;
    }

    if(!user) {
        console.log("Redirecting to login, no user found.");
        // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
        return (
            <Navigate to="/login" state={{ from: location }} replace />
        );
    }
    
    return children;
}

export default ProtectedRoute;
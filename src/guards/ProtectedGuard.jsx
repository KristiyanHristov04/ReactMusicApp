import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function ProtectedGuard({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useContext(AuthContext);

    const location = useLocation();

    useEffect(() => {
        console.log('ProtectedGuard');
        async function checkAuth() {
            const { data, error } = await supabase.auth.getUser();

            if (!data.user) {
                setAuthenticated(false);
            } else {
                setAuthenticated(true);
                setUser({
                    email: data.user.email,
                    id: data.user.id
                });
            }

            
            setIsLoading(false);
        }

        checkAuth();
    }, [location]);

    if (isLoading) {
        return null;
    }
    
    if (!authenticated) {
        console.log('Not authenticated');
        return (
            <Navigate to='/login' />
        );
    }   

    console.log('Authenticated');
    return children;
}

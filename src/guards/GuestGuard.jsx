import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Spinner from "../spinner/Spinner";
import styles from './GuestGuard.module.css';

export default function GuestGuard({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        async function checkAuth() {
            try {
                const { data: { user: currentUser }, error } = await supabase.auth.getUser();

                if (error) {
                    throw new Error(error.message);
                }

                if (currentUser) {
                    setAuthenticated(true);
                    setUser({
                        email: currentUser.email,
                        id: currentUser.id
                    });
                } else {
                    setAuthenticated(false);
                    setUser({
                        email: null,
                        id: null
                    });
                }
            } catch (error) {
                console.error(error.message);
                setAuthenticated(false);
                setUser({
                    email: null,
                    id: null
                });
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Spinner />
            </div>
        );
    }
    
    if (authenticated) {
        return <Navigate to="/" replace />;
    }   

    return children;
}

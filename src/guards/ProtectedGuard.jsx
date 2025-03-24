import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import styles from './ProtectedGuard.module.css';

export default function ProtectedGuard({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useContext(AuthContext);

    const location = useLocation();

    useEffect(() => {
        console.log('ProtectedGuard useEffect');
        async function checkAuth() {
            try {
                const { data, error } = await supabase.auth.getSession();
                //const { data, error } = await supabase.auth.getUser();
                console.log(data);
                console.log(error);
                if (error) {
                    throw new Error(error.message);
                }

                if (!data.session?.user) {
                    setAuthenticated(false);
                } else {
                    setAuthenticated(true);
                    setUser({
                        email: data.session.user.email,
                        id: data.session.user.id
                    });
                }
            } catch (e) {
                console.error(e.message);
                setAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, [location]);

    if (isLoading) {
        return <main className={styles.loadingContainer}></main>
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

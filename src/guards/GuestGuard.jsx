import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import styles from './GuestGuard.module.css';
import Navigation from "../components/navigation/Navigation";

export default function GuestGuard({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        async function checkAuth() {
            console.log('GuestGuard useEffect');
            try {
                //const { data: { user: currentUser }, error } = await supabase.auth.getUser();
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    throw new Error(error.message);
                }

                if (data.session?.user) {
                    setAuthenticated(true);
                    setUser({
                        email: data.session.user.email,
                        id: data.session.user.id
                    });
                } else {
                    setAuthenticated(false);
                    setUser({});
                }
            } catch (error) {
                console.error(error.message);
                setAuthenticated(false);
                setUser({});
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, [location]);

    if (isLoading) {
        return (
            <main className={styles.loadingContainer}></main>
        )

    }

    if (authenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}

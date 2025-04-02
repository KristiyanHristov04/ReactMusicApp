import { createContext } from "react";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();

                console.log(data);
                console.log(error);
                if (error || !data.user) {
                    throw new Error('User is not logged in.');
                }

                console.log(data.user.id);
                console.log(data.user.email);
                setUser({
                    email: data.user.email,
                    id: data.user.id
                });
            } catch (e) {
                console.error(e.message);
            }
        }
        
        getUser();

    }, []);

    return (
        <AuthContext.Provider value={[user, setUser]}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
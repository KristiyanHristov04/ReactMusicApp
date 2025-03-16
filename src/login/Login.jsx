import { useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import styles from './Login.module.css'
import { supabase } from "../supabase";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [user, setUser] = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    console.log(user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.id) {
          console.log("User is authenticated, redirecting...");
          navigate("/");
        } else {
          setIsLoading(false);
        }
      }, [user, navigate]);

    const changeHandler = (e) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        console.log('Logging in');

        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
        });

        if (error) {
            console.error(error.message);
            return;
        }

        setUser({
            email: data.user.email,
            id: data.user.id
        });
        console.log(data);
        navigate('/');
    }

    return (
        <>
            <Navigation showSearchBar={false} />
            {!isLoading && !user.id && <>
                <main className={styles["main"]}>
                    <form onSubmit={submitHandler}>
                        <label htmlFor="email">Email: </label>
                        <input onChange={changeHandler} type="email" placeholder="user@example.com" id="email" name="email" value={formData.email} />
                        <label htmlFor="password">Email: </label>
                        <input onChange={changeHandler} type="password" placeholder="******" id="password" name="password" value={formData.password} />
                        <button>Login</button>
                    </form>
                </main>
            </>}
        </>
    );
}
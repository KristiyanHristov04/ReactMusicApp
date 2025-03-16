import { useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import styles from './SignUp.module.css'
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function SignUp() {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [user, setUser] = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.id) {
            navigate('/');
        }
    });

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

        if (formData.password !== formData.confirmPassword) {
            console.log('Password mismatch');
        } else {
            console.log('Signing up');

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password
            });

            if (error) {
                console.error(error.message);
                return;
            }

            console.log(data);
            setUser({
                email: data.user.email,
                id: data.user.id
            });
            navigate('/');
        }
    }

    return (
        <>
            <Navigation showSearchBar={false} />
            {!user.id && <>
                <main className={styles["main"]}>
                    <form onSubmit={submitHandler}>
                        <label htmlFor="email">Email: </label>
                        <input onChange={changeHandler} type="email" placeholder="user@example.com" id="email" name="email" value={formData.email} />
                        <label htmlFor="password">Password: </label>
                        <input onChange={changeHandler} type="password" placeholder="******" id="password" name="password" value={formData.password} />
                        <label htmlFor="confirm-password">Confirm Password: </label>
                        <input onChange={changeHandler} type="password" placeholder="******" id="confirm-password" name="confirmPassword" value={formData.confirmPassword} />
                        <button>Sign up</button>
                    </form>
                </main>
            </>}

        </>
    );
}
import { useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import styles from './Login.module.css'
import { supabase } from "../supabase";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";

export default function Login() {
    const [user, setUser] = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.id) {
            navigate("/");
        } else {
            setIsLoading(false);
        }
    }, [user, navigate]);

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .required('Please enter your email address.')
            .email('Please enter a valid email address.'),
        password: Yup.string()
            .required('Please enter your password.')
            .min(6, 'Password must be at least 6 symbols.')
    });

    const submitHandler = async (e) => {
        try {
            setError(null);
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formik.values.email,
                password: formik.values.password
            });

            if (error) {
                throw new Error(error.message);
            }

            setUser({
                email: data.user.email,
                id: data.user.id
            });
            navigate('/');
        } catch (e) {
            setError(e.message);
            console.error(e.message);
        }
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: SignupSchema,
        onSubmit: submitHandler
    });

    if (isLoading) {
        return null;
    }

    return (
        <>
            <Navigation showSearchBar={false} />
            <main className={styles["main"]}>
                <div className={styles["form-container"]}>
                    <h1 className={styles["title"]}>Welcome <span>Back</span></h1>
                    {error && <div className={styles["error"]}>{error}</div>}
                    <form onSubmit={formik.handleSubmit} className={styles["form"]}>
                        <div className={styles["input-group"]}>
                            <MDBInput
                                label="Email"
                                id="email"
                                name="email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                contrast
                            />
                            {formik.touched.email && formik.errors.email && <span className={styles["error"]}>{formik.errors.email}</span>}
                        </div>

                        <div className={styles["input-group"]}>
                            <MDBInput
                                label="Password"
                                id="password"
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                contrast
                            />
                            {formik.touched.password && formik.errors.password && <span className={styles["error"]}>{formik.errors.password}</span>}
                        </div>

                        <MDBBtn type="submit">Login</MDBBtn>
                    </form>
                </div>
            </main>
        </>
    );
}
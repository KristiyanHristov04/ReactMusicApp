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
            console.log(data);
            navigate('/');
        } catch (e) {
            console.error(e.message);
        }

    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: SignupSchema,
        onSubmit: submitHandler
    });

    return (
        <>
            <Navigation showSearchBar={false} />
            {!isLoading && !user.id && <>
                <main className={styles["main"]}>
                    <MDBContainer fluid>
                        <form onSubmit={formik.handleSubmit} className={styles["form"]}>
                            <div>
                                <MDBInput
                                    label="Email"
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.email && formik.errors.email && <span className={styles["error"]}>{formik.errors.email}</span>}
                            </div>

                            <div>
                                <MDBInput
                                    label="Password"
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.password && formik.errors.password && <span className={styles["error"]}>{formik.errors.password}</span>}
                            </div>

                            <MDBBtn type="submit">Login</MDBBtn>
                        </form>
                    </MDBContainer>
                </main>
            </>}
        </>
    );
}
import { useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import styles from './SignUp.module.css'
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { MDBInput, MDBBtn, MDBContainer } from 'mdb-react-ui-kit';
import { useFormik } from "formik";
import * as Yup from 'yup';

export default function SignUp() {

    const [user, setUser] = useContext(AuthContext);
    const navigate = useNavigate();

    //Extract logic in Route Guard
    useEffect(() => {
        if (user.id) {
            navigate('/');
        }
    }, []);

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .required('Please enter your email address.')
            .email('Please enter a valid email address.'),
        password: Yup.string()
            .required('Please enter your password.')
            .min(6, 'Password must be at least 6 symbols.'),
        confirmPassword: Yup.string()
            .required('Please enter your password.')
            .oneOf([Yup.ref('password'), null], 'Passwords do not match.')
    });

    const submitHandler = async () => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formik.values.email,
                password: formik.values.password
            });

            if (error) {
                throw new Error(error.message);
            }

            console.log(data);
            setUser({
                email: data.user.email,
                id: data.user.id
            });
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
            {!user.id && <>
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

                            <div>
                                <MDBInput
                                    label="Cofirm Password"
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword && <span className={styles["error"]}>{formik.errors.confirmPassword}</span>}
                            </div>

                            <MDBBtn type="submit">SignUp</MDBBtn>
                        </form>
                    </MDBContainer>
                </main>
            </>}

        </>
    );
}
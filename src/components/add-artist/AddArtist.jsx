import Navigation from "../navigation/Navigation";
import styles from './AddArtist.module.css';
import { supabase } from "../../supabase";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { MDBInput, MDBBtn, MDBTextArea, MDBFile } from "mdb-react-ui-kit";
import ScrollToTopButton from "../scroll-to-top-button/ScrollToTopButton";
import { useResetScroll } from "../../hooks/useResetScroll";
import { CreateSchema } from "../../schemas/addArtistSchema";
import { addArtistImage, getArtistImageUrl, createArtist } from "../../services/addArtistService";
export default function AddArtist() {
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();

    useResetScroll();

    async function submitHandler(values, actions) {
        try {
            const fileName = Date.now();

            const artistImageData = await addArtistImage(fileName, values.artistImage);
            const artistImageUrl = getArtistImageUrl(artistImageData.path);
            await createArtist(values.name, values.biography, artistImageUrl, fileName, user.id);

            actions.resetForm();
            navigate('/', { state: { message: "Artist added successfully!", variant: "success" } });
        } catch (error) {
            console.error(error.message);
        } finally {
            actions.setSubmitting(false);
        }
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            artistImage: null,
            biography: ''
        },
        validationSchema: CreateSchema,
        onSubmit: submitHandler
    });

    return (
        <>
            <Navigation />
            {user.id && (
                <main className={styles["main"]}>
                    <div className={styles["form-container"]}>
                        <h1 className={styles["title"]}>Add Your <span>Favorite</span> Artist</h1>
                        <form onSubmit={formik.handleSubmit} className={styles["form"]}>
                            <div className={styles["input-group"]}>
                                <MDBInput
                                    className={styles["input"]}
                                    label="Artist"
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <span className={styles["error"]}>{formik.errors.name}</span>
                                )}
                            </div>

                            <div className={styles["input-group"]}>
                                <MDBFile
                                    className={styles["input"]}
                                    accept="image/*"
                                    label="Artist Image"
                                    id="artist-image"
                                    name="artistImage"
                                    type="file"
                                    onChange={(e) => formik.setFieldValue('artistImage', e.target.files[0])}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.artistImage && formik.errors.artistImage && (
                                    <span className={styles["error"]}>{formik.errors.artistImage}</span>
                                )}
                            </div>

                            <div className={styles["input-group"]}>
                                <MDBTextArea
                                    className={styles["textarea"]}
                                    rows={10}
                                    label="Biography"
                                    id="biography"
                                    name="biography"
                                    value={formik.values.biography}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.biography && formik.errors.biography && (
                                    <span className={styles["error"]}>{formik.errors.biography}</span>
                                )}
                            </div>

                            <MDBBtn type="submit" disabled={formik.isSubmitting} className={styles["button"]}>
                                Add Artist
                            </MDBBtn>
                        </form>
                    </div>
                    <ScrollToTopButton />
                </main>
            )}
        </>
    );
}

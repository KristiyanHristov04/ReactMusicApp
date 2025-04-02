import Navigation from "../navigation/Navigation";
import styles from './AddArtist.module.css';
import { supabase } from "../../supabase";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { MDBInput, MDBBtn, MDBTextArea, MDBFile } from "mdb-react-ui-kit";
import ScrollToTopButton from "../scroll-to-top-button/ScrollToTopButton";
import { useResetScroll } from "../../hooks/useResetScroll";
import { CreateSchema } from "../../schemas/addArtistSchema";

export default function AddArtist() {
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();

    useResetScroll();

    async function submitHandler(values, actions) {
        try {
            const fileName = Date.now();

            const { data: artistImageData, error: artistImageError } = await supabase.storage
                .from('song-files')
                .upload(`artist-images/${fileName}`, values.artistImage);

            if (artistImageError) {
                throw new Error(artistImageError.message);
            }

            const artistImageUrl = supabase.storage.from('song-files').getPublicUrl(artistImageData.path).data.publicUrl;

            const { data: artistData, error: artistError } = await supabase
                .from('artists')
                .insert([
                    {
                        name: values.name,
                        artist_image_url: artistImageUrl,
                        biography: values.biography,
                        file_name: fileName,
                        user_id: user.id
                    }
                ])
                .select();

            if (artistError) {
                throw new Error(artistError.message);
            }

            console.log("Artist added successfully!", artistData); 
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

import Navigation from "../navigation/Navigation";
import styles from './EditArtist.module.css';
import { supabase } from "../../supabase";
import { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Spinner from "../../components/spinner/Spinner";
import { MDBInput, MDBBtn, MDBTextArea, MDBFile } from "mdb-react-ui-kit";
import ScrollToTopButton from "../../components/scroll-to-top-button/ScrollToTopButton";
import { useResetScroll } from "../../hooks/useResetScroll";
import { EditSchema } from "../../schemas/editArtistSchema";
import { getArtistInformation, addArtistImage, getArtistImageUrl, editArtist, deleteArtistImage } from "../../services/editArtistService";

export default function EditArtist() {
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const deleteFileNameRef = useRef('');

    useResetScroll();

    async function submitHandler(values, actions) {
        try {
            const fileName = Date.now();

            const artistImageData = await addArtistImage(fileName, values.artistImage);

            const artistImageUrl = getArtistImageUrl(artistImageData.path);

            const editedArtistData = await editArtist(params.id, values.name, values.biography, artistImageUrl, user.id, fileName);

            await deleteArtistImage(deleteFileNameRef.current);

            // console.log("Artist edited successfully!", editedArtistData);
            actions.resetForm();
            navigate('/', { state: { message: "Artist edited successfully!", variant: "success" } });
        } catch (error) {
            console.error(error.message);
        } finally {
            actions.setSubmitting(false);
        }
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            biography: '',
            artistImage: null,
        },
        validationSchema: EditSchema,
        onSubmit: submitHandler
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const artistInformation = await getArtistInformation(params.id);

                if (artistInformation.length === 0) {
                    navigate('/', { state: { message: "Artist doesn't exist!", variant: "danger" } });
                    return;
                }

                if (artistInformation[0].user_id !== user.id) {
                    navigate('/', { state: { message: "You do not have permission to this artist!", variant: "warning" } });
                    return;
                }

                formik.setValues({
                    name: artistInformation[0].name,
                    biography: artistInformation[0].biography
                });

                deleteFileNameRef.current = artistInformation[0].file_name;
                setIsLoading(false);
            } catch (e) {
                console.error(e.message);
                navigate('/', { state: { message: "Something went wrong!", variant: "danger" } });
            }
        }

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <>
                <Navigation showSearchBar={false} />
                <main className={styles["main"]}>
                    <Spinner />
                </main>
            </>
        );
    }

    return (
        <>
            <Navigation />
            {user.id && (
                <main className={styles["main"]}>
                    <div className={styles["form-container"]}>
                        <h1 className={styles["title"]}><span>Edit</span> Artist</h1>
                        <form onSubmit={formik.handleSubmit} className={styles["form"]}>
                            <div className={styles["input-group"]}>
                                <MDBInput
                                    className={styles["input"]}
                                    label="Name"
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
                                    id="artistImage"
                                    name="artistImage"
                                    type="file"
                                    onChange={(e) => formik.setFieldValue('artistImage', e.target.files[0])}
                                    onBlur={formik.handleBlur}
                                />
                                {(formik.touched.artistImage || formik.submitCount > 0) && formik.errors.artistImage && (
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

                            <MDBBtn type="submit" disabled={formik.isSubmitting}>
                                Edit Artist
                            </MDBBtn>
                        </form>
                    </div>
                    <ScrollToTopButton />
                </main>
            )}
        </>
    );
}

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

export default function EditArtist() {
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const deleteFileNameRef = useRef('');

    useResetScroll();

    const EditSchema = Yup.object().shape({
        name: Yup.string().required('Please enter song name.'),
        biography: Yup.string().required('Please enter song lyrics.'),
        artistImage: Yup.mixed().required('Please upload image of the song.'),
    });

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

            const { data: editedArtistData, error: editedArtistError } = await supabase
                .from('artists')
                .update(
                    {
                        name: values.name,
                        biography: values.biography,
                        artist_image_url: artistImageUrl,
                        user_id: user.id,
                        file_name: fileName
                    }
                )
                .eq('id', params.id);

            if (editedArtistError) {
                throw new Error(editedArtistError.message);
            }

            const { error: filesDeleteError } = await supabase.storage
                .from('song-files')
                .remove([`artist-images/${deleteFileNameRef.current}`])

            if (filesDeleteError) {
                throw new Error(error.message);
            }

            console.log("Artist edited successfully!", editedArtistData);
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
        async function getArtistInformation() {
            try {
                const { data: artistInformation, error: errorArtistInformation } = await supabase.from('artists')
                    .select()
                    .eq('id', params.id);

                if (errorArtistInformation) {
                    throw new Error(errorArtistInformation.message);
                }

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

        getArtistInformation();
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
                                    id="artist"
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

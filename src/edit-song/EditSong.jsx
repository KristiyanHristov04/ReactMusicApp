import Navigation from "../navigation/Navigation";
import styles from './EditSong.module.css';
import { supabase } from "../supabase";
import { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Spinner from "../spinner/Spinner";
import { MDBInput, MDBBtn, MDBTextArea, MDBFile } from "mdb-react-ui-kit";
import ScrollToTopButton from "../scroll-to-top-button/ScrollToTopButton";

export default function EditSong() {
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const deleteFileNameRef = useRef('')

    const SignupSchema = Yup.object().shape({
        name: Yup.string().required('Please enter song name.'),
        artist: Yup.string().required('Please enter artist name.'),
        lyrics: Yup.string().required('Please enter song lyrics.'),
        song: Yup.mixed().required('Please upload audio of the song.'),
        songImage: Yup.mixed().required('Please upload image of the song.'),
        artistImage: Yup.mixed().required('Please upload image of the artist.'),
    });

    async function submitHandler(values, actions) {
        console.log(values);

        try {
            const fileName = Date.now();
            const songFileName = fileName;
            const songImageName = fileName;
            const artistImageName = fileName;

            console.log(songFileName, songImageName, artistImageName);

            // Upload audio file
            const { data: songData, error: songError } = await supabase.storage
                .from('song-files')
                .upload(`song-audios/${songFileName}`, values.song);

            if (songError) {
                throw new Error(songError.message);
            }

            // Upload song image
            const { data: songImageData, error: songImageError } = await supabase.storage
                .from('song-files')
                .upload(`song-images/${songImageName}`, values.songImage);

            if (songImageError) {
                throw new Error(songImageError.message);
            }

            // Upload artist image
            const { data: artistImageData, error: artistImageError } = await supabase.storage
                .from('song-files')
                .upload(`artist-images/${artistImageName}`, values.artistImage);

            if (artistImageError) {
                throw new Error(artistImageError.message);
            }

            const songUrl = supabase.storage.from('song-files').getPublicUrl(songData.path).data.publicUrl;
            const songImageUrl = supabase.storage.from('song-files').getPublicUrl(songImageData.path).data.publicUrl;
            const artistImageUrl = supabase.storage.from('song-files').getPublicUrl(artistImageData.path).data.publicUrl;

            // Insert song data into the database
            const { data, error } = await supabase
                .from('songs')
                .update(
                    {
                        name: values.name,
                        artist: values.artist,
                        lyrics: values.lyrics,
                        song_url: songUrl,
                        song_image_url: songImageUrl,
                        artist_image_url: artistImageUrl,
                        user_id: user.id,
                        file_name: fileName
                    }
                )
                .eq('id', params.id);

            if (error) {
                throw new Error(error.message);
            }

            const { error: filesDeleteError } = await supabase.storage
                .from('song-files')
                .remove([`song-audios/${deleteFileNameRef.current}`,
                `song-images/${deleteFileNameRef.current}`,
                `artist-images/${deleteFileNameRef.current}`
                ]);

            if (filesDeleteError) {
                throw new Error(error.message);
            }

            console.log("Song edited successfully!", data);
            actions.resetForm();
            navigate('/');
        } catch (error) {
            console.error(error.message);
        } finally {
            actions.setSubmitting(false);
        }
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            artist: '',
            lyrics: '',
            song: null,
            songImage: null,
            artistImage: null
        },
        validationSchema: SignupSchema,
        onSubmit: submitHandler
    });

    useEffect(() => {
        async function getSongInformation() {
            try {
                const { data, error } = await supabase.from('songs')
                    .select()
                    .eq('id', params.id);

                if (error) {
                    throw new Error(error.message);
                }

                if (data.length === 0) {
                    navigate('/');
                    return;
                }

                if (data[0].user_id !== user.id) {
                    navigate('/');
                    return;
                }

                formik.setValues(prevValues => ({
                    ...prevValues,
                    name: data[0].name,
                    artist: data[0].artist,
                    lyrics: data[0].lyrics
                }));

                deleteFileNameRef.current = data[0].file_name;

                setIsLoading(false);
            } catch (e) {
                console.error(e.message);
            }
        }

        getSongInformation();
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
                        <h1 className={styles["title"]}><span>Edit</span> Song</h1>
                        <form onSubmit={formik.handleSubmit} className={styles["form"]}>
                            <div className={styles["input-group"]}>
                                <MDBInput
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
                                <MDBInput
                                    label="Artist"
                                    id="artist"
                                    name="artist"
                                    type="text"
                                    value={formik.values.artist}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.artist && formik.errors.artist && (
                                    <span className={styles["error"]}>{formik.errors.artist}</span>
                                )}
                            </div>

                            <div className={styles["input-group"]}>
                                <MDBTextArea
                                    rows={10}
                                    label="Lyrics"
                                    id="lyrics"
                                    name="lyrics"
                                    value={formik.values.lyrics}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.lyrics && formik.errors.lyrics && (
                                    <span className={styles["error"]}>{formik.errors.lyrics}</span>
                                )}
                            </div>

                            <div className={styles["input-group"]}>
                                <MDBFile
                                    accept="audio/*"
                                    label="Song"
                                    id="song"
                                    name="song"
                                    type="file"
                                    onChange={(e) => formik.setFieldValue('song', e.target.files[0])}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.song && formik.errors.song && (
                                    <span className={styles["error"]}>{formik.errors.song}</span>
                                )}
                            </div>

                            <div className={styles["input-group"]}>
                                <MDBFile
                                    accept="image/*"
                                    label="Song Image"
                                    id="song-image"
                                    name="songImage"
                                    type="file"
                                    onChange={(e) => formik.setFieldValue('songImage', e.target.files[0])}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.songImage && formik.errors.songImage && (
                                    <span className={styles["error"]}>{formik.errors.songImage}</span>
                                )}
                            </div>

                            <div className={styles["input-group"]}>
                                <MDBFile
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

                            <MDBBtn type="submit" disabled={formik.isSubmitting}>
                                Edit Song
                            </MDBBtn>
                        </form>
                    </div>
                    <ScrollToTopButton />
                </main>
            )}
        </>
    );
}

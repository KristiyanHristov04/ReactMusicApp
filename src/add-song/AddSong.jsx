import Navigation from "../navigation/Navigation";
import styles from './AddSong.module.css';
import { supabase } from "../supabase";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { MDBInput, MDBBtn, MDBTextArea, MDBFile } from "mdb-react-ui-kit";

export default function AddSong() {
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();

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
            const songFileName = `${Date.now()}-${values.song.name}`;
            const songImageName = `${Date.now()}-${values.songImage.name}`;
            const artistImageName = `${Date.now()}-${values.artistImage.name}`;

            console.log(songFileName, songImageName, artistImageName);

            // Upload audio file
            const { data: songData, error: songError } = await supabase.storage
                .from('song-files')
                .upload(`song-audios/${songFileName}`, values.song);
            if (songError) throw songError;

            // Upload song image
            const { data: songImageData, error: songImageError } = await supabase.storage
                .from('song-files')
                .upload(`song-images/${songImageName}`, values.songImage);
            if (songImageError) throw songImageError;

            // Upload artist image
            const { data: artistImageData, error: artistImageError } = await supabase.storage
                .from('song-files')
                .upload(`artist-images/${artistImageName}`, values.artistImage);
            if (artistImageError) throw artistImageError;

            const songUrl = supabase.storage.from('song-files').getPublicUrl(songData.path).data.publicUrl;
            const songImageUrl = supabase.storage.from('song-files').getPublicUrl(songImageData.path).data.publicUrl;
            const artistImageUrl = supabase.storage.from('song-files').getPublicUrl(artistImageData.path).data.publicUrl;

            // Insert song data into the database
            const { data, error } = await supabase
                .from('songs')
                .insert([
                    {
                        name: values.name,
                        artist: values.artist,
                        lyrics: values.lyrics,
                        song_url: songUrl,
                        song_image_url: songImageUrl,
                        artist_image_url: artistImageUrl,
                        user_id: user.id
                    }
                ]);
            if (error) throw error;

            console.log("Song added successfully!", data);
            actions.resetForm();
            navigate('/');
        } catch (error) {
            console.error("Error uploading song:", error.message);
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

    return (
        <>
            <Navigation />
            {user.id && (
                <main className={styles["main"]}>
                    <div className={styles["form-container"]}>
                        <h1 className={styles["title"]}>Add Your <span>Favorite</span> Song</h1>
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
                                Add Song
                            </MDBBtn>
                        </form>
                    </div>
                </main>
            )}
        </>
    );
}

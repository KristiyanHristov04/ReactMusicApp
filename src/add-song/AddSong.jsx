import { useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import styles from './AddSong.module.css';
import { supabase } from "../supabase";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { MDBContainer, MDBInput, MDBBtn, MDBTextArea, MDBFile } from "mdb-react-ui-kit";

export default function AddSong() {
    const [user, setUser] = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const validateUser = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                console.log('User not logged in.')
                setUser({});
                navigate('/login');
            }
        };

        validateUser();
    }, []);

    const SignupSchema = Yup.object().shape({
        name: Yup.string()
            .required('Please enter song name.'),
        artist: Yup.string()
            .required('Please enter artist name.'),
        lyrics: Yup.string()
            .required('Please enter song lyrics.'),
        song: Yup.mixed()
            .required('Please upload audio of the song.'),
        songImage: Yup.mixed()
            .required('Please upload image of the song.'),
        artistImage: Yup.mixed()
            .required('Please upload iamge of the artist.'),
    });

    async function submitHandler(e) {
        e.preventDefault();

        try {
            const songFileName = `${Date.now()}-${formik.values.song.name}`;
            const songImageName = `${Date.now()}-${formik.values.songImage.name}`;
            const artistImageName = `${Date.now()}-${formik.values.artistImage.name}`;

            console.log(songFileName);

            const { data: songData, error: songError } = await supabase.storage
                .from('song-files')
                .upload(`song-audios/${songFileName}`, formik.values.song);

            console.log(songData);

            if (songError) throw songError;

            const { data: songImageData, error: songImageError } = await supabase.storage
                .from('song-files')
                .upload(`song-images/${songImageName}`, formik.values.songImage);

            console.log(songImageData);

            if (songImageError) throw songImageError;

            const { data: artistImageData, error: artistImageError } = await supabase.storage
                .from('song-files')
                .upload(`artist-images/${artistImageName}`, formik.values.artistImage);

            console.log(artistImageData);

            if (artistImageError) throw artistImageError;

            console.log(songData.path);
            const songUrl = supabase.storage.from('song-files').getPublicUrl(songData.path).data.publicUrl;
            console.log(songUrl);
            const songImageUrl = supabase.storage.from('song-files').getPublicUrl(songImageData.path).data.publicUrl;
            const artistImageUrl = supabase.storage.from('song-files').getPublicUrl(artistImageData.path).data.publicUrl;

            const { data, error } = await supabase
                .from('songs')
                .insert([
                    {
                        name: formik.values.name,
                        artist: formik.values.artist,
                        lyrics: formik.values.lyrics,
                        song_url: songUrl,
                        song_image_url: songImageUrl,
                        artist_image_url: artistImageUrl,
                        user_id: user.id
                    }
                ]);

            if (error) throw error;

            console.log("Song added successfully!", data);

        } catch (error) {
            console.error("Error uploading song:", error.message);
        }
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            artist: '',
            lyrics: '',
            song: '',
            songImage: '',
            artistImage: ''
        },
        validationSchema: SignupSchema,
        onSubmit: submitHandler
    });

    return (
        <>
            <Navigation />
            {user.id && <>
                <main className={styles["main"]}>
                    <MDBContainer fluid>
                        <form onSubmit={formik.handleSubmit} className={styles["form"]}>
                            <div>
                                <MDBInput
                                    label="Name"
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.name && formik.errors.name && <span className={styles["error"]}>{formik.errors.name}</span>}
                            </div>

                            <div>
                                <MDBInput
                                    label="Artist"
                                    id="artist"
                                    name="artist"
                                    type="text"
                                    value={formik.values.artist}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.artist && formik.errors.artist && <span className={styles["error"]}>{formik.errors.artist}</span>}
                            </div>

                            <div>
                                <MDBTextArea
                                    rows={10}
                                    label="Lyrics"
                                    id="lyrics"
                                    name="lyrics"
                                    value={formik.values.lyrics}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.lyrics && formik.errors.lyrics && <span className={styles["error"]}>{formik.errors.lyrics}</span>}
                            </div>

                            <div>
                                <MDBFile
                                    label="Song"
                                    id="song"
                                    name="song"
                                    type="file"
                                    value={formik.values.song}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.song && formik.errors.song && <span className={styles["error"]}>{formik.errors.song}</span>}
                            </div>

                            <div>
                                <MDBFile
                                    label="Song Image"
                                    id="song-image"
                                    name="songImage"
                                    type="file"
                                    value={formik.values.songImage}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.songImage && formik.errors.songImage && <span className={styles["error"]}>{formik.errors.songImage}</span>}
                            </div>

                            <div>
                                <MDBFile
                                    label="Artist Image"
                                    id="artist-image"
                                    name="artistImage"
                                    type="file"
                                    value={formik.values.artistImage}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.artistImage && formik.errors.artistImage && <span className={styles["error"]}>{formik.errors.artistImage}</span>}
                            </div>

                            <MDBBtn type="submit">Add Song</MDBBtn>
                        </form>
                    </MDBContainer>
                </main></>}
        </>
    );
}

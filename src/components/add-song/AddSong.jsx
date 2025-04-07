import Navigation from "../navigation/Navigation";
import styles from './AddSong.module.css';
import { supabase } from "../../supabase";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { MDBInput, MDBBtn, MDBTextArea, MDBFile } from "mdb-react-ui-kit";
import ScrollToTopButton from "../scroll-to-top-button/ScrollToTopButton";
import { useResetScroll } from "../../hooks/useResetScroll";
import Select from 'react-select'
import Spinner from "../spinner/Spinner";
import { customStyles } from "../../common/addSongSelectStyles";
import { CreateSchema } from "../../schemas/addSongSchema";
import { getArtists, addSongAudio, addSongImage, getSongFileUrl, createSong, addSongArtist } from "../../services/addSongService";


export default function AddSong() {
    const [user] = useContext(AuthContext);
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useResetScroll();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const artists = await getArtists();
                setArtists(artists);
                setIsLoading(false);
            } catch (error) {
                console.error(error.message);
                navigate('/', { state: { message: "Something went wrong!", variant: "danger" } });
            }
        }

        fetchData();
    }, []);

    async function submitHandler(values, actions) {
        try {
            const fileName = Date.now();

            const songData = await addSongAudio(fileName, values.song);

            const songImageData = await addSongImage(fileName, values.songImage);

            const songUrl = getSongFileUrl(songData.path);
            const songImageUrl = getSongFileUrl(songImageData.path);

            const createdSongData = await createSong(values.name, values.lyrics, songUrl, songImageUrl, user.id, fileName);

            for (const artist of values.selectedArtists) {
                // console.log(artist);    
                await addSongArtist(createdSongData[0].id, artist.value);
            }

            // console.log("Song added successfully!", createdSongData);
            actions.resetForm();
            navigate('/', { state: { message: "Song added successfully!", variant: "success" } });
        } catch (error) {
            console.error(error.message);
            navigate('/', { state: { message: "Something went wrong!", variant: "danger" } });
        } finally {
            actions.setSubmitting(false);
        }
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            lyrics: '',
            song: null,
            songImage: null,
            selectedArtists: []
        },
        validationSchema: CreateSchema,
        onSubmit: submitHandler
    });

    if (isLoading) {
        return (
            <>
                <Navigation showSearchBar={false} />
                <main className={styles.main}>
                    <Spinner />
                </main>
            </>
        )
    }

    return (
        <>
            <Navigation />
            {user.id && (
                <main className={styles["main"]}>
                    <div className={styles["form-container"]}>
                        <h1 className={styles["title"]}>Add Your <span>Favourite</span> Song</h1>
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
                                <Select
                                    options={artists}
                                    isMulti
                                    styles={customStyles}
                                    placeholder="Select artist(s)..."
                                    className={styles["select"]}
                                    value={formik.values.selectedArtists}
                                    onChange={(selectedOptions) => formik.setFieldValue('selectedArtists', selectedOptions)}
                                    onBlur={() => formik.setFieldTouched('selectedArtists', true)}
                                />
                                {formik.touched.selectedArtists && formik.errors.selectedArtists && (
                                    <span className={styles["error"]}>{formik.errors.selectedArtists}</span>
                                )}
                            </div>

                            <div className={styles["input-group"]}>
                                <MDBTextArea
                                    className={styles["textarea"]}
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
                                    className={styles["input"]}
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
                                    className={styles["input"]}
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

                            <MDBBtn type="submit" disabled={formik.isSubmitting} className={styles["button"]}>
                                Add Song
                            </MDBBtn>
                        </form>
                    </div>
                    <ScrollToTopButton />
                </main>
            )}
        </>
    );
}

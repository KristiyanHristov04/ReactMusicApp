import Navigation from "../navigation/Navigation";
import styles from './EditSong.module.css';
import { supabase } from "../../supabase";
import { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Spinner from "../../components/spinner/Spinner";
import { MDBInput, MDBBtn, MDBTextArea, MDBFile } from "mdb-react-ui-kit";
import ScrollToTopButton from "../../components/scroll-to-top-button/ScrollToTopButton";
import { useResetScroll } from "../../hooks/useResetScroll";
import Select from 'react-select'
import { customStyles } from "../../common/editSongSelectStyles";
import { EditSchema } from "../../schemas/editSongSchema";
import { getArtistsForSelect, getSongInformation } from "../../services/editSongService";

export default function EditSong() {
    const [user] = useContext(AuthContext);
    const [artists, setArtists] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);

    const deleteFileNameRef = useRef('');

    useResetScroll();

    async function submitHandler(values, actions) {
        try {
            const fileName = Date.now();

            const { data: songData, error: songError } = await supabase.storage
                .from('song-files')
                .upload(`song-audios/${fileName}`, values.song);

            if (songError) {
                throw new Error(songError.message);
            }

            const { data: songImageData, error: songImageError } = await supabase.storage
                .from('song-files')
                .upload(`song-images/${fileName}`, values.songImage);

            if (songImageError) {
                throw new Error(songImageError.message);
            }

            const songUrl = supabase.storage.from('song-files').getPublicUrl(songData.path).data.publicUrl;
            const songImageUrl = supabase.storage.from('song-files').getPublicUrl(songImageData.path).data.publicUrl;

            const { data: editedSongData, error: editedSongError } = await supabase
                .from('songs')
                .update(
                    {
                        name: values.name,
                        lyrics: values.lyrics,
                        song_url: songUrl,
                        song_image_url: songImageUrl,
                        user_id: user.id,
                        file_name: fileName
                    }
                )
                .eq('id', params.id);

            if (editedSongError) {
                throw new Error(editedSongError.message);
            }

            const { error: filesDeleteError } = await supabase.storage
                .from('song-files')
                .remove([`song-audios/${deleteFileNameRef.current}`,
                `song-images/${deleteFileNameRef.current}`]);

            if (filesDeleteError) {
                throw new Error(error.message);
            }

            const { error: errorSongsArtistsDelete } = await supabase
                .from('songs_artists')
                .delete()
                .eq('song_id', params.id);

            if (errorSongsArtistsDelete) {
                throw new Error(errorSongsArtistsDelete.message);
            }

            const { error: errorSongsArtistsInsert } = await supabase
                .from('songs_artists')
                .insert(values.selectedArtists.map(artist => ({
                    song_id: params.id,
                    artist_id: artist.value
                })));

            if (errorSongsArtistsInsert) {
                throw new Error(errorSongsArtistsInsert.message);
            }

            console.log("Song edited successfully!", editedSongData);
            actions.resetForm();
            navigate('/', { state: { message: "Song edited successfully!", variant: "success" } });
        } catch (error) {
            console.error(error.message);
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
        validationSchema: EditSchema,
        onSubmit: submitHandler
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const artists = await getArtistsForSelect(params.id);
                const songInformation = await getSongInformation(params.id);

                if (songInformation.length === 0) {
                    navigate('/', { state: { message: "Song doesn't exist!", variant: "danger" } });
                    return;
                }

                if (songInformation[0].user_id !== user.id) {
                    navigate('/', { state: { message: "You do not have permission to this song!", variant: "warning" } });
                    return;
                }

                formik.setValues(prevValues => ({
                    ...prevValues,
                    name: songInformation[0].name,
                    lyrics: songInformation[0].lyrics,
                    selectedArtists: songInformation[0].songs_artists.map(artist => ({
                        value: artist.artists.id,
                        label: artist.artists.name
                    }))
                }));

                deleteFileNameRef.current = songInformation[0].file_name;

                setArtists(artists);
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
                        <h1 className={styles["title"]}><span>Edit</span> Song</h1>
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

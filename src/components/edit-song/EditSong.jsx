import Navigation from "../navigation/Navigation";
import styles from './EditSong.module.css';
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
import Select from 'react-select'

export default function EditSong() {
    const [user] = useContext(AuthContext);
    const [artists, setArtists] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);

    
    const deleteFileNameRef = useRef('');

    useResetScroll();

    
    const customStyles = {
        control: (base, state) => ({
            ...base,
            background: '#3E3E3E',
            cursor: 'pointer',
            height: '49px',
        }),
        menu: (base) => ({
            ...base,
            background: '#282828',
            border: '1px solidrgb(170, 64, 64)',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#3E3E3E' : '#282828',
            color: '#fff',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#3E3E3E'
            }
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#6d1db9',
            color: '#fff',
            borderRadius: '4px',
            padding: '2px 8px',
            margin: '2px',
            '& > div': {
                color: '#fff'
            }
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#fff',
            ':hover': {
                backgroundColor: '#dd4e4e',
                color: '#fff'
            }
        }),
        singleValue: (base) => ({
            ...base,
            color: '#fff'
        }),
        placeholder: (base) => ({
            ...base,
            color: '#B3B3B3'
        }),
        input: (base) => ({
            ...base,
            color: '#fff'
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: '#fff',
            '& svg': {
                transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s ease',
                fill: '#fff'
            },
            '& svg path': {
                fill: '#fff'
            }
        })
    };

    useEffect(() => {
        async function getArtists() {
            try {
                const { data, error } = await supabase
                    .from('artists')
                    .select('id, name');

                if (error) {
                    throw new Error(error.message);
                }

                console.log(data);
                setArtists(data.map(artist => ({
                    value: artist.id,
                    label: artist.name
                })));
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        getArtists();
    }, []);

    const EditSchema = Yup.object().shape({
        name: Yup.string().required('Please enter song name.'),
        lyrics: Yup.string().required('Please enter song lyrics.'),
        song: Yup.mixed().required('Please upload audio of the song.'),
        songImage: Yup.mixed().required('Please upload image of the song.'),
        selectedArtists: Yup.array().min(1, 'Please select at least one artist.').required('Please select at least one artist.'),
    });

    async function submitHandler(values, actions) {
        console.log(values);

        try {
            const fileName = Date.now();
            const songFileName = fileName;
            const songImageName = fileName;

            console.log(songFileName, songImageName);

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

            const songUrl = supabase.storage.from('song-files').getPublicUrl(songData.path).data.publicUrl;
            const songImageUrl = supabase.storage.from('song-files').getPublicUrl(songImageData.path).data.publicUrl;

            // Insert song data into the database
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
        async function getSongInformation() {
            try {
                const { data: songsInformation, error: errorSongsInformation } = await supabase.from('songs')
                    .select()
                    .eq('id', params.id);

                if (errorSongsInformation) {
                    throw new Error(errorSongsInformation.message);
                }

                if (songsInformation.length === 0) {
                    navigate('/', { state: { message: "Song doesn't exist!", variant: "danger" } });
                    return;
                }

                if (songsInformation[0].user_id !== user.id) {
                    navigate('/', { state: { message: "You do not have permission to this song!", variant: "warning" } });
                    return;
                }

                const { data: songArtistsInformation, error: errorSongArtistsInformation } = await supabase
                    .from('songs_artists')
                    .select('artist_id')
                    .eq('song_id', params.id);

                if (errorSongArtistsInformation) {
                    throw new Error(errorSongArtistsInformation.message);
                }

                const { data: artistsInformation, error: errorArtistsInformation } = await supabase
                    .from('artists')
                    .select('id, name')
                    .in('id', songArtistsInformation.map(artist => artist.artist_id));

                if (errorArtistsInformation) {
                    throw new Error(errorArtistsInformation.message);
                }

                formik.setValues(prevValues => ({
                    ...prevValues,
                    name: songsInformation[0].name,
                    lyrics: songsInformation[0].lyrics,
                    selectedArtists: artistsInformation.map(artist => ({
                        value: artist.id,
                        label: artist.name
                    }))
                }));

                deleteFileNameRef.current = songsInformation[0].file_name;
            } catch (e) {
                console.error(e.message);
            } finally {
                setIsLoading(false);
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

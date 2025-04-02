import Navigation from '../navigation/Navigation';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useContext, useEffect, useState, useRef } from "react";
import { MDBInput, MDBBtn, MDBTextArea } from "mdb-react-ui-kit";
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/spinner/Spinner';
import ScrollToTopButton from '../../components/scroll-to-top-button/ScrollToTopButton';
import { useResetScroll } from '../../hooks/useResetScroll';

import styles from './DeleteArtist.module.css';

export default function DeleteArtist() {
    const params = useParams();
    const [artist, setArtist] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();

    const deleteFileNameRef = useRef('');

    useResetScroll();

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

                setArtist({
                    name: artistInformation[0].name,
                    biography: artistInformation[0].biography
                });


                deleteFileNameRef.current = artistInformation[0].file_name;
                setIsLoading(false);
            } catch (e) {
                console.error(e.message);
                navigate('/', { state: { message: "Something went wrong!", variant: "danger" } });
            } finally {
                actions.setSubmitting(false);
            }
        }

        getArtistInformation();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const { data: artistToDelete, error: errorArtistToDelete } = await supabase.from('artists')
                .select()
                .eq('id', params.id);

            if (errorArtistToDelete) {
                throw new Error(errorArtistToDelete.message);
            }

            const { data: songsByDeletedArtist, error: errorSongsByDeletedArtist } = await supabase.from('songs_artists')
                .select('song_id')
                .eq('artist_id', params.id);

            if (errorSongsByDeletedArtist) {
                throw new Error(errorSongsByDeletedArtist.message);
            }

            const {error: deleteSongsByDeletedArtistError } = await supabase.from('songs')
                .delete()
                .in('id', songsByDeletedArtist.map(song => song.song_id))
                .select();

            if (deleteSongsByDeletedArtistError) {
                throw new Error(deleteSongsByDeletedArtistError.message);
            }

            const { error: errorArtistDelete } = await supabase.from('artists')
                .delete()
                .eq('id', params.id)
                .select();

            if (errorArtistDelete) {
                throw new Error(errorSongsDelete.message);
            }

            const { error: deleteArtistFileError } = await supabase.storage
                .from('song-files')
                .remove([`artist-images/${deleteFileNameRef.current}`]);

            if (deleteArtistFileError) {
                throw new Error(deleteArtistFileError.message);
            }

            navigate('/', { state: { message: "Artist deleted successfully!", variant: "success" } });
        } catch (e) {
            console.error(e.message);
        }

    }

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
            <Navigation showSearchBar={false} />
            <main className={styles["main"]}>
                <div className={styles["form-container"]}>
                    <h1 className={styles["title"]}><span>Delete</span> artist</h1>
                    <form onSubmit={handleSubmit} className={styles["form"]}>
                        <div className={styles["input-group"]}>
                            <MDBInput
                                label="Name"
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={artist.name}
                                disabled
                            />

                        </div>

                        <div className={styles["input-group"]}>
                            <MDBTextArea
                                className={styles["textarea"]}
                                rows={6}
                                label="Biography"
                                id="biography"
                                name="artistBiography"
                                defaultValue={artist.biography}
                                disabled
                            />
                        </div>

                        <MDBBtn type="submit">Delete Artist</MDBBtn>
                    </form>
                </div>
                <ScrollToTopButton />
            </main>
        </>
    );
}
import Navigation from '../navigation/Navigation';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useContext, useEffect, useState, useRef } from "react";
import { MDBInput, MDBBtn, MDBTextArea } from "mdb-react-ui-kit";
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/spinner/Spinner';
import ScrollToTopButton from '../../components/scroll-to-top-button/ScrollToTopButton';
import { useResetScroll } from '../../hooks/useResetScroll';

import styles from './DeleteSong.module.css';

export default function DeleteSong() {
    const params = useParams();
    const [song, setSong] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useContext(AuthContext);
    const navigate = useNavigate();

    
    const deleteFileNameRef = useRef('');
    
    useResetScroll();

    useEffect(() => {
        async function getSongInformation() {
            try {
                const { data: songsInformation, error: errorSongsInformation } = await supabase.from('songs')
                    .select()
                    .eq('id', params.id);

                console.log(songsInformation);

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

                setSong({
                    name: songsInformation[0].name,
                    // artist: songsInformation[0].artist,
                    lyrics: songsInformation[0].lyrics
                });


                deleteFileNameRef.current = songsInformation[0].file_name;
                console.log(deleteFileNameRef.current);
            } catch (e) {
                console.error(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        getSongInformation();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        console.log('Song deleted');

        try {
            const { error: errorSongsDelete } = await supabase.from('songs')
                .delete()
                .eq('id', params.id);

            if (errorSongsDelete) {
                throw new Error(errorSongsDelete.message);
            }


            const { error: filesDeleteError } = await supabase.storage
                .from('song-files')
                .remove([`song-audios/${deleteFileNameRef.current}`,
                `song-images/${deleteFileNameRef.current}`]);

            if (filesDeleteError) {
                throw new Error(filesDeleteError.message);
            }

            navigate('/', { state: { message: "Song deleted successfully!", variant: "success" } });
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
                    <h1 className={styles["title"]}><span>Delete</span> song</h1>
                    <form onSubmit={handleSubmit} className={styles["form"]}>
                        <div className={styles["input-group"]}>
                            <MDBInput
                                label="Name"
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={song.name}
                                disabled
                            />

                        </div>

                        <div className={styles["input-group"]}>
                            <MDBTextArea
                                className={styles["textarea"]}
                                rows={6}
                                label="Lyrics"
                                id="lyrics"
                                name="lyrics"
                                defaultValue={song.lyrics}
                                disabled
                            />
                        </div>

                        <MDBBtn type="submit">Delete Song</MDBBtn>
                    </form>
                </div>
                <ScrollToTopButton />
            </main>
        </>
    );
}
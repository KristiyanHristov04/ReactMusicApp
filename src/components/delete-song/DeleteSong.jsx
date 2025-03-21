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
                const { data, error } = await supabase.from('songs')
                    .select()
                    .eq('id', params.id);

                console.log(data);

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

                setSong({
                    name: data[0].name,
                    artist: data[0].artist,
                    lyrics: data[0].lyrics
                });


                deleteFileNameRef.current = data[0].file_name;
                console.log(deleteFileNameRef.current);

                setIsLoading(false);
            } catch (e) {
                console.error(e.message);
            }
        }

        getSongInformation();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        console.log('Song deleted');

        try {
            const { error } = await supabase.from('songs')
                .delete()
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
                throw new Error(filesDeleteError.message);
            }

            navigate('/');
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
                                label="Song Name"
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={song.name}
                                disabled
                            />

                        </div>

                        <div className={styles["input-group"]}>
                            <MDBInput
                                label="Artist Name"
                                id="artist"
                                name="artist"
                                type="text"
                                defaultValue={song.artist}
                                disabled
                            />
                        </div>

                        <div className={styles["input-group"]}>
                            <MDBTextArea
                                rows={6}
                                label="Song Lyrics"
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
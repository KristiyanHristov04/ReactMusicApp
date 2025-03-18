import Navigation from '../navigation/Navigation';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useContext, useEffect, useState } from "react";
import { MDBInput, MDBBtn, MDBTextArea } from "mdb-react-ui-kit";
import AuthContext from '../context/AuthContext';
import Spinner from '../spinner/Spinner';

import styles from './DeleteSong.module.css';

export default function DeleteSong() {

    // const [user] = useContext(AuthContext);
    const params = useParams();
    const [song, setSong] = useState();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useContext(AuthContext);

    useEffect(() => {
        async function getSongInformation() {
            const { data, error } = await supabase.from('songs')
                .select()
                .eq('id', params.id);

            if (error) {
                console.error(error.message);
                return;
            }

            if (data[0].user_id !== user.id) {
                navigate('/');
            }

            console.log(data);
            setSong({
                name: data[0].name,
                artist: data[0].artist,
                lyrics: data[0].lyrics
            });
            setIsLoading(false);
        }

        getSongInformation();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        console.log('Song deleted');

        const { data, error } = await supabase.from('songs')
            .delete()
            .eq('id', params.id);

        if (error) {
            console.error(error.message);
        }

        navigate('/');
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
                    <h1 className={styles["title"]}>Are you sure you want to <span>Delete</span>  this song?</h1>
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
            </main>
        </>
    );
}
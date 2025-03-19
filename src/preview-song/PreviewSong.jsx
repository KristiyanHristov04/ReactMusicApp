import { useContext, useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import { Link, NavLink, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import styles from './PreviewSong.module.css'
import SongPlayer from "./song-player/SongPlayer";
import SongLyrics from "./song-lyrics/SongLyrics";
import AuthContext from "../context/AuthContext";
import Spinner from "../spinner/Spinner";

export default function PreviewSong() {
    const params = useParams();
    const [song, setSong] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const getSong = async () => {
            try {
                const { data, error } = await supabase
                    .from('songs')
                    .select()
                    .eq('id', params.id);

                if (error) {
                    throw new Error(error.message);
                }

                if (data.length === 0) {
                    navigate('/');
                }

                setSong(data[0]);
                setIsLoading(false);
            } catch (e) {
                console.error(e.message);
            }

        }

        getSong();
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
            <main className={styles["main"]}>
                <section className={styles["section"]}>
                    <article>
                        <SongPlayer
                            id={song.id}
                            name={song.name}
                            artist={song.artist}
                            thumbnailImage={song.song_image_url}
                            artistImage={song.artist_image_url}
                            songUrl={song.song_url}
                        />
                    </article>
                    <article>
                        <SongLyrics lyrics={song.lyrics} />
                    </article>
                    {user?.id === song.user_id && (
                        <>
                            <Link to={`/song/${song.id}/edit`}>Edit</Link>
                            <Link to={`/song/${song.id}/delete`}>Delete</Link>
                        </>
                    )}
                </section>
            </main>
        </>
    );
}
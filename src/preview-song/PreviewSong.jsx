import { useContext, useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import { Link, NavLink, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import styles from './PreviewSong.module.css'
import SongPlayer from "./song-player/SongPlayer";
import SongLyrics from "./song-lyrics/SongLyrics";
import AuthContext from "../context/AuthContext";

export default function PreviewSong() {

    const params = useParams();
    const [song, setSong] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [user] = useContext(AuthContext);


    useEffect(() => {
        console.log(params.id);

        const getSong = async () => {
            const { data, error } = await supabase.from('songs').select().eq('id', params.id);
            if (error) {
                console.error(error.message);
                return;
            }
            console.log(data[0]);
            setSong(data[0]);
            setIsLoading(false);
        }

        getSong();
    }, []);

    return (
        <>
            <Navigation />
            {!isLoading &&
                <>
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
                            {!isLoading && user.id === song.user_id &&
                                <>
                                    <Link to={`/${song.id}/edit`}>Edit</Link>
                                    <Link to={`/${song.id}/delete`}>Delete</Link>
                                </>
                            }
                        </section>

                    </main>
                </>}
        </>
    );
}
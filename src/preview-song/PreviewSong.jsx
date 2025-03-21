import { useContext, useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import { Link, NavLink, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import styles from './PreviewSong.module.css'
import SongPlayer from "./song-player/SongPlayer";
import SongLyrics from "./song-lyrics/SongLyrics";
import AuthContext from "../context/AuthContext";
import Spinner from "../spinner/Spinner";
import { MdDeleteOutline } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import ScrollToTopButton from "../scroll-to-top-button/ScrollToTopButton";



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
                <div className={styles["content-wrapper"]}>
                    <section className={styles["song-section"]}>
                        <div className={styles["player-section"]}>
                            <SongPlayer
                                id={song.id}
                                name={song.name}
                                artist={song.artist}
                                thumbnailImage={song.song_image_url}
                                artistImage={song.artist_image_url}
                                songUrl={song.song_url}
                            />
                            {user?.id === song.user_id && (
                                <div className={styles["song-actions"]}>
                                    <Link to={`/song/${song.id}/edit`} className={styles["action-button"]}>
                                        <TbEdit className={styles["action-icon"]} />
                                        <span>Edit</span>
                                    </Link>
                                    <Link to={`/song/${song.id}/delete`} className={`${styles["action-button"]} ${styles["delete"]}`}>
                                        <MdDeleteOutline className={styles["action-icon"]} />
                                        <span>Delete</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className={styles["lyrics-section"]}>
                            <SongLyrics lyrics={song.lyrics} />
                        </div>
                    </section>
                </div>
            </main>
            <ScrollToTopButton />
        </>
    );
}
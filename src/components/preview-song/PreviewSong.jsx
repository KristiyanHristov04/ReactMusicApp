import { useContext, useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import { Link, NavLink, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import styles from './PreviewSong.module.css'
import SongPlayer from "./song-player/SongPlayer";
import SongLyrics from "./song-lyrics/SongLyrics";
import AuthContext from "../../context/AuthContext";
import Spinner from "../spinner/Spinner";
import { MdDeleteOutline } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import ScrollToTopButton from "../scroll-to-top-button/ScrollToTopButton";
import { useResetScroll } from "../../hooks/useResetScroll";
import { FaPlay } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa6";

export default function PreviewSong() {
    const params = useParams();
    const [song, setSong] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [user] = useContext(AuthContext);
    const [totalListenings, setTotalListenings] = useState(0);
    const [isTop3, setIsTop3] = useState(false);
    const [rank, setRank] = useState(null);
    const navigate = useNavigate();

    useResetScroll();

    useEffect(() => {
        const getSong = async () => {
            try {
                const { data: songData, error: songError } = await supabase
                    .from('songs')
                    .select()
                    .eq('id', params.id);

                if (songError) {
                    throw new Error(songError.message);
                }

                if (songData.length === 0) {
                    navigate('/', { state: { message: "Song doesn't exist!", variant: "danger" } });
                }

                const { data: topSongs, error: topError } = await supabase
                    .from('songs')
                    .select('id, total_listenings')
                    .order('total_listenings', { ascending: false })
                    .limit(3);

                if (topError) {
                    throw new Error(topError.message);
                }

                const songRank = topSongs.findIndex(s => s.id === songData[0].id) + 1;
                if (songRank > 0) {
                    setIsTop3(true);
                    setRank(songRank);
                }

                setTotalListenings(songData[0].total_listenings);
                setSong(songData[0]);
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
                                songId={song.id}
                                songName={song.name}
                                songArtist={song.artist}
                                songThumbnailImage={song.song_image_url}
                                songArtistImage={song.artist_image_url}
                                songUrl={song.song_url}
                            />
                            <div className={`${styles["total-listenings"]} ${user?.id === song.user_id ? styles["with-actions"] : styles["without-actions"]} ${isTop3 ? styles["top-3"] : ""}`}>
                                {isTop3 && (
                                    <div className={styles["trophy-container"]}>
                                        <FaTrophy className={styles["trophy-icon"]} />
                                        <span className={styles["rank"]}>#{rank}</span>
                                        <div className={styles["tooltip"]}>
                                            #{rank} Most Listened Song!
                                        </div>
                                    </div>
                                )}
                                <FaHeadphones size={20} />
                                <p>Total Listenings: {totalListenings.toLocaleString()}</p>
                            </div>
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
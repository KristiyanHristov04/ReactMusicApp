import styles from "./Artist.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { supabase } from "../../supabase";
import Navigation from "../navigation/Navigation";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { MdDeleteOutline } from "react-icons/md";
import { TbEdit } from "react-icons/tb";

export default function Artist() {
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [artist, setArtist] = useState(null);
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const getArtist = async () => {
            try {
                const { data: artistData, error: errorArtist } = await supabase
                    .from('artists')
                    .select(`
                        id,
                        name,
                        artist_image_url,
                        biography,
                        user_id,
                        songs_artists (
                            songs (
                                id,
                                name,
                                song_url,
                                song_image_url,
                                total_listenings
                            )
                        )
                    `)
                    .eq('id', params.id)
                    .maybeSingle();

                    
                if (errorArtist) {
                    throw new Error(errorArtist.message);
                }

                if (!artistData) {
                    navigate('/', { state: { message: "Artist doesn't exist!", variant: "danger" } });
                    return;
                }

                // console.log(artistData);


                artistData.songs_artists.sort((a, b) =>
                    b.songs.total_listenings - a.songs.total_listenings
                );

                // console.log(artistData);

                setArtist(artistData);
                setIsLoading(false);
            } catch (e) {
                console.error(e.message);
                navigate('/', { state: { message: "Something went wrong!", variant: "danger" } });
            }
        }

        getArtist();
    }, [])

    if (isLoading) {
        return (
            <>
                <Navigation />
                <main className={styles.main}>
                    <Spinner />
                </main>
            </>
        );
    }

    return (
        <>
            <Navigation />
            <main className={styles.main}>
                <div className={styles["artist-container"]}>
                    <div className={styles["artist-header"]}>
                        <img
                            src={artist.artist_image_url}
                            alt={artist.name}
                            className={styles["artist-image"]}
                        />
                        <h1 className={styles["artist-name"]}>{artist.name}</h1>
                    </div>
                    <div className={styles["artist-biography"]}>
                        <p>{artist.biography}</p>
                    </div>
                    <div className={styles["songs-section"]}>
                        <h2 className={styles["songs-title"]}>Popular Songs</h2>
                        <div className={styles["table-container"]}>
                            <table className={styles["songs-table"]}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Total Listenings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {artist.songs_artists.map((songArtist, index) => (
                                        <tr key={songArtist.songs.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img
                                                    src={songArtist.songs.song_image_url}
                                                    alt={songArtist.songs.name}
                                                    className={styles["song-image"]}
                                                />
                                            </td>
                                            <td><Link className={styles["song-link"]} to={`/song/${songArtist.songs.id}/preview`}>{songArtist.songs.name}</Link></td>
                                            <td>{songArtist.songs.total_listenings}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {user?.id === artist.user_id && (
                        <div className={styles["artist-actions"]}>
                            <Link to={`/artist/${artist.id}/edit`} className={styles["action-button"]}>
                                <TbEdit className={styles["action-icon"]} />
                                <span>Edit</span>
                            </Link>
                            <Link to={`/artist/${artist.id}/delete`} className={`${styles["action-button"]} ${styles["delete"]}`}>
                                <MdDeleteOutline className={styles["action-icon"]} />
                                <span>Delete</span>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

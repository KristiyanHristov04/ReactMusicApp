import styles from "./Artist.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import Navigation from "../navigation/Navigation";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router-dom";

export default function Artist() {
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [artist, setArtist] = useState(null);

    useEffect(() => {
        const getArtist = async () => {
            try {
                // const { data: artistData, error: errorArtist } = await supabase
                //     .from('artists')
                //     .select('id, name, artist_image_url, biography')
                //     .eq('id', params.id)
                //     .single();

                const { data: artistData, error: errorArtist } = await supabase
                    .from('artists')
                    .select(`
                        id,
                        name,
                        artist_image_url,
                        biography,
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
                    .single();

                artistData.songs_artists.sort((a, b) =>
                    b.songs.total_listenings - a.songs.total_listenings
                );

                console.log(artistData);

                if (errorArtist) {
                    throw new Error(errorArtist.message);
                }

                setArtist(artistData);
            } catch (e) {
                console.error(e.message);
            } finally {
                setIsLoading(false);
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
                </div>
            </main>
        </>
    );
}

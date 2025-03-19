import Navigation from "../navigation/Navigation";
import Song from "../song/Song";
import styles from './Explore.module.css'
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { MdOutlineLibraryMusic } from "react-icons/md";
import Spinner from "../spinner/Spinner";
export default function Explore() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSongs = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('songs')
                    .select()
                    .order('id', { ascending: false });

                if (error) {
                    setLoading(false);
                    throw new Error(error.message);
                }

                console.log(data);
                setSongs(data);
                setLoading(false);
            } catch (e) {
                console.error(e.message);
            }

        }

        getSongs();
    }, []);

    if (loading) {
        return (
            <>
                <Navigation showSearchBar={true} setSongs={setSongs} />
                <main className={styles.main}>
                    <Spinner />
                </main>
            </>
        )
    }

    return (
        <>
            <Navigation showSearchBar={true} setSongs={setSongs} />
            <main className={styles.main}>
                {songs.length > 0 ? songs.map(song => (
                    <Song
                        key={song.id}
                        id={song.id}
                        name={song.name}
                        artist={song.artist}
                        thumbnailImage={song.song_image_url}
                        artistImage={song.artist_image_url}
                    />
                )) :
                    (<div className={styles["no-songs-container"]}>
                        <MdOutlineLibraryMusic />
                        <h2>No songs found</h2>
                        <p>
                            {songs.length === 0
                                ? "Start by adding your favorite songs or try a different search term."
                                : "No songs match your search. Try a different search term."}
                        </p>
                    </div>
                    )}
            </main>
        </>
    )
}
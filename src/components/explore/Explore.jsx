import Navigation from "../navigation/Navigation";
import Song from "../../components/song/Song";
import styles from './Explore.module.css'
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { MdOutlineLibraryMusic } from "react-icons/md";
import Spinner from "../../components/spinner/Spinner";
import Alert from "../alert/Alert";
import { useLocation } from "react-router-dom";

export default function Explore() {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const getSongs = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('songs')
                    .select()
                    .order('id', { ascending: false });

                if (error) {
                    setIsLoading(false);
                    throw new Error(error.message);
                }

                console.log(data);
                setSongs(data);
                setIsLoading(false);
            } catch (e) {
                console.error(e.message);
            }

        }

        getSongs();
    }, []);

    if (isLoading) {
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
            {
                location.state?.message && <Alert
                    variant={location.state?.variant}
                    message={location.state?.message}
                />
            }

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
                            Create a song or try a different search term.
                        </p>
                    </div>
                    )}
            </main>
        </>
    )
}
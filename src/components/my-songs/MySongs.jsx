import Navigation from "../navigation/Navigation";
import Song from "../song/Song";
import styles from './MySongs.module.css'
import { useEffect, useState, useContext } from "react";
import { supabase } from "../../supabase";
import { MdOutlineLibraryMusic } from "react-icons/md";
import Spinner from "../spinner/Spinner";
import AuthContext from "../../context/AuthContext";

export default function MySongs() {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user] = useContext(AuthContext);

    useEffect(() => {
        const getMySongs = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('songs')
                    .select()
                    .eq('user_id', user.id)
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
                setIsLoading(false);
            }
        }

        getMySongs();
    }, [user.id]);

    if (isLoading) {
        return (
            <>
                <Navigation showSearchBar={true} setSongs={setSongs} isMine={true} />
                <main className={styles.main}>
                    <Spinner />
                </main>
            </>
        )
    }

    return (
        <>
            <Navigation showSearchBar={true} setSongs={setSongs} isMine={true} />
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
                                ? "You haven't created any songs yet. Start by adding your own songs!"
                                : "No songs match your search. Try a different search term."}
                        </p>
                    </div>
                    )}
            </main>
        </>
    )
} 
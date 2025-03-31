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
                const { data: songsInformation, error: errorSongsInformation } = await supabase
                    .from('songs')
                    .select(`
                    id,
                    name,
                    song_image_url,
                    song_url,
                    songs_artists (
                        artists (
                            id,
                            name,
                            artist_image_url
                        )
                    )
                `)
                    .eq('user_id', user.id)
                    .order('id', { ascending: false });

                if (errorSongsInformation) {
                    throw new Error(errorSongsInformation.message);
                }

                const songs = songsInformation.map(song => ({
                    id: song.id,
                    name: song.name,
                    song_image_url: song.song_image_url,
                    song_url: song.song_url,
                    artists: song.songs_artists.map(artist => artist.artists)
                }));

                setSongs(songs);
            } catch (e) {
                console.error(e.message);
            } finally {
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
                        artists={song.artists}
                        thumbnailImage={song.song_image_url}
                        // artistImage={song.artist_image_url}
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
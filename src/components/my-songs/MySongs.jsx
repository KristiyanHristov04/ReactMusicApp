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
                const { data: songsInformation, error: errorSongsInformation } = await supabase
                    .from('songs')
                    .select()
                    .eq('user_id', user.id)
                    .order('id', { ascending: false });

                if (errorSongsInformation) {
                    setIsLoading(false);
                    throw new Error(errorSongsInformation.message);
                }

                const songs = songsInformation.map(song => {
                    return {
                        id: song.id,
                        name: song.name,
                        song_image_url: song.song_image_url,
                        song_url: song.song_url,
                        artists: [],
                        artist_image_url: ''
                    }
                });

                console.log(songs);
                // setSongs(data);

                for (const song of songs) {
                    const { data: artistsInformation, error: errorArtistsInformation } = await supabase
                        .from('songs_artists')
                        .select()
                        .eq('song_id', song.id);

                    if (errorArtistsInformation) {
                        throw new Error(errorArtistsInformation.message);
                    }

                    const { data: artistsData, error: errorArtistsData } = await supabase
                        .from('artists')
                        .select()
                        .in('id', artistsInformation.map(artist => artist.artist_id));

                    if (errorArtistsData) {
                        throw new Error(errorArtistsData.message);
                    }

                    song.artist_image_url = artistsData[0].artist_image_url;

                    song.artists = artistsData.map(artist => ({
                        id: artist.id,
                        name: artist.name
                    }));
                }

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
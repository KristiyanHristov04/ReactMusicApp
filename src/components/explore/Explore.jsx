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
                const { data: songsInformation, error: errorSongsInformation } = await supabase
                    .from('songs')
                    .select()
                    .order('id', { ascending: false });

                if (errorSongsInformation) {
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
            }
            finally {
                setIsLoading(false);
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
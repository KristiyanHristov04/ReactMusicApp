import Navigation from "../navigation/Navigation";
import styles from './Favourites.module.css';
import { useState, useEffect, useContext } from "react";
import { supabase } from "../../supabase";
import Song from "../song/Song";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";
import { MdOutlineLibraryMusic } from "react-icons/md";

export default function Favourites() {
    const [songs, setSongs] = useState([]);
    const [favouriteSongsIds, setFavouriteSongsIds] = useState(null);
    const [user] = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getFavouriteSongsIds = async () => {
            console.log(user.id);
            try {
                const { data: favouriteSongsIds, error: errorFavouriteSongsIds } = await supabase
                    .from('users_favourite_songs')
                    .select('song_id')
                    .eq('user_id', user.id);

                if (errorFavouriteSongsIds) {
                    throw new Error(errorFavouriteSongsIds.message);
                }

                const songIds = [];
                favouriteSongsIds.forEach(song => songIds.push(song.song_id));

                return songIds;
            } catch (e) {
                console.error(e.message);
            }
        };

        const getSongs = async () => {
            try {
                const songIds = await getFavouriteSongsIds();
                setFavouriteSongsIds(songIds);

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
                    .in('id', songIds)
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
            <Navigation
                showSearchBar={true}
                setSongs={setSongs}
                favouriteSongsIds={favouriteSongsIds}
            />
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
                            Start by adding your favorite songs or try a different search term.
                        </p>
                    </div>
                    )}
            </main>
        </>

    );
}